import '../css/ParkingToggle.css';

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
  let parkingCondition = savedParking || 'open';
  let settings = loadSettings();

  function loadSettings(): Settings {
    const savedSettings = localStorage.getItem('pipeSafeSettings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          carTempIncrease: 0, // Default to +0°F
        };
  }

  // Compute car warning text
  const getCarWarningText = () => {
    if (settings.carTempIncrease === 0) {
      return parkingCondition === 'shade'
        ? 'Temperature Adjusted for Shade (-5°F)'
        : 'Cars heat up fast, temps may rise 10-20°F inside.';
    }
    return `Temperature Estimated for Car (${parkingCondition === 'shade' ? `+${settings.carTempIncrease - 5}°F` : `+${settings.carTempIncrease}°F`})`;
  };

  // Render toggle
  const renderToggle = () => {
    const carWarningText = getCarWarningText();
    container.innerHTML = `
      <h2>Where Did You Park?</h2>
      <div class='parking-toggle-well'>
        <div class='parking-toggle-container'>
          <div class='parking-option shade ${parkingCondition === 'shade' ? 'active' : ''}'>
            <i class='fa-solid fa-umbrella-beach'></i>
            <span>In Shade</span>
          </div>
          <div class='parking-toggle'>
            <input type='checkbox' id='parking-toggle' ${parkingCondition === 'open' ? 'checked' : ''}>
            <label for='parking-toggle'><i class='fa-solid fa-car-side'></i></label>
          </div>
          <div class='parking-option open ${parkingCondition === 'open' ? 'active' : ''}'>
            <i class='fa-solid fa-sun'></i>
            <span>In Open</span>
          </div>
        </div>
      </div>
      <p class="car-warning">${carWarningText}</p>
    `;

    // Add toggle listener
    const toggleInput = container.querySelector('#parking-toggle') as HTMLInputElement;
    const toggleContainer = container.querySelector('.parking-toggle-container') as HTMLElement;
    if (toggleContainer && toggleInput) {
      toggleContainer.addEventListener('click', (e) => {
        e.preventDefault();
        toggleInput.checked = !toggleInput.checked;
        parkingCondition = toggleInput.checked ? 'open' : 'shade';
        console.log('ParkingToggle: Changed to:', parkingCondition);
        localStorage.setItem('parkingStorageItem', parkingCondition);
        renderToggle();
        const event = new CustomEvent('parking-changed', { detail: { parkingCondition } });
        console.log('ParkingToggle: Dispatching parking-changed event:', event);
        document.dispatchEvent(event);
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

  renderToggle();

  // Expose current state
  return {
    getParkingCondition: () => {
      console.log('ParkingToggle: getParkingCondition called, returning:', parkingCondition);
      return parkingCondition;
    },
  };
}
