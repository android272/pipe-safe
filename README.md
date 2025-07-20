# PipeSafe

Welcome to **PipeSafe**, a web application that helps you determine if it's safe to leave pipes, tobacco, or cigars in your car based on current weather conditions, including temperature and humidity.

## Features
- Monitors temperature and humidity to assess risks (e.g., heat damage, mold growth).
- Adjustable settings for humidity thresholds and car temperature estimates.
- Interactive UI with a Logtail-inspired dark theme, toggleable via system preferences.
- Real-time weather data integration (requires an API key, e.g., OpenWeatherMap).
- Mobile-responsive design with no unnecessary scrollbars.

## Getting Started

### Prerequisites
- A web browser (Chrome, Firefox, Edge, etc.).
- An API key from [OpenWeatherMap](https://openweathermap.org/) for weather data.

### Installation
1. Clone the repository:
```bash
   git clone https://github.com/your-username/pipesafe.git
   cd pipesafe
```

2. Install dependencies:bash
```bash
    npm install
```

3. Build the project:
```bash
    npm run build
```

4. Serve locally (optional, for testing):
- Use a static server like serve (npm install -g serve then serve dist).
- Open http://localhost:3000.


### Deployment
This project is hosted on GitHub Pages at https://github.com/android272/pipe-safe/. To deploy your own version:

- Follow the build steps above.
- Run npm run deploy to push to the gh-pages branch.
- Enable GitHub Pages in repository settings under the gh-pages branch.

### Usage
- Enter your OpenWeatherMap API key in the settings modal.
- Accept the liability waiver to unlock the app.
- Use the parking toggle and test scenarios to simulate conditions.
- Check the safety status and forecast for your pipes.

### Contributing
Feel free to fork this repository, submit issues, or create pull requests. Contributions are welcome!

LicenseThis project is licensed under the MIT License (LICENSE), the most permissive open-source license, allowing free use, modification, and distribution with credit.

### Acknowledgments
- Weather data powered by OpenWeatherMap.
- Built with StackBlitz and hosted on GitHub Pages.
