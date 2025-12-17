"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import { clear } from "console";

let socket;

function LocationUpdater() {
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (socket) {
              socket.emit("send-location", { latitude, longitude });
          }
          // Location milte hi Street Level (16) pe focus karega
          map.setView([latitude, longitude], 16);
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [map]);

  return null;
}

export default function Map() {
  const [users, setUsers] = useState({});

  useEffect(() => {
    socket = io(); 

    socket.on("receive-location", (data) => {
      setUsers((prev) => ({ ...prev, [data.id]: data }));
    });

    socket.on("user-disconnected", (id) => {
      setUsers((prev) => {
        const newUsers = { ...prev };
        delete newUsers[id];
        return newUsers;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <MapContainer 
        center={[0, 0]} 
        zoom={16} 
        minZoom={14} // CHANGE: User thoda zoom out kar sakta hai (Area dekhne ke liye)
        maxZoom={20} // CHANGE: Full Zoom In allowed hai (Ghar ke andar tak :D)
        // zoomControl={true} // Default true hi hota hai, isliye hata diya false wala line
        style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationUpdater />
      
      {Object.values(users).map((user) => (
        <CircleMarker 
          key={user.id} 
          center={[user.latitude, user.longitude]} 
          radius={8}
          pathOptions={{ color: 'red' }}
        >
          <Popup>{user.id}</Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}