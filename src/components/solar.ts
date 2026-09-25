/** Tobacco short-term limits. Pipes tolerate more heat; cigars tolerate less. */
export const TOBACCO_COLD_F = 50;
export const TOBACCO_CAUTION_F = 78;
export const TOBACCO_LIMIT_F = 80;

const SOLAR_DAY_SECONDS = 86400;

/**
 * True when the sun is up at this location.
 * Sunrise and sunset from OpenWeather are Unix UTC seconds. `timezoneOffsetSeconds`
 * is the API `timezone` field (seconds east of UTC) and converts those instants
 * into the location's local clock. Daytime is `now >= sunrise && now < sunset`
 * on that local clock, including later forecast days. No fixed 9 PM–5 AM window.
 * Unknown sun times are treated as not daytime so the sun offset stays off.
 */
export function isDaytime(
    unixSeconds: number,
    sunrise?: number,
    sunset?: number,
    timezoneOffsetSeconds?: number,
): boolean {
    if (!Number.isFinite(unixSeconds) || !Number.isFinite(sunrise) || !Number.isFinite(sunset)) return false;
    const rise = sunrise as number;
    const set = sunset as number;
    if (!(set > rise)) return false;

    if (!Number.isFinite(timezoneOffsetSeconds)) {
        const cycles = Math.floor((unixSeconds - rise) / SOLAR_DAY_SECONDS);
        const riseToday = rise + cycles * SOLAR_DAY_SECONDS;
        const setToday = set + cycles * SOLAR_DAY_SECONDS;
        return unixSeconds >= riseToday && unixSeconds < setToday;
    }

    const localSeconds = (unix: number) => {
        const value = (unix + (timezoneOffsetSeconds as number)) % SOLAR_DAY_SECONDS;
        return value < 0 ? value + SOLAR_DAY_SECONDS : value;
    };
    const start = localSeconds(rise);
    const end = localSeconds(set);
    const now = localSeconds(unixSeconds);
    if (start === end) return false;
    if (start < end) return now >= start && now < end;
    return now >= start || now < end;
}

/** User sun offset. Applied only in daytime when the car is In Open. Never subtracts for shade. */
export function sunOffsetF(carTempIncrease: number, parking: string, daytime: boolean): number {
    if (!daytime || parking !== 'open') return 0;
    const increase = Number.isFinite(carTempIncrease) ? carTempIncrease : 0;
    return increase > 0 ? increase : 0;
}

export function interiorVerdict(interior: number): { status: string; reason: string } {
    if (!Number.isFinite(interior)) {
        return { status: 'not-safe', reason: 'Invalid data' };
    }
    const temp = Math.round(interior);
    if (temp < TOBACCO_COLD_F) {
        return { status: 'not-safe', reason: `Too cold: estimated interior ${temp}°F` };
    }
    if (temp > TOBACCO_LIMIT_F) {
        return { status: 'not-safe', reason: `Too hot: estimated interior ${temp}°F` };
    }
    if (temp >= TOBACCO_CAUTION_F) {
        return { status: 'warning', reason: `Estimated interior ${temp}°F is near the 80°F tobacco limit` };
    }
    return { status: 'safe', reason: 'Conditions ideal' };
}

export function interiorTempColor(temp: number): string {
    if (!Number.isFinite(temp)) return '#888888';
    const rounded = Math.round(temp);
    const clamped = Math.min(Math.max(rounded, TOBACCO_COLD_F), TOBACCO_LIMIT_F);
    const hue = 200 - ((clamped - TOBACCO_COLD_F) / (TOBACCO_LIMIT_F - TOBACCO_COLD_F)) * 200;
    return `hsl(${hue}, 70%, 60%)`;
}

/** Location wall-clock time. Offset is OpenWeather `timezone` (seconds). */
export function formatLocationTime(unixSeconds: number, timezoneOffsetSeconds?: number, withMinutes = true): string {
    const offset = Number.isFinite(timezoneOffsetSeconds)
        ? (timezoneOffsetSeconds as number)
        : -new Date().getTimezoneOffset() * 60;
    const shifted = new Date((unixSeconds + offset) * 1000);
    let hour = shifted.getUTCHours();
    const minute = shifted.getUTCMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    if (!withMinutes) return `${hour} ${ampm}`;
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * First future hour the estimated interior leaves the tobacco range (under 50°F or over 80°F).
 * Never reports the current clock time while the cabin is still inside that range.
 */
export function safeUntilText(
    nowInterior: number,
    future: { at: number; interior: number }[],
    nowUnix: number,
    formatTime: (unix: number) => string,
    isUnsafe: (interior: number) => boolean,
): string {
    if (isUnsafe(nowInterior)) return 'Not safe to leave in the car now';
    const nowLabel = formatTime(nowUnix);
    const breach = future.find((slot) => slot.at > nowUnix && formatTime(slot.at) !== nowLabel && isUnsafe(slot.interior));
    if (!breach) return 'Safe for 12+ hours';
    return `Safe until ${formatTime(breach.at)}`;
}
