import '../css/Modal.css';

export function setupSettingsModal(container: HTMLElement) {
    // Load settings
    const savedSettings = localStorage.getItem('pipeSafeSettings');
    const settings = savedSettings
        ? JSON.parse(savedSettings)
        : {
            carTempIncrease: 0, // Default to +0°F
        };
    console.log('SettingsModal: Loaded settings:', settings);

    // Render UI
    container.innerHTML = `
    <button class="settings-button"><i class="fa-solid fa-gear"></i></button>
    <div class="modal" id="settingsModal">
        <div class="modal-content">
            <h2>Settings</h2>
            <div class="settings-group">
                <h3>Car Temperature</h3>
                <div class="radio-group">
                    <label><input type="radio" name="car-temp-increase" value="0" ${settings.carTempIncrease === 0 ? 'checked' : ''}> +0°F</label>
                    <label><input type="radio" name="car-temp-increase" value="10" ${settings.carTempIncrease === 10 ? 'checked' : ''}> +10°F</label>
                    <label><input type="radio" name="car-temp-increase" value="20" ${settings.carTempIncrease === 20 ? 'checked' : ''}> +20°F</label>
                    <label><input type="radio" name="car-temp-increase" value="40" ${settings.carTempIncrease === 40 ? 'checked' : ''}> +40°F</label> <!-- New option -->
                </div>
            </div>
            <button id="save-settings">Save</button>
            <button id="close-settings">Close</button>
        </div>
    </div>
  `;

    // Toggle modal visibility
    const modal = container.querySelector('.modal') as HTMLElement;
    const settingsButton = container.querySelector('.settings-button') as HTMLButtonElement;
    const closeButton = container.querySelector('#close-settings') as HTMLButtonElement;
    const saveButton = container.querySelector('#save-settings') as HTMLButtonElement;

    const closeModal = () => {
        modal.classList.remove('active');
    };

    settingsButton.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeButton.addEventListener('click', closeModal);

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Save settings
    saveButton.addEventListener('click', () => {
        const carTempIncrease = parseInt(
            (container.querySelector('input[name="car-temp-increase"]:checked') as HTMLInputElement)?.value || '0'
        );

        const newSettings = {
            carTempIncrease,
        };

        console.log('SettingsModal: Saving settings:', newSettings);
        localStorage.setItem('pipeSafeSettings', JSON.stringify(newSettings));
        const settingsEvent = new CustomEvent('settings-changed', {
            detail: { settings: newSettings },
        });
        document.dispatchEvent(settingsEvent);
        console.log('SettingsModal: Dispatched settings-changed');
        closeModal();
    });
}
