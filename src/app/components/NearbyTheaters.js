'use client'
import { useEffect, useState } from 'react'
import { locations } from '@/app/lib/locations'
import dynamic from 'next/dynamic'

const TheaterMap = dynamic(() => import('./TheaterMap'), { ssr: false })

export default function TheatersNear({ selectedCinema, setSelectedCinema }) {
  const [nearest, setNearest] = useState(null)
  const [error, setError] = useState(null)
  const [cinemaCoords, setCinemaCoords] = useState({ lat: null, lng: null })

  // Haversine formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('❌ Geolocation not supported.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        let nearestLoc = null
        let minDist = Infinity

        locations.forEach((loc) => {
          const dist = getDistance(latitude, longitude, loc.latitude, loc.longitude)
          if (dist < minDist) {
            minDist = dist
            nearestLoc = loc
          }
        })

        setNearest(nearestLoc)
      },
      () => setError('❌ Location access denied!')
    )
  }, [])

  if (error) return <p className="text-red-400">{error}</p>
  if (!nearest) return <p className="text-gray-400">📍 Detecting nearby theaters...</p>

  const handleCinemaClick = (cinema, index) => {
    setSelectedCinema({
      name: cinema,
      lat: nearest.latitude + index * 0.001,
      lng: nearest.longitude + index * 0.001,
      district: nearest.district,
      city: nearest.city
    })
    setCinemaCoords({ lat: nearest.latitude + index * 0.001, lng: nearest.longitude + index * 0.001 })
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md space-y-4 max-w-7xl mx-auto my-10">
      <h3 className="text-lg font-bold mb-2">
         Theaters near {nearest.city}, {nearest.district}
      </h3>

      <ul className="space-y-2">
        {nearest.cinemas.map((cinema, i) => (
          <li
            key={i}
            onClick={() => handleCinemaClick(cinema, i)}
            className={`p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition ${selectedCinema?.name === cinema ? 'ring-2 ring-[#E50914]' : ''
              }`}
          >
            {cinema}
          </li>
        ))}
      </ul>

      {selectedCinema && (
        <TheaterMap
          latitude={cinemaCoords.lat}
          longitude={cinemaCoords.lng}
          cinema={selectedCinema.name}
        />
      )}
    </div>
  )
}