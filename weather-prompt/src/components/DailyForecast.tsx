import React, { useState } from "react";
import { Box, Typography, Paper} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from "recharts";
import {IconButton }from "@mui/material";
import { ShowChart } from "@mui/icons-material";
import { TableRows } from "@mui/icons-material";

interface ForecastProps {
  forecast: any;
  unit: string; 
}

const getWeatherIcon = (iconCode: string) =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

const convertUTCToCityLocalTime = (utcTimestamp: number, cityTimezoneOffset: number) => {
  const localTimezoneOffset = new Date().getTimezoneOffset() * 60;
  const utcTime = new Date((utcTimestamp + localTimezoneOffset) * 1000);
  const cityLocalTime = new Date(utcTime.getTime() + cityTimezoneOffset * 1000);
  return cityLocalTime;
};

const DailyForecast: React.FC<ForecastProps> = ({ forecast, unit }) => {
  const [showChart, setShowChart] = useState(false);

  if (!forecast || !forecast.list || !forecast.city) return null;

  const cityTimezoneOffset = forecast.city.timezone;
  const currentTime = new Date();
  const tempUnit = unit === "metric" ? "°C" : "°F";

  const nextTenHours = forecast.list
    .map((entry: any) => {
      const cityLocalTime = convertUTCToCityLocalTime(entry.dt, cityTimezoneOffset);
      return {
        time: cityLocalTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temp: Math.round(entry.main.temp),
        icon: entry.weather[0].icon,
        cityLocalTime,
      };
    })
    .filter((entry:any ) => entry.cityLocalTime > currentTime)
    .slice(0, 10);

  return (
    <Paper
      sx={{
        mt: 3,
        mb:3,
        p: 3,
        borderRadius: 3,
        width: "100%",
        maxWidth: 600,
        background: "linear-gradient(135deg, #3b4b69, #7b8dad)",
        color: "white",
      }}
      elevation={6}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" >
      <Typography variant="h5" align="center" sx={{ mb: 1 }}>
        Today’s Forecast 
      </Typography>
      <IconButton sx={{color:"#1c2e4a", backgroundColor:"#fff"}} onClick={()=>setShowChart(!showChart)}>
          {showChart ? <TableRows/> : <ShowChart/> }
        </IconButton>
        </Box>
      <Typography variant="subtitle2" align="center" sx={{ opacity: 1.0 }}>
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
            backgroundColor: "var(--accent-color)",
            borderRadius: "10px",
          },
        }}
      >
        {!showChart ? (
          nextTenHours.map((entry: any, index: any) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                color:"#fff",
                backgroundColor: "rgba(14, 46, 12, 0.1)",
                backdropFilter: "blur(10px)",
                textAlign: "center",
                minWidth: 100,
                height:160
              }}
            >
              <Typography variant="body2">{entry.time}</Typography>
              <img src={getWeatherIcon(entry.icon)} alt="weather icon" width={40} />
              <Typography variant="h6">
                {Math.round(entry.temp)}
                {tempUnit}
              </Typography>
            </Paper>
          ))
        ) : (
          <Box sx={{ width: "100%", height: 300 , backgroundColor: "#fff"}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nextTenHours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#333333" />
                <YAxis domain={["auto", "auto"]} stroke="#333333" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e3c72",
                    color: "#fff",
                    borderRadius: 5,
                  }}
                />
                <Line type="monotone" dataKey="temp" stroke="#ba2d06" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default DailyForecast;
