/** Lighting is informational. It never changes the storage verdict. */

export type LightingLevel = 'easy' | 'breezy' | 'windy' | 'poor';

export interface Lighting {
    level: LightingLevel;
    speed: number;
    gust?: number;
    effective: number;
}

const LEVELS: LightingLevel[] = ['easy', 'breezy', 'windy', 'poor'];

export const LIGHTING_LABEL: Record<LightingLevel, string> = {
    easy: 'Easy to light',
    breezy: 'Breezy — cup the flame',
    windy: 'Windy — matches will fight you',
    poor: 'Poor lighting conditions',
};

export function finiteWind(value: unknown): number | undefined {
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

/**
 * Band comes from gust when the API sent one, otherwise sustained speed.
 * A gust at least 8 mph above the sustained speed raises the level one step.
 */
export function lightingLevel(speed: number | null | undefined, gust?: number | null): Lighting | null {
    if (!Number.isFinite(speed)) return null;
    const sustained = speed as number;
    const gustValue = finiteWind(gust);
    const effective = gustValue != null ? gustValue : sustained;
    let level: LightingLevel;
    if (effective <= 7) level = 'easy';
    else if (effective <= 12) level = 'breezy';
    else if (effective <= 18) level = 'windy';
    else level = 'poor';

    if (gustValue != null && gustValue - sustained >= 8) {
        level = LEVELS[Math.min(LEVELS.indexOf(level) + 1, LEVELS.length - 1)];
    }
    return { level, speed: sustained, gust: gustValue, effective };
}

export function lightingAria(level: LightingLevel): string {
    switch (level) {
        case 'easy':
            return 'Lighting: Easy to light';
        case 'breezy':
            return 'Lighting: Breezy, cup the flame';
        case 'windy':
            return 'Lighting: Windy, matches will fight you';
        case 'poor':
            return 'Lighting: Poor lighting conditions';
    }
}

export function lightingDetail(lighting: Lighting): string | null {
    if (lighting.level !== 'windy' && lighting.level !== 'poor') return null;
    const gust = lighting.gust != null ? Math.round(lighting.gust) : null;
    if (lighting.level === 'windy') {
        return gust != null
            ? `Gusts ${gust} mph. Shield the bowl.`
            : 'Expect to shield the bowl. Soft flame will struggle.';
    }
    return gust != null
        ? `${gust} mph gusts. Zippo, torch, or a windbreak.`
        : 'Strong wind. Use a Zippo/torch or find a windbreak.';
}

export function windAria(speed: number, gust?: number): string {
    const spoken = `Wind ${Math.round(speed)} miles per hour`;
    if (gust != null && Number.isFinite(gust) && gust > speed) {
        return `${spoken}, gusts ${Math.round(gust)}`;
    }
    return spoken;
}

export interface ForecastWindText {
    text: string;
    /** Highest mph actually shown. Missing when there is no wind reading. */
    high?: number;
    aria: string;
}

/**
 * Forecast card wind. One number unless the gust is at least 5 mph above sustained speed,
 * in which case the card shows speed–gust. The unit is spoken, not printed.
 */
export function forecastWindText(
    speed: number | null | undefined,
    gust?: number | null,
): ForecastWindText {
    if (!Number.isFinite(speed)) return { text: '—', aria: 'Wind unavailable' };
    const sustained = Math.round(speed as number);
    const gustValue = finiteWind(gust);
    const gustRounded = gustValue != null ? Math.round(gustValue) : undefined;
    const showRange = gustValue != null && gustValue >= (speed as number) + 5 && gustRounded != null && gustRounded > sustained;
    const high = showRange ? gustRounded : sustained;
    const text = showRange ? `${sustained}–${gustRounded}` : `${sustained}`;
    const aria = showRange
        ? `Wind ${sustained} to ${gustRounded} miles per hour`
        : `Wind ${sustained} miles per hour`;
    return { text, high, aria };
}

/** Amber only when the high number reaches a lighting band. Null leaves the default text color. */
export function forecastWindTone(high?: number): 'amber' | 'strong' | null {
    if (high == null || !Number.isFinite(high)) return null;
    if (high >= 19) return 'strong';
    if (high >= 13) return 'amber';
    return null;
}
