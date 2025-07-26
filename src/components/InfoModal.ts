import '../css/Modal.css';

export function setupInfoModal(container: HTMLElement) {
    // Render UI
    container.innerHTML = `
    <button class="info-button"><i class="fa-solid fa-info"></i></button>
    <div class="modal" id="infoModal">
      <div class="modal-content">
        <h1>About PipeSafe</h1>
        <p class="info-text">PipeSafe helps you determine if it’s safe to leave pipes, tobacco, or cigars in your car for up to 12 hours based on temperature.</p>
        
        <h2>Temperature</h2>
        <p class="info-text">Pipes, pipe tobacco, and cigars are sensitive to temperature extremes. Ideally, keep them between 60-75°F to maintain quality, though pipes are more resilient. Below are the safe ranges and risks for each item:</p>
        
        <h3>Pipes</h3>
        <p class="info-text"><b>(50-90°F, ideally 65-75°F):</b> Made of briar wood, pipes can tolerate a wide range but thrive at room temperature. <b>Above 90°F:</b> Risk of warping, cracking, or bleaching (especially in sunlight). <b>Below 50°F:</b> Potential brittleness or cracking. Avoid rapid temperature changes to prevent damage.</p>
        
        <h3>Pipe Tobacco</h3>
        <p class="info-text"><b>(50-80°F, ideally 60-70°F):</b> Store in airtight containers to maintain moisture and flavor. <b>Above 80°F:</b> Drying out, flavor loss, or faster spoilage. <b>Below 50°F:</b> Excessive drying, reduced quality.</p>

        <h3>Cigars</h3>
        <p class="info-text"><b>(50-75°F, ideally 65-70°F):</b> Require precise conditions to avoid damage. <b>Above 75°F:</b> Drying, flavor loss, or cigar beetle hatching. <b>Below 50°F:</b> Drying, wrapper cracking. Use a travel humidor for best results.</p>
        
        <h2>Humidity</h2>
        <p class="info-text">Humidity is not a major concern for short-term car storage (up to 12 hours) and is not factored into PipeSafe’s safety calculations. For long-term storage, consider humidity to prevent drying or excess moisture.</p>
        
        <h2>Car</h2>
        <p class="info-text">Cars heat up quickly, with interior temperatures rising 20-40°F above outside conditions in sunlight. Park in the shade and use sunshades to keep temperatures closer to safe ranges. Use sturdy, vented containers to avoid pressure buildup in warm conditions.</p>
        
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