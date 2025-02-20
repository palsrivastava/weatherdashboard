import React, { useState, useEffect } from "react";
import { Box, CircularProgress, AppBar, Toolbar, Typography, Stack, Switch, Container } from "@mui/material";
import SearchBar from "./components/Search";
import WeatherCard from "./components/WeatherCard";
import DailyForecast from "./components/DailyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import { fetchWeatherData, fetchForecastData } from "./util/route";
import { AcUnit } from "@mui/icons-material";
import { WeatherData, ForecastData } from "./util/route";
//import LocationButton from "./components/LocationButton";

const Home: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [unit, setUnit] = useState<string>("metric");

  const handleCitySelect = async (lat: number, lon: number, label: string) => {
    setSelectedCity(label);
    setWeather(null);
    setForecast(null);
    setLoading(true);

    try {
      const weatherData = await fetchWeatherData(lat, lon, unit);
      const forecastData = await fetchForecastData(lat, lon, unit);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity && weather) {
      handleCitySelect(weather.coord.lat, weather.coord.lon, selectedCity);
    }
  }, [unit]);

  const handleToggle = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#1c2e4a" }}>
        <Toolbar >
          <AcUnit />
          <Typography variant="h6" sx={{ marginLeft: 1 }}>
            The Weather App
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2">°F</Typography>
          <Switch checked={unit === "metric"} onChange={handleToggle} />
          <Typography variant="body2">°C</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <SearchBar onCitySelect={handleCitySelect} />
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={4} justifyContent="space-evenly">
          <Stack spacing={4} sx={{ flex: 1, alignItems: "center" }}>
            {loading && <CircularProgress />}
            <WeatherCard weather={weather} unit={unit} />
            <DailyForecast forecast={forecast} unit={unit} />
          </Stack>
          <Stack sx={{ flex: 1, alignItems: "center" }}>
            <WeeklyForecast forecast={forecast} unit={unit} />
          </Stack>
        </Stack>
      </Container>
    </>
  );
};
export default Home;
