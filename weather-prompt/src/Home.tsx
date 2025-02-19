import React, { useState } from "react";
import { Box, CircularProgress, AppBar, Toolbar, Typography, Stack, Switch, Container } from "@mui/material";
import SearchBar from "./components/searchbar";
import WeatherCard from "./components/WeatherCard";
import DailyForecast from "./components/DailyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import { fetchWeatherData, fetchForecastData } from "./util/route";
import { AcUnit } from "@mui/icons-material";
import { WeatherData, ForecastData } from "./util/route";

const Home: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMetric, setIsMetric] = useState<boolean>(true);

  const handleCitySelect = async (lat: number, lon: number, label: string) => {
    setSelectedCity(label);
    setWeather(null);
    setForecast(null);
    setLoading(true);


    try {
      const weatherData = await fetchWeatherData(lat, lon, isMetric);
      const forecastData = await fetchForecastData(lat, lon, isMetric);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsMetric((prev) => !prev);
    if (selectedCity && weather) {
      // Re-fetch with updated units.
      handleCitySelect(weather.coord.lat, weather.coord.lon, selectedCity);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <AcUnit />
          <Typography variant="h6" sx={{ marginLeft: 1 }}>
            The Weather App
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2">°F</Typography>
          <Switch checked={isMetric} onChange={handleToggle} />
          <Typography variant="body2">°C</Typography>
          
        </Toolbar>
      </AppBar>

      <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
        <SearchBar onCitySelect={handleCitySelect} />
      </Box>

      {/* Main Layout */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={4} justifyContent="space-evenly">
        <Stack spacing={4} sx={{ flex: 1, alignItems: "center" }}>
          {loading && <CircularProgress />}
          <WeatherCard weather={weather} isMetric={isMetric} />
          <DailyForecast forecast={forecast} isMetric={isMetric} />
        </Stack>
        <Stack sx={{ flex: 1, alignItems: "center" }}>
          <WeeklyForecast forecast={forecast} isMetric={isMetric} />
        </Stack>
      </Stack>
    </Container>
  );
};

export default Home;
