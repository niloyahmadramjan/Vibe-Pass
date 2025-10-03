'use client'
import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Custom cinema marker icon
const cinemaIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
})

function FlyToLocation({ latitude, longitude }) {
  const map = useMap()
  useEffect(() => {
    if (latitude && longitude) {
      map.flyTo([latitude, longitude], 15, { animate: true, duration: 1.5 })
    }
  }, [latitude, longitude, map])
  return null
}

export default function TheaterMap({ latitude, longitude, cinema }) {
  if (!latitude || !longitude) return null

  return (
    <div className="max-w-7xl h-72 md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-lg ">
      <MapContainer center={[latitude, longitude]} zoom={13} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToLocation latitude={latitude} longitude={longitude} />

        <Marker position={[latitude, longitude]} icon={cinemaIcon}>
          <Popup className="text-sm text-gray-800 font-semibold">🎬 {cinema}</Popup>
          <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
            {cinema}
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  )
}

