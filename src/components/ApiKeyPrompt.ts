export function setupApiKeyPrompt(container: HTMLElement) {
    // Check if API key exists in localStorage
    let apiKey: string | null = localStorage.getItem("weatherApiKey");

    if (!apiKey) {
        // Create input and button
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter OpenWeatherMap API key";
        input.style.marginRight = "10px";

        const button = document.createElement("button");
        button.textContent = "Save Key";
        button.type = "button";

        // Save key on click
        button.addEventListener("click", () => {
            const key = input.value.trim();
            if (key) {
                localStorage.setItem("weatherApiKey", key);
                container.innerHTML = "<p>API key saved!</p>";
            } else {
                container.innerHTML = "<p>Please enter a valid API key.</p>";
            }
        });

        // Inject into container
        container.innerHTML = "";
        container.appendChild(input);
        container.appendChild(button);
    }
}