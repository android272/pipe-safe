import '../css/Modal.css';

export function setupInfoModal(container: HTMLElement) {
  // Render UI
  container.innerHTML = `
    <button class="info-button"><i class="fa-solid fa-info"></i></button>
    <div class="modal" id="infoModal">
      <div class="modal-content">
        <h1>About PipeSafe</h1>
        <p class="info-text">PipeSafe helps you determine if it's safe to leave pipes, tobacco, or cigars in your car based on weather conditions.</p>
        <h2>Temperature</h2>
        <p class="info-text">When too high, temperature can cause heat damage or cracking in pipes and dry out or burn tobacco. When too low, it may lead to brittleness or cracking in pipes and make tobacco excessively dry.</p>
        <h2>Humidity</h2>
        <p class="info-text">When too high, humidity promotes mold growth or material degradation, such as wood swelling in pipes. When too low, it can dry out tobacco or pipe materials, resulting in fragility or cracking.</p>
        <h2>Car</h2>
        <p class="info-text">Cars heat up fast, temps may rise 10-20°F inside. So Park in the shade if you can.</p>
        <button id="close-info">Close</button>
      </div>
    </div>
  `;

  // Toggle modal visibility
  const modal = container.querySelector('.modal') as HTMLElement;
  const infoButton = container.querySelector('.info-button') as HTMLButtonElement;
  const closeButton = container.querySelector('#close-info') as HTMLButtonElement;

  const closeModal = () => {
    modal.classList.remove('active');
  };

  infoButton.addEventListener('click', () => {
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
}