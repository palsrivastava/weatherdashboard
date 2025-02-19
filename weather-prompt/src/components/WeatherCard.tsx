import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { WeatherData } from "../util/route";

interface WeatherCardProps {
  weather: WeatherData | null;
  isMetric: boolean;
}

const getWeatherIcon = (iconCode: string) =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

const convertUTCToCityLocalTime = (cityTimezoneOffset: number) => {
  const utcTime = Date.now();
  const cityLocalTime = new Date(utcTime + cityTimezoneOffset * 1000);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(cityLocalTime);
};

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, isMetric }) => {
  if (!weather) return null;

  // Corrected unit logic: isMetric true → Metric (°C and m/s), false → Imperial (°F and mph)
  const tempUnit = isMetric ? "°C" : "°F";
  const windUnit = isMetric ? "m/s" : "mph";
  const cityLocalTime = convertUTCToCityLocalTime(weather.timezone);

  return (
    <Paper
      sx={{
        mt: 3,
        p: 3,
        borderRadius: 3,
        width: "100%",
        maxWidth: 400,
        background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
        color: "white",
      }}
      elevation={6}
    >
      <Stack alignItems="center" justifyContent="center" direction="row" gap={2} mt={4}>
        <Typography variant="h5">CURRENT WEATHER</Typography>
      </Stack>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" sx={{ fontFamily: "sans-serif", fontWeight: "bold" }}>
            {weather.main.temp} {tempUnit}
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
        <Typography variant="h6">🌡️ {weather.weather[0].description}</Typography>
        <Typography>💨 Wind: {weather.wind.speed} {windUnit}</Typography>
        <Typography>💧 Humidity: {weather.main.humidity}%</Typography>
      </Box>
    </Paper>
  );
};

export default WeatherCard;
