import '../css/Modal.css';

export function setupApiKeyModal(container: HTMLElement, renderApp: () => void) {
    const apiKey = localStorage.getItem('weatherApiKey');
    if (apiKey) {
        renderApp();
        return;
    }

    container.innerHTML = `
    <div class="modal active" id="apiKeyModal">
      <div class="modal-content">
        <h2>Enter OpenWeatherMap API Key</h2>
        <p>
          PipeSafe requires an OpenWeatherMap API key to fetch weather data. You can obtain a free key by signing up at
          <a href="https://home.openweathermap.org" target="_blank" rel="noopener">OpenWeatherMap</a>.
        </p>
        <input type="password" id="api-key-input" placeholder="Enter API Key" />
        <button id="save-api-key">Save</button>
      </div>
    </div>
  `;

    const saveButton = container.querySelector('#save-api-key') as HTMLButtonElement;
    const input = container.querySelector('#api-key-input') as HTMLInputElement;

    saveButton.addEventListener('click', () => {
        const key = input.value.trim();
        if (key) {
            localStorage.setItem('weatherApiKey', key);
            container.innerHTML = '';
            renderApp();
        } else {
            input.placeholder = 'API Key cannot be empty';
            input.value = '';
        }
    });
}