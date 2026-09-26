import '../css/WeatherForecast.css';
import { formatLocationTime, isDaytime, safeUntilText, sunOffsetF } from './solar';
import { finiteWind, forecastWindText, forecastWindTone } from './wind';

interface WindFields {
    wind?: { speed?: number; gust?: number };
}

interface ForecastData {
    cod: number | string;
    city?: { sunrise?: number; sunset?: number; timezone?: number };
    list: Array<{
        dt: number;
        main: { temp: number; humidity: number };
        dt_txt: string;
        weather: { id: number; main: string }[];
    } & WindFields>;
}

interface CurrentWeather extends WindFields {
    dt?: number;
    timezone?: number;
    weather?: { id: number; main: string }[];
    sys?: { sunrise?: number; sunset?: number };
}

interface Settings {
    humidityThreshold: number;
    carTempIncrease: number; // No carTempEstimatorEnabled
}

interface ForecastItem {
    time: string;
    temp: number;
    humidity: number;
    weatherIcon: string;
    windSpeed?: number;
    windGust?: number;
}

export function setupWeatherForecast(
    container: HTMLElement,
    weatherService: { fetchWeatherData: () => Promise<[any, ForecastData]> },
    checkSafety: (temp: number) => { status: string },
    getTempColor: (temp: number) => string,
    getHumidityColor: (humidity: number) => string,
    parkingComponent: { getParkingCondition: () => string }
) {
    let safetyCheck = checkSafety;
    let tempColor = getTempColor;
    let humidityColor = getHumidityColor;
    let lastCurrentTemp = 0;
    let lastCurrentHumidity = 0;
    let lastIsCurrentlySafe = false;
    let lastCurrentStatus = 'not-safe';
    let settings = loadSettings();

    function loadSettings(): Settings {
        const savedSettings = localStorage.getItem('pipeSafeSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            humidityThreshold: 80,
            carTempIncrease: 0, // Default to +0°F
        };
    }

    const blend = (targetTime: number, prevValue: number, prevDt: number, nextValue: number, nextDt: number): number => {
        if (!Number.isFinite(prevValue) || !Number.isFinite(nextValue) || prevDt >= nextDt) {
            return Number.isFinite(prevValue) ? prevValue : nextValue;
        }
        const fraction = (targetTime - prevDt) / (nextDt - prevDt);
        return prevValue + (nextValue - prevValue) * fraction;
    };

    // Clear sky uses sunrise/sunset at the weather location, not a fixed clock.
    const getWeatherIcon = (
        weather: { id: number; main: string }[],
        timestamp: number,
        sunrise?: number,
        sunset?: number,
        timezone?: number,
    ): string => {
        if (!weather || weather.length === 0) {
            // Invalid data - random Meteor or Dragon
            return Math.random() < 0.5 ? '<i class="fa-solid fa-meteor"></i>' : '<i class="fa-solid fa-dragon"></i>';
        }
        const condition = weather[0];
        const id = condition.id;
        const main = condition.main.toLowerCase();

        if (id === 800) {
            return isDaytime(timestamp, sunrise, sunset, timezone)
                ? '<i class="fa-solid fa-sun"></i>'
                : '<i class="fa-solid fa-moon"></i>';
        }
        if (id >= 801 && id <= 804) return '<i class="fa-solid fa-cloud"></i>'; // Cloudy
        if (main.includes('rain')) return '<i class="fa-solid fa-cloud-showers-heavy"></i>'; // Rainy
        if (main.includes('snow')) return '<i class="fa-solid fa-snowflake"></i>'; // Snowy
        if (main.includes('thunderstorm') || main.includes('lightning')) return '<i class="fa-solid fa-bolt-lightning"></i>'; // Lightning
        if (main.includes('wind')) return '<i class="fa-solid fa-wind"></i>'; // Windy
        if (main.includes('tornado')) return '<i class="fa-solid fa-tornado"></i>'; // Tornado
        if (main.includes('tsunami')) return '<i class="fa-solid fa-tornado"></i>'; // Tsunami (using tornado icon as proxy)
        if (main.includes('hurricane')) return '<i class="fa-solid fa-hurricane"></i>'; // Hurricane
        return '<i class="fa-solid fa-cloud"></i>'; // Default to Cloudy if unknown
    };

    const formatTwoDigits = (value: number): string => {
        return Number.isFinite(value) ? Math.round(value).toString().padStart(2, '0') : 'N/A';
    };

    const readWind = (point?: WindFields): { speed?: number; gust?: number } => ({
        speed: finiteWind(point?.wind?.speed),
        gust: finiteWind(point?.wind?.gust),
    });

    const windMarkup = (speed?: number, gust?: number): string => {
        const wind = forecastWindText(speed, gust);
        const tone = forecastWindTone(wind.high);
        const toneClass = tone === 'strong' ? ' wind-strong' : tone === 'amber' ? ' wind-amber' : '';
        return `<span class="wind${toneClass}" aria-label="${wind.aria}">
                    <span class="wind-line" aria-hidden="true"><i class="fa-solid fa-wind"></i> ${wind.text}</span>
                </span>`;
    };

    const updateForecast = (currentTemp: number, currentHumidity: number, isCurrentlySafe: boolean, currentStatus: string) => {
        lastCurrentTemp = currentTemp;
        lastCurrentHumidity = currentHumidity;
        lastIsCurrentlySafe = isCurrentlySafe;
        lastCurrentStatus = currentStatus;
        console.log("WeatherForecast: Updating forecast, currentTemp:", currentTemp);

        weatherService
            .fetchWeatherData()
            .then(([current, forecast]: [CurrentWeather, ForecastData]) => {
                console.log('WeatherForecast: Forecast fetched:', forecast);
                if (String(forecast.cod) !== '200') {
                    container.innerHTML = '<p>Error: Invalid forecast response.</p>';
                    return;
                }

                console.log('WeatherForecast: Loaded settings:', settings);
                const parkingCondition = parkingComponent.getParkingCondition();
                const sunrise = current.sys?.sunrise ?? forecast.city?.sunrise;
                const sunset = current.sys?.sunset ?? forecast.city?.sunset;
                const timezone = current.timezone ?? forecast.city?.timezone;
                const hourLabel = (unix: number) => formatLocationTime(unix, timezone, false);
                const clockLabel = (unix: number) => formatLocationTime(unix, timezone, true);

                // "Now" is the estimated interior from WeatherDisplay. Later hours add the
                // sun offset only when that hour is daytime and the car is In Open.
                const nowUnix = Math.floor(Date.now() / 1000);
                const twelveHoursLater = nowUnix + 12 * 3600;
                const nowWind = readWind(current);
                const forecastItems: ForecastItem[] = [{
                    time: 'Now',
                    temp: currentTemp,
                    humidity: currentHumidity,
                    weatherIcon: getWeatherIcon(current.weather || [], current.dt ?? nowUnix, sunrise, sunset, timezone),
                    windSpeed: nowWind.speed,
                    windGust: nowWind.gust,
                }];

                const validPoints = (forecast.list || []).filter(
                    (item) =>
                        item.dt <= twelveHoursLater + 3600 &&
                        Number.isFinite(item.main?.temp) &&
                        Number.isFinite(item.main?.humidity),
                );
                const anchor = validPoints.filter((item) => item.dt < nowUnix).slice(-1);
                const ahead = validPoints.filter((item) => item.dt >= nowUnix).slice(0, 8);
                const apiPoints = [...anchor, ...ahead];

                if (apiPoints.length < 1) {
                    container.innerHTML = '<p>Error: No valid forecast data.</p>';
                    return;
                }

                for (let hour = 1; hour <= 12; hour++) {
                    const targetTime = nowUnix + hour * 3600;
                    const prevPoint = apiPoints.slice().reverse().find((p) => p.dt <= targetTime) || apiPoints[0];
                    const nextPoint = apiPoints.find((p) => p.dt >= targetTime) || apiPoints[apiPoints.length - 1];

                    const outside = (prevPoint.dt === targetTime || Math.abs(prevPoint.dt - targetTime) < 300)
                        ? prevPoint.main.temp
                        : blend(targetTime, prevPoint.main.temp, prevPoint.dt, nextPoint.main.temp, nextPoint.dt);
                    const humidity = (prevPoint.dt === targetTime || Math.abs(prevPoint.dt - targetTime) < 300)
                        ? prevPoint.main.humidity
                        : blend(targetTime, prevPoint.main.humidity, prevPoint.dt, nextPoint.main.humidity, nextPoint.dt);
                    const daytime = isDaytime(targetTime, sunrise, sunset, timezone);
                    const interior = outside + sunOffsetF(settings.carTempIncrease, parkingCondition, daytime);
                    const snapped = prevPoint.dt === targetTime || Math.abs(prevPoint.dt - targetTime) < 300;
                    const prevWind = readWind(prevPoint);
                    const nextWind = readWind(nextPoint);
                    let windSpeed: number | undefined;
                    let windGust: number | undefined;
                    if (snapped || prevPoint.dt >= nextPoint.dt) {
                        windSpeed = prevWind.speed;
                        windGust = prevWind.gust;
                    } else if (prevWind.speed != null && nextWind.speed != null) {
                        windSpeed = blend(targetTime, prevWind.speed, prevPoint.dt, nextWind.speed, nextPoint.dt);
                        if (prevWind.gust != null && nextWind.gust != null) {
                            windGust = blend(targetTime, prevWind.gust, prevPoint.dt, nextWind.gust, nextPoint.dt);
                        }
                    }
                    forecastItems.push({
                        time: hourLabel(targetTime),
                        temp: interior,
                        humidity,
                        weatherIcon: getWeatherIcon(prevPoint.weather || nextPoint.weather || [], targetTime, sunrise, sunset, timezone),
                        windSpeed,
                        windGust,
                    });
                }

                const future = forecastItems.slice(1).map((item, index) => ({
                    at: nowUnix + (index + 1) * 3600,
                    interior: item.temp,
                }));
                const forecastSummary = safeUntilText(
                    currentTemp,
                    future,
                    nowUnix,
                    clockLabel,
                    (interior) => safetyCheck(interior).status === 'not-safe',
                );

                // Render UI with weather icons
                container.innerHTML = `
          <p class="forecast-summary">${forecastSummary}</p>
          <div class="forecast-well">
            ${forecastItems
                        .map(
                            (item) => `
                <div class="forecast-box">
                  <span class="time">${item.time}</span>
                  <span class="weather-icon">${item.weatherIcon}</span>
                  <span class="temp" style="color: ${tempColor(item.temp)};"><i class="fa-solid fa-temperature-quarter"></i> ${formatTwoDigits(item.temp)}°F</span>
                  <span class="humidity" style="color: ${humidityColor(item.humidity)};"><i class="fa-solid fa-droplet"></i> ${formatTwoDigits(item.humidity)}%</span>
                  ${windMarkup(item.windSpeed, item.windGust)}
                </div>
              `
                        )
                        .join('')}
          </div>
        `;
            })
            .catch((error) => {
                console.error('WeatherForecast: Fetch error:', error);
                container.innerHTML = '<p>Error fetching forecast data.</p>';
            });
    };

    // WeatherDisplay refetches and calls updateForecast. Keep settings in sync first.
    document.addEventListener("settings-changed", (e: Event) => {
        settings = (e as CustomEvent).detail.settings;
        console.log('WeatherForecast: Settings changed, new settings:', settings);
    });

    return {
        updateForecast,
        setSafetyFns(
            nextCheck: (temp: number) => { status: string },
            nextTempColor: (temp: number) => string,
            nextHumidityColor: (humidity: number) => string,
        ) {
            safetyCheck = nextCheck;
            tempColor = nextTempColor;
            humidityColor = nextHumidityColor;
        },
    };
}
