'use client'
import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapComponent({ selectedDivision, hallData }) {
  useEffect(() => {
    const map = L.map('map').setView([23.8103, 90.4125], 7)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    if (selectedDivision) {
      const division = hallData.find((div) => div.name === selectedDivision)

      // পুরানো marker clear
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) map.removeLayer(layer)
      })

      division?.districts?.forEach((district) => {
        district?.halls?.forEach((hall) => {
          if (hall.lat && hall.lng) {
            const marker = L.marker([hall.lat, hall.lng]).addTo(map)
            marker.bindPopup(`<b>${hall.name}</b><br/>📍 ${district.label}`)
          }
        })
      })

      // Map Center = first district
      const firstDistrict = division?.districts?.[0]
      if (firstDistrict?.lat && firstDistrict?.lng) {
        map.setView([firstDistrict.lat, firstDistrict.lng], 8)
      }
    }

    return () => map.remove()
  }, [selectedDivision, hallData])

  return <div id="map" className="w-full h-[500px] rounded-xl shadow-lg" />
}
