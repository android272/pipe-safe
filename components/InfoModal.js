import '../css/Modal.css';
export function setupInfoModal(container) {
    // Render UI
    container.innerHTML = `
    <button class="info-button"><i class="fa-solid fa-info"></i></button>
    <div class="modal" id="infoModal">
      <div class="modal-content">
        <h1>About PipeSafe</h1>
        <p class="info-text">PipeSafe helps you determine if it’s safe to leave pipes, tobacco, or cigars in your car for up to 12 hours based on temperature.</p>
        <h2>Temperature</h2>
        <p class="info-text">Pipes, pipe tobacco, and cigars are sensitive to temperature extremes. Ideally, keep them between 59-70°F. High temperatures (>70°F) can dry out tobacco and cigars, affecting flavor, or cause pipes to warp or crack. Low temperatures (<59°F) may make pipes brittle or dry out tobacco and cigars, impacting quality.</p>
        <h2>Humidity</h2>
        <p class="info-text">Humidity is not a major concern for short-term car storage (up to 12 hours) and is not factored into PipeSafe’s safety calculations. For long-term storage, consider humidity to prevent drying or excess moisture.</p>
        <h2>Car</h2>
        <p class="info-text">Cars heat up quickly, with interior temperatures rising 20-40°F above outside conditions in sunlight. Park in the shade and use sunshades to keep temperatures closer to safe ranges.</p>
        <button id="close-info">Close</button>
      </div>
    </div>
  `;
    // Toggle modal visibility
    const modal = container.querySelector('.modal');
    const infoButton = container.querySelector('.info-button');
    const closeButton = container.querySelector('#close-info');
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
