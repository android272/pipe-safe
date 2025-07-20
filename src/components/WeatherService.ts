interface WeatherData {
  cod: number | string;
  main: { temp: number; humidity: number };
}

interface ForecastData {
  cod: number | string;
  list: Array<{
    dt: number;
    main: { temp: number; humidity: number };
    dt_txt: string;
  }>;
}

interface WeatherCache {
  current: WeatherData;
  forecast: ForecastData;
  timestamp: number;
}

// Test scenarios for test mode
const testScenarios = {
  "Safe": {
    current: { cod: 200, main: { temp: 65, humidity: 50 } },
    forecast: {
      cod: "200",
      list: [
        { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: 76, humidity: 69 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 77, humidity: 68 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 10800, main: { temp: 78, humidity: 67 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 14400, main: { temp: 84, humidity: 78 }, dt_txt: "" },
      ],
    },
  },
  "Warning": {
    current: { cod: 200, main: { temp: 83, humidity: 78 } },
    forecast: {
      cod: "200",
      list: [
        { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: 84, humidity: 79 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 85, humidity: 80 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 10800, main: { temp: 75, humidity: 70 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 14400, main: { temp: 74, humidity: 69 }, dt_txt: "" },
      ],
    },
  },
  "Not Safe": {
    current: { cod: 200, main: { temp: 77, humidity: 86 } },
    forecast: {
      cod: "200",
      list: [
        { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: 78, humidity: 85 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 79, humidity: 84 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 10800, main: { temp: 80, humidity: 83 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 14400, main: { temp: 75, humidity: 70 }, dt_txt: "" },
      ],
    },
  },
  "All Safe": {
    current: { cod: 200, main: { temp: 70, humidity: 65 } },
    forecast: {
      cod: "200",
      list: [
        { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: 71, humidity: 64 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 72, humidity: 63 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 10800, main: { temp: 73, humidity: 62 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 14400, main: { temp: 74, humidity: 61 }, dt_txt: "" },
      ],
    },
  },
  "All Not Safe": {
    current: { cod: 200, main: { temp: 90, humidity: 90 } },
    forecast: {
      cod: "200",
      list: [
        { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: 91, humidity: 89 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 92, humidity: 88 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 10800, main: { temp: 93, humidity: 87 }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 14400, main: { temp: 94, humidity: 86 }, dt_txt: "" },
      ],
    },
  },
  "Invalid Data": {
    current: { cod: 200, main: { temp: NaN, humidity: NaN } },
    forecast: {
      cod: "200",
      list: [
        { dt: Math.floor(Date.now() / 1000) + 3600, main: { temp: NaN, humidity: NaN }, dt_txt: "" },
        { dt: Math.floor(Date.now() / 1000) + 7200, main: { temp: 75, humidity: 70 }, dt_txt: "" },
      ],
    },
  },
};

export function setupWeatherService(apiKey: string, testMode: boolean) {
  const CACHE_KEY = "pipeSafeWeatherCache";
  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in ms

  const fetchWeatherData = async (): Promise<[WeatherData, ForecastData]> => {
    if (testMode) {
      const scenarioKey = localStorage.getItem("testScenario") || "Not Safe";
      console.log("Fetching test scenario:", scenarioKey); // Debug
      const scenario = testScenarios[scenarioKey as keyof typeof testScenarios];
      if (!scenario) {
        console.error("Invalid test scenario:", scenarioKey);
        return Promise.reject(new Error("Invalid test scenario"));
      }
      return Promise.resolve([scenario.current, scenario.forecast]);
    }

    // Check cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const cache: WeatherCache = JSON.parse(cached);
      const now = Date.now();
      if (now - cache.timestamp < CACHE_DURATION) {
        console.log("Using cached weather data:", cache); // Debug
        return [cache.current, cache.forecast];
      }
    }

    // Fetch new data
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`).then(res => res.json()),
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`).then(res => res.json()),
      ]);

      const cache: WeatherCache = {
        current: currentResponse,
        forecast: forecastResponse,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      console.log("Fetched and cached new weather data:", cache); // Debug
      return [currentResponse, forecastResponse];
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  return { fetchWeatherData };
}