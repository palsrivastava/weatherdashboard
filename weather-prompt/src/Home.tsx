import React, { useState } from "react";
import { Box, CircularProgress, AppBar, Toolbar, Typography, Stack, Switch } from "@mui/material";
import SearchBar from "./components/searchbar";
import WeatherCard from "./components/WeatherCard";
import DailyForecast from "./components/DailyForecast";
import WeeklyForecast from "./components/WeeklyForecast";
import { fetchWeatherData, fetchForecastData } from "./util/route";
import { AcUnit } from "@mui/icons-material";
import Grid from '@mui/material/Grid2';

const Home: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isMetric, setIsMetric] = useState(true); 

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
    if (selectedCity) {
      handleCitySelect(weather?.coord?.lat, weather?.coord?.lon, selectedCity);
    }
  };

  return (
    <Box justifyContent="center" sx={{ flexGrow: 1, bgcolor: "#92a8d1", alignItems:"center"}}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <AcUnit />
          <Typography variant="h6" sx={{ marginLeft: 1 }}>The Weather App</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2">°C</Typography>
          <Switch checked={isMetric} onChange={handleToggle} />
          <Typography variant="body2">°F</Typography>
        </Toolbar>
      </AppBar>

      
        <SearchBar onCitySelect={handleCitySelect} />
     
        

      {/* Main Layout */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={1} justifyContent="space-evenly">
        <Stack spacing={2} sx={{ flex: 1, alignContent:"center" }}>
          {loading && <CircularProgress />}
          <WeatherCard weather={weather} isMetric={isMetric} />
          <DailyForecast forecast={forecast} isMetric={isMetric} />
        </Stack>
        <Stack sx={{ flex: 1 }}>
          <WeeklyForecast forecast={forecast} isMetric={isMetric} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default Home;
