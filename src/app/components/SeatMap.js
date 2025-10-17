'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

// Load Map only on client
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
)
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), {
  ssr: false,
})
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), {
  ssr: false,
})

export default function SeatMap({
  locations,
  selectedLocation = null,
  mapRef,
}) {
  const [redIcon, setRedIcon] = useState(null)

  useEffect(() => {
    import('leaflet').then((L) => {
      const icon = new L.Icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
      setRedIcon(icon)
    })
  }, [])

  const generateMarkers = (locs) =>
    locs.flatMap((loc) =>
      loc.cinemas.map((cinema) => {
        const offset = 0.1
        const lat = loc.latitude + (Math.random() - 0.5) * offset
        const lng = loc.longitude + (Math.random() - 0.5) * offset
        return { position: [lat, lng], name: cinema, district: loc.district }
      })
    )

  const markers = selectedLocation
    ? generateMarkers([selectedLocation])
    : generateMarkers(locations)

  return (
    <div className="w-full h-[600px] mt-4 rounded-lg shadow-lg overflow-hidden">
      <MapContainer
        center={[23.8103, 90.4125]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%',zIndex:"50"}}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        {/* Light Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Tiles &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={['a', 'b', 'c', 'd']}
        />

        {/* Markers */}
        {redIcon &&
          markers.map((marker, index) => (
            <Marker key={index} position={marker.position} icon={redIcon}>
              <Popup>
                <div className="text-sm text-black bg-white p-2 rounded-md">
                  <h3 className="font-bold">{marker.name}</h3>
                  <p className="text-gray-700">District: {marker.district}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  )
}
