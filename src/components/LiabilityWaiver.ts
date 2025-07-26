import '../css/Modal.css';

export function setupLiabilityWaiver(
    container: HTMLElement,
    renderApp: () => void
) {
    // Check if waiver is already accepted
    const waiverAccepted = localStorage.getItem('waiverAccepted');
    if (waiverAccepted === 'true') {
        renderApp();
        return;
    }

    container.innerHTML = `
    <div class="modal active" id="waiverModal">
      <div class="modal-content">
        <h2>PipeSafe Disclaimer</h2>
        <p>
          PipeSafe is designed to help you assess whether it's safe to leave pipes, tobacco, or cigars in your car based on weather conditions. However, weather data and safety estimates are not guaranteed to be accurate. By using PipeSafe, you accept all risks associated with its use and agree not to hold the creators liable for any damages, including to your property (e.g., pipes, tobacco, or cigars). Do you agree to these terms?
        </p>
        <button id="accept-waiver">Accept</button>
        <button id="decline-waiver">Decline</button>
      </div>
    </div>
  `;

    const acceptButton = container.querySelector('#accept-waiver') as HTMLButtonElement;
    const declineButton = container.querySelector('#decline-waiver') as HTMLButtonElement;

    acceptButton.addEventListener('click', () => {
        localStorage.setItem('waiverAccepted', 'true');
        container.innerHTML = '';
        renderApp();
    });

    declineButton.addEventListener('click', () => {
        container.innerHTML = '<p>You must accept the disclaimer to use PipeSafe.</p>';
    });
}