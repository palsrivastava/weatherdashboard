import React from "react";
import { IconButton } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface LocationButtonProps {
  onCitySelect: (lat: number, lon: number, label: string) => void;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onCitySelect }) => {
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          onCitySelect(lat, lon, "Current Location");
        },
        (error) => {
          console.error("Error retrieving location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <IconButton sx={{color:"#fff"}}onClick={handleLocationClick}>
      <LocationOnIcon color="inherit" />
    </IconButton>
  );
};

export default LocationButton;
