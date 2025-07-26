import '../css/WeatherForecast.css';
// Add this weather icon mapping at the top of WeatherForecast.ts
const weatherIconMap = {
    'Clear': '<i class="fa-solid fa-sun"></i>', // Sunny
    'Clouds': '<i class="fa-solid fa-cloud"></i>', // Cloudy
    'Rain': '<i class="fa-solid fa-cloud-showers-heavy"></i>', // Rainy
    'Snow': '<i class="fa-solid fa-snowflake"></i>', // Snowy
    'Thunderstorm': '<i class="fa-solid fa-bolt-lightning"></i>', // Lightning
    'Wind': '<i class="fa-solid fa-wind"></i>', // Windy (approximated)
    'Tornado': '<i class="fa-solid fa-tornado"></i>', // Tornado
    'Tsunami': '<i class="fa-solid fa-tornado"></i>', // Tsunami (using tornado icon as proxy)
    'Hurricane': '<i class="fa-solid fa-hurricane"></i>', // Hurricane
    'Invalid': '', // Placeholder for random Meteor/Dragon
};
const getWeatherIcon = (weatherData, isInvalid) => {
    if (isInvalid || !weatherData?.weather?.length) {
        const invalidIcons = ['<i class="fa-solid fa-meteor"></i>', '<i class="fa-solid fa-dragon"></i>'];
        return invalidIcons[Math.floor(Math.random() * invalidIcons.length)];
    }
    const mainWeather = weatherData.weather[0].main;
    return weatherIconMap[mainWeather] || '<i class="fa-solid fa-question"></i>'; // Default to question mark if unknown
};
export function setupWeatherForecast(container, weatherService, checkSafety, getTempColor, getHumidityColor, parkingComponent) {
    const testMode = true;
    let lastCurrentTemp = 0;
    let lastCurrentHumidity = 0;
    let lastIsCurrentlySafe = false;
    let lastCurrentStatus = 'not-safe';
    let settings = loadSettings();
    function loadSettings() {
        const savedSettings = localStorage.getItem('pipeSafeSettings');
        return savedSettings ? JSON.parse(savedSettings) : {
            humidityThreshold: 80,
            carTempIncrease: 0, // Default to +0°F
        };
    }
    const interpolateHour = (targetTime, prev, next) => {
        if (!Number.isFinite(prev.temp) ||
            !Number.isFinite(next.temp) ||
            !Number.isFinite(prev.humidity) ||
            !Number.isFinite(next.humidity) ||
            prev.dt >= next.dt) {
            return {
                time: new Date(targetTime * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                temp: prev.temp || next.temp || 0,
                humidity: prev.humidity || next.humidity || 0,
                icon: getWeatherIcon(prev.weather?.[0], !prev.weather?.length),
            };
        }
        const fraction = (targetTime - prev.dt) / (next.dt - prev.dt);
        return {
            time: new Date(targetTime * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
            temp: Math.round(prev.temp + (next.temp - prev.temp) * fraction),
            humidity: Math.round(prev.humidity + (next.humidity - prev.humidity) * fraction),
            icon: getWeatherIcon(prev.weather?.[0], !prev.weather?.length),
        };
    };
    const formatTwoDigits = (value) => {
        return Number.isFinite(value) ? Math.round(value).toString().padStart(2, '0') : 'N/A';
    };
    const updateForecast = (currentTemp, currentHumidity, isCurrentlySafe, currentStatus) => {
        lastCurrentTemp = currentTemp;
        lastCurrentHumidity = currentHumidity;
        lastIsCurrentlySafe = isCurrentlySafe;
        lastCurrentStatus = currentStatus;
        console.log("WeatherForecast: Updating forecast, currentTemp:", currentTemp);
        weatherService
            .fetchWeatherData()
            .then(([current, forecast]) => {
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
            const forecastItems = [{
                    time: 'Now',
                    temp: currentTemp,
                    humidity: currentHumidity,
                    icon: getWeatherIcon(current.weather?.[0], !current.weather?.length), // Use current weather for "Now"
                }];
            const apiPoints = (forecast.list || [])
                .filter((item) => item.dt >= nowUnix &&
                item.dt <= twelveHoursLater + 3600 &&
                Number.isFinite(item.main?.temp) &&
                Number.isFinite(item.main?.humidity))
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
                        icon: getWeatherIcon(prevPoint?.weather?.[0], !prevPoint?.weather?.length), // Fallback to clear
                    });
                    continue;
                }
                if (prevPoint.dt === targetTime || Math.abs(prevPoint.dt - targetTime) < 300) {
                    forecastItems.push({
                        time: new Date(prevPoint.dt * 1000).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                        temp: prevPoint.main.temp + tempAdjustment,
                        humidity: prevPoint.main.humidity,
                        icon: getWeatherIcon(prevPoint.weather?.[0], !prevPoint.weather?.length),
                    });
                }
                else {
                    const interpolated = interpolateHour(targetTime, { dt: prevPoint.dt, temp: prevPoint.main.temp + tempAdjustment, humidity: prevPoint.main.humidity, weather: prevPoint.weather }, { dt: nextPoint.dt, temp: nextPoint.main.temp + tempAdjustment, humidity: nextPoint.main.humidity, weather: nextPoint.weather });
                    forecastItems.push({
                        ...interpolated,
                        icon: getWeatherIcon(prevPoint.weather?.[0], !prevPoint.weather?.length), // Use prevPoint's weather
                    });
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
            }
            else {
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
                .map((item) => `
                <div class="forecast-box">
                  <span class="time">${item.time}</span>
                  <span class="weather-icon">${item.icon}</span>
                  <span class="temp" style="color: ${getTempColor(item.temp)};"><i class="fa-solid fa-temperature-quarter"></i> ${formatTwoDigits(item.temp)}°F</span>
                  <span class="humidity" style="color: ${getHumidityColor(item.humidity)};"><i class="fa-solid fa-droplet"></i> ${formatTwoDigits(item.humidity)}%</span>
                </div>
              `)
                .join('')}
          </div>
        `;
        })
            .catch((error) => {
            console.error('WeatherForecast: Fetch error:', error);
            container.innerHTML = '<p>Error fetching forecast data.</p>';
        });
        // Listen for parking changes
        document.addEventListener("parking-changed", (e) => {
            console.log("WeatherForecast: Parking changed event received:", e.detail.parkingCondition);
            updateForecast(lastCurrentTemp, lastCurrentHumidity, lastIsCurrentlySafe, lastCurrentStatus);
        });
        // Listen for settings changes
        document.addEventListener("settings-changed", (e) => {
            settings = e.detail.settings;
            console.log('WeatherForecast: Settings changed, new settings:', settings);
            updateForecast(lastCurrentTemp, lastCurrentHumidity, lastIsCurrentlySafe, lastCurrentStatus);
        });
        return { updateForecast };
    };
}
