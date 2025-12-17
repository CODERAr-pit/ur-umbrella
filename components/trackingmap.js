"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

// Fix for default Leaflet marker icons in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Component to move the camera when rider moves
function MapUpdater({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.latitude, location.longitude], 16);
    }
  }, [location, map]);
  return null;
}

export default function TrackingMap({ location }) {
  // Default to [0,0] if no location yet
  const center = location ? [location.latitude, location.longitude] : [20.5937, 78.9629];

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {location && (
        <>
          <MapUpdater location={location} />
          <Marker position={[location.latitude, location.longitude]} icon={icon}>
            <Popup>Rider is here</Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
}