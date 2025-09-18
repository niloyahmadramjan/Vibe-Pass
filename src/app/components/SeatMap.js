"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet markers for Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function SeatMap({ locations, selectedLocation = null, mapRef }) {
  const generateMarkers = (locs) =>
    locs.flatMap((loc) =>
      loc.cinemas.map((cinema) => {
        const offset = 0.1;
        const lat = loc.latitude + (Math.random() - 0.5) * offset;
        const lng = loc.longitude + (Math.random() - 0.5) * offset;
        return { position: [lat, lng], name: cinema, district: loc.district };
      })
    );

  const markers = selectedLocation ? generateMarkers([selectedLocation]) : generateMarkers(locations);

  const initialCenter = [23.8103, 90.4125]; // Default to Dhaka
  const initialZoom = 7;

  return (
    <div className="w-full h-[600px] mt-4 rounded-lg shadow-lg">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>
              <div>
                <h3 className="font-bold">{marker.name}</h3>
                <p>District: {marker.district}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}