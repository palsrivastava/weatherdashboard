import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { WeatherData } from "../util/route";

interface WeatherCardProps {
  weather: WeatherData | null;
  unit: string; 
}

const getWeatherIcon = (iconCode: string) =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

const convertUTCToCityLocalTime = (cityTimezoneOffset: number) => {
  const localTimezoneOffset = new Date().getTimezoneOffset() * 60;
  const utcNow = new Date(Date.now() + localTimezoneOffset * 1000);
  const cityLocalTime = new Date(utcNow.getTime() + cityTimezoneOffset * 1000);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(cityLocalTime);
};

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, unit }) => {
  if (!weather) return null;

  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";
  const cityLocalTime = convertUTCToCityLocalTime(weather.timezone);

  return (
    <Paper
      sx={{
        mt: 3,
        p: 3,
        borderRadius: 3,
        width: "100%",
        maxWidth: 500,
        background: "linear-gradient(135deg, #179bae, #4158a6)",
        color: "white",
      }}
      elevation={6}
    >
      <Stack alignItems="center" justifyContent="space-between" direction="row" gap={2} >
        <Typography variant="h5">Current Weather</Typography>
      </Stack>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "sans-serif", fontWeight: "bold" }}>
            {Math.round(weather.main.temp)} {tempUnit}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {weather.name}
          </Typography>
          <Typography variant="subtitle1">{cityLocalTime}</Typography>
        </Box>
        <Box>
          <img
            src={getWeatherIcon(weather.weather[0].icon)}
            alt="weather icon"
            width={120}
            height={120}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">{weather.weather[0].description.toUpperCase()}</Typography>
        <Typography>Wind: {weather.wind.speed} {windUnit}</Typography>
        <Typography>Humidity: {weather.main.humidity}%</Typography>
      </Box>
    </Paper>
  );
};

export default WeatherCard;
