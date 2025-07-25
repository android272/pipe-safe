interface WeatherData {
  cod: number | string;
  main: { temp: number; humidity: number };
}

interface ForecastData {
  cod: number | string;
  list: Array<{
    dt: number;
    main: { temp: number; humidity: number };
    dt_txt: string;
  }>;
}

const testMode = false;
const showTestDropdown = false;
const testScenarioKeys = ['Safe', 'Warning', 'Not Safe', 'All Safe', 'All Not Safe', 'Invalid Data'];

export function setupWeatherDisplay(
  container: HTMLElement,
  apiKey: string,
  parkingComponent: { getParkingCondition: () => string },
  weatherService: { fetchWeatherData: () => Promise<[WeatherData, ForecastData]> },
  forecastComponent: { updateForecast: (currentTemp: number, currentHumidity: number, isCurrentlySafe: boolean, currentStatus: string) => void }
) {
  let settings = loadSettings();
  let currentStatus = 'not-safe';
  console.log('WeatherDisplay: Loaded settings:', settings);

  function loadSettings() {
    const savedSettings = localStorage.getItem('pipeSafeSettings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          humidityThreshold: 80,
          carTempIncrease: 0, // Default to +0°F
        };
  }

  const checkSafety = (temp: number): { status: string; reason: string } => {
    if (!Number.isFinite(temp)) {
      return { status: 'not-safe', reason: 'Invalid data' };
    }

    const roundedTemp = Math.round(temp);
    if (roundedTemp < 50) return { status: 'not-safe', reason: `Too cold: ${roundedTemp}°F` };
    if (roundedTemp >= 85) return { status: 'not-safe', reason: `Too hot: ${roundedTemp}°F` };
    if (roundedTemp >= 83 && roundedTemp < 85) return { status: 'warning', reason: 'Temperature near unsafe threshold' };
    if (roundedTemp >= 50 && roundedTemp <= 52) return { status: 'warning', reason: 'Temperature near unsafe threshold' };
    return { status: 'safe', reason: 'Conditions ideal' };
  };

  const formatTwoDigits = (value: number): string => {
    return Number.isFinite(value) ? Math.round(value).toString().padStart(2, '0') : 'N/A';
  };

  const getTempColor = (temp: number): string => {
    if (!Number.isFinite(temp)) return '#888888';
    const roundedTemp = Math.round(temp);
    const clampedTemp = Math.min(Math.max(roundedTemp, 50), 85);
    const hue = 200 - ((clampedTemp - 50) / (85 - 50)) * 200;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const getHumidityColor = (humidity: number): string => {
    if (!Number.isFinite(humidity)) return '#888888';
    const roundedHumidity = Math.round(humidity);
    const clampedHumidity = Math.min(Math.max(roundedHumidity, 50), settings.humidityThreshold);
    const saturation = 30 + ((clampedHumidity - 50) / (settings.humidityThreshold - 50)) * 40;
    const lightness = 80 - ((clampedHumidity - 50) / (settings.humidityThreshold - 50)) * 40;
    return `hsl(200, ${saturation}%, ${lightness}%)`;
  };

  const updateWeather = (scenarioKey: string = 'Not Safe') => {
    console.log('WeatherDisplay: Updating weather, scenario:', scenarioKey);
    weatherService
      .fetchWeatherData()
      .then(([current]: [WeatherData, ForecastData]) => {
        console.log('WeatherDisplay: Current:', current);
        if (!testMode && current.cod !== 200) {
          container.innerHTML = '<p>Error: Invalid API response.</p>';
          return;
        }

        const parkingCondition = parkingComponent.getParkingCondition();
        console.log('WeatherDisplay: Applying parking condition:', parkingCondition);
        let tempAdjustment = settings.carTempIncrease;
        if (parkingCondition === 'shade') {
          tempAdjustment -= 5;
        }
        console.log('WeatherDisplay: Temperature adjustment:', tempAdjustment);
        const currentTemp = Number.isFinite(current.main?.temp) ? current.main.temp + tempAdjustment : NaN;
        const currentHumidity = Number.isFinite(current.main?.humidity) ? current.main.humidity : NaN;
        console.log('WeatherDisplay: Current temp after adjustment:', currentTemp);
        const { status, reason } = checkSafety(currentTemp);
        currentStatus = status;
        const tempColor = getTempColor(currentTemp);
        const humidityColor = getHumidityColor(currentHumidity);

        const safetyImage =
          status === 'safe' ? "/pipe-safe/safe.svg" :
          status === 'warning' ? "/pipe-safe/warning.svg" :
          reason === 'Invalid data' ? '/pipe-safe/error.svg' :
          "/pipe-safe/not-safe.svg";

        const isCurrentlySafe = status === 'safe' || status === 'warning';

        container.innerHTML = `
          ${showTestDropdown ? `
            <div class="test-scenario-container">
              <label for="test-scenario">Test Scenario: </label>
              <select id="test-scenario">
                ${testScenarioKeys.map((key) => `<option value="${key}" ${key === scenarioKey ? 'selected' : ''}>${key}</option>`).join('')}
              </select>
            </div>
          ` : ''}
          <div class="current-weather">
            <div class="weather-item">
              <span class="label">Temperature</span>
              <span class="value" style="color: ${tempColor};"><i class="fa-solid fa-temperature-quarter"></i> ${formatTwoDigits(currentTemp)}°F</span>
            </div>
            <div class="weather-item">
              <span class="label">Humidity</span>
              <span class="value" style="color: ${humidityColor};"><i class="fa-solid fa-droplet"></i> ${formatTwoDigits(currentHumidity)}%</span>
            </div>
          </div>
          <img class="safety-image" src="${safetyImage}" alt="${status}">
          <p class="reason">Reason: ${reason}</p>
        `;

        forecastComponent.updateForecast(currentTemp, currentHumidity, isCurrentlySafe, currentStatus);

        if (showTestDropdown) {
          const select = container.querySelector('#test-scenario') as HTMLSelectElement;
          if (select) {
            select.value = scenarioKey;
            select.addEventListener('change', (e) => {
              const newScenarioKey = (e.target as HTMLSelectElement).value;
              console.log('WeatherDisplay: Test scenario changed to:', newScenarioKey);
              localStorage.setItem('testScenario', newScenarioKey);
              updateWeather(newScenarioKey);
            });
          }
        }
      })
      .catch((error) => {
        console.error('WeatherDisplay: Fetch error:', error);
        container.innerHTML = '<p>Error fetching weather data.</p>';
      });
  };

  // Listen for parking changes
  document.addEventListener('parking-changed', (e: Event) => {
    console.log('WeatherDisplay: Parking changed event received:', (e as CustomEvent).detail.parkingCondition);
    updateWeather(localStorage.getItem('testScenario') || 'Not Safe');
  });

  // Listen for settings changes
  document.addEventListener('settings-changed', (e: Event) => {
    settings = (e as CustomEvent).detail.settings;
    console.log('WeatherDisplay: Settings changed, new settings:', settings);
    updateWeather(localStorage.getItem('testScenario') || 'Not Safe');
  });

  updateWeather();

  return {
    checkSafety,
    getTempColor,
    getHumidityColor,
    get currentStatus() {
      return currentStatus;
    },
  };
}
