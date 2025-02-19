import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ForecastItem {
  dt_txt: string;
  main: { temp_max: number; temp_min: number; humidity: number };
  weather: { icon: string; description: string }[];
  wind: { speed: number };
  uv?: number;
  air_pollution?: number;
}

interface WeeklyForecastProps {
  forecast: { list: ForecastItem[] } | null;
  isMetric: boolean;
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecast, isMetric}) => {
  const [view, setView] = useState("accordion"); // "accordion" or "graph"

  if (!forecast) return null;
  const tempUnit = !isMetric ? "°C" : "°F";
  const windUnit = !isMetric ? "m/s" : "mph";

  const dailyForecastMap = new Map<string, ForecastItem>();

  forecast.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; 
    if (!dailyForecastMap.has(date)) {
      dailyForecastMap.set(date, { ...item });
    } else {
      const existing = dailyForecastMap.get(date)!;
      existing.main.temp_max = Math.max(existing.main.temp_max, item.main.temp_max);
      existing.main.temp_min = Math.min(existing.main.temp_min, item.main.temp_min);
    }
  });
  
  const dailyForecast = Array.from(dailyForecastMap.values()).slice(0, 5);
  


  const toggleView = () => {
    setView(view === "accordion" ? "graph" : "accordion");
  };

  const chartData = dailyForecast.slice(0, 5).map((day) => ({
    name: new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" }),
    temp_max: day.main.temp_max,
    temp_min: day.main.temp_min,
  }));

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">5-Day Forecast</Typography>
        <Button variant="outlined" onClick={toggleView}>
          {view === "accordion" ? "Show Graph" : "Show List"}
        </Button>
      </Box>
      {view === "accordion" ? (
        dailyForecast.slice(0, 5).map((day, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {new Date(day.dt_txt).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" alignItems="center" gap={1}>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                />
                <Typography>{day.weather[0].description.toUpperCase()}</Typography>
              </Box>
              <Typography>
                <WbSunnyIcon /> High: {day.main.temp_max.toFixed(1)}{tempUnit}, Low: {day.main.temp_min.toFixed(1)}{tempUnit}
              </Typography>
              <Typography>
                <WaterDropIcon /> Humidity: {day.main.humidity}%
              </Typography>
              <Typography>
                <AirIcon /> Wind Speed: {day.wind.speed} {windUnit}
              </Typography>
              {day.uv && <Typography>UV Index: {day.uv}</Typography>}
              {day.air_pollution && <Typography>Air Quality: {day.air_pollution}</Typography>}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Box sx={{ mt: 2, width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temp_max" stroke="red" strokeWidth={2} />
              <Line type="monotone" dataKey="temp_min" stroke="blue" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default WeeklyForecast;
