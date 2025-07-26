// Test scenarios for test mode
const testScenarios = {
    "Safe": {
        current: { cod: 200, main: { temp: 65, humidity: 50 }, weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
        forecast: {
            cod: "200",
            list: [
                { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: 76, humidity: 69 }, dt_txt: "", weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
                { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 77, humidity: 68 }, dt_txt: "", weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
                { dt: Math.floor(Date.now() / 1000) + 10800, main: { temp: 78, humidity: 67 }, dt_txt: "", weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
                { dt: Math.floor(Date.now() / 1000) + 14400, main: { temp: 84, humidity: 78 }, dt_txt: "", weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
            ],
        },
    },
    "Warning": {
        current: { cod: 200, main: { temp: 83, humidity: 78 }, weather: [{ id: 801, main: "Clouds", description: "few clouds" }] },
        forecast: {
            cod: "200",
            list: [
                { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: 84, humidity: 79 }, dt_txt: "", weather: [{ id: 801, main: "Clouds", description: "few clouds" }] },
                { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 85, humidity: 80 }, dt_txt: "", weather: [{ id: 801, main: "Clouds", description: "few clouds" }] },
                { dt: Math.floor(Date.now() / 1000) + 10800, main: { temp: 75, humidity: 70 }, dt_txt: "", weather: [{ id: 801, main: "Clouds", description: "few clouds" }] },
                { dt: Math.floor(Date.now() / 1000) + 14400, main: { temp: 74, humidity: 69 }, dt_txt: "", weather: [{ id: 801, main: "Clouds", description: "few clouds" }] },
            ],
        },
    },
    "Not Safe": {
        current: { cod: 200, main: { temp: 77, humidity: 86 }, weather: [{ id: 803, main: "Clouds", description: "broken clouds" }] },
        forecast: {
            cod: "200",
            list: [
                { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: 78, humidity: 85 }, dt_txt: "", weather: [{ id: 803, main: "Clouds", description: "broken clouds" }] },
                { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 79, humidity: 84 }, dt_txt: "", weather: [{ id: 803, main: "Clouds", description: "broken clouds" }] },
                { dt: Math.floor(Date.now() / 1000) + 10800, main: { temp: 80, humidity: 83 }, dt_txt: "", weather: [{ id: 803, main: "Clouds", description: "broken clouds" }] },
                { dt: Math.floor(Date.now() / 1000) + 14400, main: { temp: 75, humidity: 70 }, dt_txt: "", weather: [{ id: 803, main: "Clouds", description: "broken clouds" }] },
            ],
        },
    },
    "All Safe": {
        current: { cod: 200, main: { temp: 70, humidity: 65 }, weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
        forecast: {
            cod: "200",
            list: [
                { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: 71, humidity: 64 }, dt_txt: "", weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
                { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 72, humidity: 63 }, dt_txt: "", weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
                { dt: Math.floor(Date.now() / 1000) + 10800, main: { temp: 73, humidity: 62 }, dt_txt: "", weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
                { dt: Math.floor(Date.now() / 1000) + 14400, main: { temp: 74, humidity: 61 }, dt_txt: "", weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
            ],
        },
    },
    "All Not Safe": {
        current: { cod: 200, main: { temp: 90, humidity: 90 }, weather: [{ id: 804, main: "Clouds", description: "overcast clouds" }] },
        forecast: {
            cod: "200",
            list: [
                { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: 91, humidity: 89 }, dt_txt: "", weather: [{ id: 804, main: "Clouds", description: "overcast clouds" }] },
                { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 92, humidity: 88 }, dt_txt: "", weather: [{ id: 804, main: "Clouds", description: "overcast clouds" }] },
                { dt: Math.floor(Date.now() / 1000) + 10800, main: { temp: 93, humidity: 87 }, dt_txt: "", weather: [{ id: 804, main: "Clouds", description: "overcast clouds" }] },
                { dt: Math.floor(Date.now() / 1000) + 14400, main: { temp: 94, humidity: 86 }, dt_txt: "", weather: [{ id: 804, main: "Clouds", description: "overcast clouds" }] },
            ],
        },
    },
    "Invalid Data": {
        current: { cod: 200, main: { temp: NaN, humidity: NaN }, weather: [] },
        forecast: {
            cod: "200",
            list: [
                { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: NaN, humidity: NaN }, dt_txt: "", weather: [] },
                { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 75, humidity: 70 }, dt_txt: "", weather: [{ id: 800, main: "Clear", description: "clear sky" }] },
            ],
        },
    },
};
export function setupWeatherService(apiKey, testMode) {
    const CACHE_KEY = "pipeSafeWeatherCache";
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in ms
    const fetchWeatherData = async () => {
        if (testMode) {
            const scenarioKey = localStorage.getItem("testScenario") || "Not Safe";
            console.log("Fetching test scenario:", scenarioKey); // Debug
            const scenario = testScenarios[scenarioKey];
            if (!scenario) {
                console.error("Invalid test scenario:", scenarioKey);
                return Promise.reject(new Error("Invalid test scenario"));
            }
            return Promise.resolve([scenario.current, scenario.forecast]);
        }
        // Check cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const cache = JSON.parse(cached);
            const now = Date.now();
            if (now - cache.timestamp < CACHE_DURATION) {
                console.log("Using cached weather data:", cache); // Debug
                return [cache.current, cache.forecast];
            }
        }
        // Fetch new data with error handling
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000, // 10 seconds timeout
                    maximumAge: 0,
                });
            });
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            if (!apiKey) {
                console.error("API key is missing");
                return Promise.reject(new Error("API key is missing"));
            }
            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`).then(res => {
                    if (!res.ok)
                        throw new Error(`Weather API error: ${res.status}`);
                    return res.json();
                }),
                fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`).then(res => {
                    if (!res.ok)
                        throw new Error(`Forecast API error: ${res.status}`);
                    return res.json();
                }),
            ]);
            const cache = {
                current: currentResponse,
                forecast: forecastResponse,
                timestamp: Date.now(),
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
            console.log("Fetched and cached new weather data:", cache); // Debug
            return [currentResponse, forecastResponse];
        }
        catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    };
    return { fetchWeatherData };
}
