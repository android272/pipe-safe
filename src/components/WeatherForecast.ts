import '../css/WeatherForecast.css';

interface ForecastData {
    cod: number | string;
    list: Array<{
        dt: number;
        main: { temp: number; humidity: number };
        dt_txt: string;
        weather: { id: number; main: string }[]; // Add weather array
    }>;
}

interface Settings {
    humidityThreshold: number;
    carTempIncrease: number; // No carTempEstimatorEnabled
}

interface ForecastItem {
    time: string;
    temp: number;
    humidity: number;
    weatherIcon: string; // Add weatherIcon
}

export function setupWeatherForecast(
    container: HTMLElement,
    weatherService: { fetchWeatherData: () => Promise<[any, ForecastData]> },
    checkSafety: (temp: number) => { status: string },
    getTempColor: (temp: number) => string,
    getHumidityColor: (humidity: number) => string,
    parkingComponent: { getParkingCondition: () => string }
) {
    const testMode = true;
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

    const interpolateHour = (
        targetTime: number,
        prev: { dt: number; temp: number; humidity: number; weather?: { id: number; main: string }[] },
        next: { dt: number; temp: number; humidity: number; weather?: { id: number; main: string }[] }
    ): ForecastItem => {
        if (
            !Number.isFinite(prev.temp) ||
            !Number.isFinite(next.temp) ||
            !Number.isFinite(prev.humidity) ||
            !Number.isFinite(next.humidity) ||
            prev.dt >= next.dt
        ) {
            return {
                time: new Date(targetTime * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                temp: prev.temp || next.temp || 0,
                humidity: prev.humidity || next.humidity || 0,
                weatherIcon: getWeatherIcon(prev.weather || []),
            };
        }
        const fraction = (targetTime - prev.dt) / (next.dt - prev.dt);
        return {
            time: new Date(targetTime * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
            temp: Math.round(prev.temp + (next.temp - prev.temp) * fraction),
            humidity: Math.round(prev.humidity + (next.humidity - prev.humidity) * fraction),
            weatherIcon: getWeatherIcon(prev.weather || []),
        };
    };

    // Add weather icon mapping function
    const getWeatherIcon = (weather: { id: number; main: string }[]): string => {
        if (!weather || weather.length === 0) {
            // Invalid data - random Meteor or Dragon
            return Math.random() < 0.5 ? '<i class="fa-solid fa-meteor"></i>' : '<i class="fa-solid fa-dragon"></i>';
        }
        const condition = weather[0]; // Use the first weather condition
        const id = condition.id;
        const main = condition.main.toLowerCase();

        if (id === 800) return '<i class="fa-solid fa-sun"></i>'; // Clear / Sunny
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

    const updateForecast = (currentTemp: number, currentHumidity: number, isCurrentlySafe: boolean, currentStatus: string) => {
        lastCurrentTemp = currentTemp;
        lastCurrentHumidity = currentHumidity;
        lastIsCurrentlySafe = isCurrentlySafe;
        lastCurrentStatus = currentStatus;
        console.log("WeatherForecast: Updating forecast, currentTemp:", currentTemp);

        weatherService
            .fetchWeatherData()
            .then(([current, forecast]: [any, ForecastData]) => {
                console.log('WeatherForecast: Forecast fetched:', forecast);
                if (!testMode && forecast.cod !== '200') {
                    container.innerHTML = '<p>Error: Invalid forecast response.</p>';
                    return;
                }

                console.log('WeatherForecast: Loaded settings:', settings);
                const parkingCondition = parkingComponent.getParkingCondition();
                console.log('WeatherForecast: Applying parking condition:', parkingCondition);
                let tempAdjustment = settings.carTempIncrease;
                if (parkingCondition === 'shade') {
                    tempAdjustment -= 5;
                }
                console.log('WeatherForecast: Temperature adjustment:', tempAdjustment);

                // Forecast (12 hours)
                const now = new Date();
                const nowUnix = Math.floor(now.getTime() / 1000);
                const twelveHoursLater = nowUnix + 12 * 3600;
                const forecastItems: ForecastItem[] = [{
                    time: 'Now',
                    temp: currentTemp,
                    humidity: currentHumidity,
                    weatherIcon: getWeatherIcon(current.weather || [])
                }];

                const apiPoints = (forecast.list || [])
                    .filter(
                        (item) =>
                            item.dt >= nowUnix &&
                            item.dt <= twelveHoursLater + 3600 &&
                            Number.isFinite(item.main?.temp) &&
                            Number.isFinite(item.main?.humidity)
                    )
                    .slice(0, 7);

                if (apiPoints.length < 1) {
                    container.innerHTML = '<p>Error: No valid forecast data.</p>';
                    return;
                }

                for (let hour = 1; hour <= 12; hour++) {
                    const targetTime = nowUnix + hour * 3600;
                    const prevPoint = apiPoints.slice().reverse().find((p) => p.dt <= targetTime) || apiPoints[0];
                    const nextPoint = apiPoints.find((p) => p.dt >= targetTime) || apiPoints[apiPoints.length - 1];

                    if (!prevPoint || !nextPoint) {
                        forecastItems.push({
                            time: new Date(targetTime * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                            temp: currentTemp,
                            humidity: currentHumidity,
                            weatherIcon: getWeatherIcon(prevPoint?.weather || []),
                        });
                        continue;
                    }

                    if (prevPoint.dt === targetTime || Math.abs(prevPoint.dt - targetTime) < 300) {
                        forecastItems.push({
                            time: new Date(prevPoint.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                            temp: prevPoint.main.temp + tempAdjustment,
                            humidity: prevPoint.main.humidity,
                            weatherIcon: getWeatherIcon(prevPoint.weather || []),
                        });
                    } else {
                        const interpolated = interpolateHour(
                            targetTime,
                            { dt: prevPoint.dt, temp: prevPoint.main.temp + tempAdjustment, humidity: prevPoint.main.humidity, weather: prevPoint.weather },
                            { dt: nextPoint.dt, temp: nextPoint.main.temp + tempAdjustment, humidity: nextPoint.main.humidity, weather: nextPoint.weather }
                        );
                        forecastItems.push(interpolated);
                    }
                }

                // Calculate forecast summary
                let forecastSummary = "";
                const allSameStatus = forecastItems.slice(1).every((item) => {
                    const itemStatus = checkSafety(item.temp).status;
                    return itemStatus === (isCurrentlySafe ? currentStatus : 'not-safe');
                });

                if (allSameStatus) {
                    forecastSummary = isCurrentlySafe ? 'Safe all day!' : 'Not safe all day!';
                } else {
                    for (let i = 1; i < forecastItems.length; i++) {
                        const item = forecastItems[i];
                        const itemStatus = checkSafety(item.temp).status;
                        const isItemSafe = itemStatus === 'safe' || itemStatus === 'warning';
                        if (isItemSafe !== isCurrentlySafe) {
                            const changeTime = new Date(nowUnix * 1000 + i * 3600);
                            forecastSummary = isCurrentlySafe
                                ? `Safe until ${changeTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
                                : `Not safe until ${changeTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
                            break;
                        }
                    }
                }

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
                  <span class="temp" style="color: ${getTempColor(item.temp)};"><i class="fa-solid fa-temperature-quarter"></i> ${formatTwoDigits(item.temp)}°F</span>
                  <span class="humidity" style="color: ${getHumidityColor(item.humidity)};"><i class="fa-solid fa-droplet"></i> ${formatTwoDigits(item.humidity)}%</span>
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

    // Listen for parking changes
    document.addEventListener("parking-changed", (e: Event) => {
        console.log("WeatherForecast: Parking changed event received:", (e as CustomEvent).detail.parkingCondition);
        updateForecast(lastCurrentTemp, lastCurrentHumidity, lastIsCurrentlySafe, lastCurrentStatus);
    });

    // Listen for settings changes
    document.addEventListener("settings-changed", (e: Event) => {
        settings = (e as CustomEvent).detail.settings;
        console.log('WeatherForecast: Settings changed, new settings:', settings);
        updateForecast(lastCurrentTemp, lastCurrentHumidity, lastIsCurrentlySafe, lastCurrentStatus);
    });

    return { updateForecast };
}
