import React, { useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ForecastProps {
  forecast: any;
  isMetric: boolean;
}

const getWeatherIcon = (iconCode: string) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

const convertUTCToCityLocalTime = (utcTimestamp: number, cityTimezoneOffset: number) => {
  // Step 1: Get the user's local timezone offset in seconds
  const localTimezoneOffset = new Date().getTimezoneOffset() * 60;

  // Step 2: Convert the UTC timestamp to real UTC time
  const utcTime = new Date((utcTimestamp + localTimezoneOffset) * 1000);

  // Step 3: Apply the searched city's timezone offset
  const cityLocalTime = new Date(utcTime.getTime() + cityTimezoneOffset * 1000);

  return cityLocalTime;
};


const DailyForecast: React.FC<ForecastProps> = ({ forecast, isMetric}) => {
  const [showChart, setShowChart] = useState(false);

  if (!forecast || !forecast.list || !forecast.city) return null;

  const cityTimezoneOffset = forecast.city.timezone; // Timezone offset in seconds
  const currentTime = new Date();
  const tempUnit = !isMetric ? "°C" : "°F";

  const nextTenHours = forecast.list
  .map((entry: any) => {
    const cityLocalTime = convertUTCToCityLocalTime(entry.dt, cityTimezoneOffset);
    
    return {
      time: cityLocalTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temp: entry.main.temp,
      icon: entry.weather[0].icon,
      cityLocalTime, // Store for filtering
    };
  })
  .filter((entry) => entry.cityLocalTime > currentTime) // Ensure future times
  .slice(0, 10);


  return (
    <Paper
      sx={{
        mt: 3,
        p: 3,
        borderRadius: 3,
        width: "100%",
        maxWidth: 500,
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        color: "white",
      }}
      elevation={6}
    >
      <Typography variant="h6" align="center" sx={{ mb: 1 }}>
        🌤️ Today’s Forecast (Local Time)
      </Typography>
      <Typography variant="subtitle2" align="center" sx={{ opacity: 0.8 }}>
        {nextTenHours.length} available forecasts
      </Typography>

      <Box
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          mt: 2,
          pb: 1,
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ffcc00",
            borderRadius: "10px",
          },
        }}
      >
        {!showChart ? (
          nextTenHours.map((entry, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                textAlign: "center",
                minWidth: 100,
              }}
            >
              <Typography variant="body2">{entry.time}</Typography>
              <img src={getWeatherIcon(entry.icon)} alt="weather icon" width={40} />
              <Typography variant="h6">{entry.temp}{tempUnit}</Typography>
            </Paper>
          ))
        ) : (
          <Box sx={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nextTenHours}>
                <XAxis dataKey="time" stroke="#fff" />
                <YAxis domain={["auto", "auto"]} stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e3c72",
                    color: "#fff",
                    borderRadius: 5,
                  }}
                />
                <Line type="monotone" dataKey="temp" stroke="#ffcc00" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button variant="contained" color="warning" onClick={() => setShowChart(!showChart)}>
          {showChart ? "Show Cards" : "Show Chart"}
        </Button>
      </Box>
    </Paper>
  );
};

export default DailyForecast;
