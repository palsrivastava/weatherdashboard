import React, { useState } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import { getOpenWeatherTileUrl } from "../util/route"; 
import "leaflet/dist/leaflet.css";

const { BaseLayer, Overlay } = LayersControl;

interface WeatherMapProps {
  lat: number;
  lon: number;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lon }) => {
  const [zoom] = useState<number>(6);


  const temperatureTiles = getOpenWeatherTileUrl("temp_new");
  const cloudsTiles = getOpenWeatherTileUrl("clouds_new");

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={zoom}
      style={{ height: "300px", width: "100%" }}
    >
      <LayersControl position="topright">
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </BaseLayer>

        <Overlay checked name="Temperature">
          <TileLayer url={temperatureTiles} opacity={1.0} />
        </Overlay>

        <Overlay name="Clouds">
          <TileLayer url={cloudsTiles} opacity={1.0} />
        </Overlay>
      </LayersControl>
    </MapContainer>
  );
};

export default WeatherMap;
