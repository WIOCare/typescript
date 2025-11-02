"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
}

interface MapViewProps {
  location: LocationData;
}

// Fix for default marker icon
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapView({ location }: MapViewProps) {
  useEffect(() => {
    // Ensure Leaflet is properly initialized
    const defaultPrototype = L.Icon.Default.prototype as { _getIconUrl?: () => string };
    delete defaultPrototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const position: [number, number] = [location.latitude, location.longitude];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        key={`${location.latitude}-${location.longitude}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold mb-1">Your Location</p>
              <p className="text-xs text-gray-600">
                Lat: {location.latitude.toFixed(6)}
              </p>
              <p className="text-xs text-gray-600">
                Lng: {location.longitude.toFixed(6)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Accuracy: ±{location.accuracy.toFixed(0)}m
              </p>
            </div>
          </Popup>
        </Marker>
        <Circle
          center={position}
          radius={location.accuracy}
          pathOptions={{
            fillColor: "blue",
            fillOpacity: 0.1,
            color: "blue",
            weight: 1,
          }}
        />
      </MapContainer>
    </div>
  );
}
