import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, IconButton,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Paper} from "@mui/material";
import { TableRows } from "@mui/icons-material";
import { ShowChart } from "@mui/icons-material";

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
  unit: string; 
}

const WeeklyForecast: React.FC<WeeklyForecastProps> = ({ forecast, unit }) => {
  const [view, setView] = useState<"accordion" | "graph">("accordion");

  if (!forecast) return null;
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

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
    setView((prev) => (prev === "accordion" ? "graph" : "accordion"));
  };

  const chartData = dailyForecast.map((day) => ({
    name: new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" }),
    High: Math.round(day.main.temp_max),
    Low: Math.round(day.main.temp_min),
  }));

  return (
    <Paper elevation={4} sx={{ width: "100%", maxWidth: 600 ,background:"#333333", borderRadius: "10px"}}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ p:1, borderRadius: '10px', backgroundColor:"#333333"}}>
        <Typography variant="h6" sx ={{color:"#fff"}}>  5-Day Forecast</Typography>
        <IconButton sx={{color:"#1c2e4a", backgroundColor:"#fff"}} onClick={toggleView}>
          {view === "accordion" ? <ShowChart/> : <TableRows/> }
        </IconButton>
      </Box>
      {view === "accordion" ? (
        dailyForecast.map((day, index) => (
          <Accordion key={index} sx={{background:"#333333"}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{opacity:0.5,color:"#1c2e4a", borderRadius:"16px" ,backgroundColor:"#fff" }}/>} >
              <Typography sx ={{color:"#fff", opacity:1.0}}>
                {new Date(day.dt_txt).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{background: "#555555", color:"#fff", opacity:1.0}}>
              <Box display="flex" alignItems="center" >
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                />
                <Typography>{day.weather[0].description.toUpperCase()}</Typography>
              </Box>
              <Typography>
                <WbSunnyIcon /> High: {Math.round(day.main.temp_max)}
                {tempUnit}, Low: {Math.round(day.main.temp_min)}
                {tempUnit}
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
        <Box sx={{ p: 2, width: "100%", height: 300 , color:"#fff",background: "#fff"}}>
          <ResponsiveContainer width="100%" height="100%" >
            <LineChart data={chartData}  >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#333333" />
              <YAxis stroke="#333333" />
              <Tooltip  />
              <Legend />
              <Line type="monotone" dataKey = "High" stroke="#ba2d06" strokeWidth={4} />
              <Line type="monotone" dataKey="Low" stroke="#7b8dad" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

export default WeeklyForecast;
