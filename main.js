import './css/style.css';
import { setupApiKeyModal } from './components/ApiKeyModal';
import { setupLiabilityWaiver } from './components/LiabilityWaiver';
import { setupWeatherDisplay } from './components/WeatherDisplay';
import { setupInfoModal } from './components/InfoModal';
import { setupSettingsModal } from './components/SettingsModal';
import { setupParkingToggle } from './components/ParkingToggle';
import { setupWeatherService } from './components/WeatherService';
import { setupWeatherForecast } from './components/WeatherForecast';
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pipe-safe/sw.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
        console.error('Service Worker registration failed:', error);
    });
}
const app = document.querySelector('#app');
const renderApp = () => {
    const apiKey = localStorage.getItem('weatherApiKey');
    const waiverAccepted = localStorage.getItem('waiverAccepted');
    console.log('main.ts: renderApp called, apiKey:', !!apiKey, 'waiverAccepted:', waiverAccepted);
    // Only render main UI if both conditions are met
    if (apiKey && waiverAccepted === 'true') {
        app.innerHTML = `
      <div>
        <h1>PipeSafe</h1>
        <div id='settings-container'></div>
        <div id='info-container'></div>
        <div id='api-key-container'></div>
        <div class="main-content">
          <div id='weather-container'></div>
          <div id='parking-toggle-container'></div>
          <div id='weather-forecast-container'></div>
        </div>
      </div>
    `;
        setupSettingsModal(document.querySelector('#settings-container'));
        setupInfoModal(document.querySelector('#info-container'));
        // API key modal not needed if key exists
        document.querySelector('#api-key-container').innerHTML = '';
        const parkingContainer = document.querySelector('#parking-toggle-container');
        let parkingComponent;
        try {
            console.log('main.ts: Initializing parking toggle');
            parkingComponent = setupParkingToggle(parkingContainer);
        }
        catch (error) {
            console.error('main.ts: Failed to initialize parking toggle:', error);
            app.innerHTML = '<p>Error: Unable to initialize parking toggle.</p>';
            return;
        }
        const weatherService = setupWeatherService(apiKey, true);
        const weatherContainer = document.querySelector('#weather-container');
        const forecastContainer = document.querySelector('#weather-forecast-container');
        console.log('main.ts: Initializing weather forecast');
        const forecastComponent = setupWeatherForecast(forecastContainer, weatherService, (temp) => ({ status: 'not-safe', reason: 'Placeholder' }), (temp) => '#888888', (humidity) => '#888888', parkingComponent);
        console.log('main.ts: Initializing weather display');
        const weatherDisplay = setupWeatherDisplay(weatherContainer, apiKey, parkingComponent, weatherService, forecastComponent);
        console.log('main.ts: Updating weather forecast with display functions');
        forecastComponent.updateForecast = (currentTemp, currentHumidity, isCurrentlySafe, currentStatus) => {
            setupWeatherForecast(forecastContainer, weatherService, weatherDisplay.checkSafety, weatherDisplay.getTempColor, weatherDisplay.getHumidityColor, parkingComponent).updateForecast(currentTemp, currentHumidity, isCurrentlySafe, currentStatus);
        };
    }
    else {
        app.innerHTML = `
      <div>
        <h1>PipeSafe</h1>
        <div id='settings-container'></div>
        <div id='info-container'></div>
        <div id='api-key-container'></div>
        <div class="main-content">
          <div id='weather-container'><p>Please set API key and accept disclaimer to use PipeSafe.</p></div>
          <div id='parking-toggle-container'></div>
          <div id='weather-forecast-container'></div>
        </div>
      </div>
    `;
        // Only show modals if conditions aren't met
        setupSettingsModal(document.querySelector('#settings-container'));
        setupInfoModal(document.querySelector('#info-container'));
        if (!apiKey) {
            setupApiKeyModal(document.querySelector('#api-key-container'), renderApp);
        }
        else {
            document.querySelector('#api-key-container').innerHTML = '';
        }
    }
};
// Always show waiver if not accepted
setupLiabilityWaiver(app, renderApp);
