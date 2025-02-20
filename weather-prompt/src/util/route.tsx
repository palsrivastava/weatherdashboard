import axios from "axios";

const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = "13f4d4c270c625397c11e39d22487eb2";

const GEO_API_OPTIONS = {
  headers: {
    "X-RapidAPI-Key": "4f0dcce84bmshac9e329bd55fd14p17ec6fjsnff18c2e61917",
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
};

export interface WeatherData {
  weather: { description: string; icon: string }[];
  main: { temp: number; humidity: number; pressure: number };
  wind: { speed: number };
  name: string;
  sys: { country: string };
  coord: { lat: number; lon: number };
  timezone: number;
}

export interface ForecastData {
  city: { timezone: number };
  list: {
    dt: number;
    dt_txt: string;
    main: { temp_min: number; temp_max: number; humidity: number; pressure: number; temp: number };
    weather: { description: string; icon: string }[];
    wind: { speed: number };
  }[];
}

export const fetchWeatherData = async (
  lat: number,
  lon: number,
  unit: string
): Promise<WeatherData | null> => {
  try {
    const response = await axios.get<WeatherData>(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        units: unit, 
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

export const fetchForecastData = async (
  lat: number,
  lon: number,
  unit: string
): Promise<ForecastData | null> => {
  try {
    const response = await axios.get<ForecastData>(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        units: unit,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return null;
  }
};

export const fetchCities = async (input: string): Promise<{ value: string; label: string }[]> => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct`,
      {
        params: {
          q: input,
          limit: 5,  
          appid: API_KEY,
        },
      }
    );

    return response.data.map((city: any) => ({
      value: `${city.lat} ${city.lon}`,
      label: `${city.name}, ${city.country}`,
    }));
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};
