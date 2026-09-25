import '../css/ParkingToggle.css';
import { isDaytime, sunOffsetF } from './solar';

interface Settings {
    carTempIncrease: number; // No carTempEstimatorEnabled
}

export function setupParkingToggle(container: HTMLElement) {
    if (!container) {
        console.error('ParkingToggle: Container not found!');
        throw new Error('Parking toggle container not found');
    }

    // Load parking condition
    const savedParking = localStorage.getItem('parkingStorageItem');
    let parkingCondition: 'open' | 'shade' = savedParking === 'shade' ? 'shade' : 'open';
    let settings = loadSettings();
    let solar: { sunrise?: number; sunset?: number; timezone?: number } = {};

    function loadSettings(): Settings {
        const savedSettings = localStorage.getItem('pipeSafeSettings');
        return savedSettings
            ? JSON.parse(savedSettings)
            : {
                carTempIncrease: 0, // Default to +0°F
            };
    }

    const sunIsUp = () => isDaytime(
        Math.floor(Date.now() / 1000),
        solar.sunrise,
        solar.sunset,
        solar.timezone,
    );

    // Copy describes the sun offset only. Shade never subtracts degrees.
    const getCarWarningText = () => {
        if (!sunIsUp()) return 'Nighttime — no direct sun.';
        if (parkingCondition === 'open') {
            const offset = sunOffsetF(settings.carTempIncrease, 'open', true);
            return `Est. interior includes +${offset}°F sun offset.`;
        }
        return 'In shade, the estimate uses the outside temperature.';
    };

    // Render toggle
    const renderToggle = () => {
        const daytime = sunIsUp();
        const showOpen = daytime && parkingCondition === 'open';
        const carWarningText = getCarWarningText();
        container.innerHTML = `
      <h2>Where Did You Park?</h2>
      <div class='parking-toggle-well'>
        <div class='parking-toggle-container${daytime ? '' : ' night'}'>
          <div class='parking-option shade ${showOpen ? '' : 'active'}'>
            <i class='fa-solid fa-umbrella-beach'></i>
            <span>In Shade</span>
          </div>
          <div class='parking-toggle'>
            <input type='checkbox' id='parking-toggle' ${showOpen ? 'checked' : ''} ${daytime ? '' : 'disabled'}>
            <label for='parking-toggle'><i class='fa-solid fa-car-side'></i></label>
          </div>
          <div class='parking-option open ${showOpen ? 'active' : ''}'>
            <i class='fa-solid fa-sun'></i>
            <span>In Open</span>
          </div>
        </div>
      </div>
      <p class="car-warning${daytime ? '' : ' night'}">${carWarningText}</p>
    `;

        const toggleInput = container.querySelector('#parking-toggle') as HTMLInputElement;
        const toggleContainer = container.querySelector('.parking-toggle-container') as HTMLElement;
        if (toggleContainer && toggleInput) {
            toggleContainer.addEventListener('click', (e) => {
                e.preventDefault();
                if (!sunIsUp()) return;
                toggleInput.checked = !toggleInput.checked;
                parkingCondition = toggleInput.checked ? 'open' : 'shade';
                console.log('ParkingToggle: Changed to:', parkingCondition);
                localStorage.setItem('parkingStorageItem', parkingCondition);
                renderToggle();
                document.dispatchEvent(new CustomEvent('parking-changed', { detail: { parkingCondition } }));
            });
        } else {
            console.error('ParkingToggle: Toggle input or container not found!');
        }
    };

    // Listen for settings changes
    document.addEventListener('settings-changed', (e: Event) => {
        settings = (e as CustomEvent).detail.settings;
        console.log('ParkingToggle: Settings changed, new settings:', settings);
        renderToggle();
    });

    document.addEventListener('solar-updated', (e: Event) => {
        solar = (e as CustomEvent).detail ?? {};
        renderToggle();
    });

    renderToggle();

    // Expose current state
    return {
        getParkingCondition: () => {
            console.log('ParkingToggle: getParkingCondition called, returning:', parkingCondition);
            return parkingCondition;
        },
    };
}
