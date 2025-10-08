'use client'

import { useState, useEffect, useRef } from 'react'
import { FaMapMarkerAlt, FaChevronDown, FaSearchLocation } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { locations } from '../lib/locations'
import SeatMap from '../components/SeatMap'

export default function AllTheatersLocation() {
  const [selectedDivision, setSelectedDivision] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [districts, setDistricts] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedCinema, setSelectedCinema] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const mapRef = useRef(null)
  const router = useRouter()

  const uniqueDivisions = [...new Set(locations.map((loc) => loc.region))]

  // Division select হলে District filter হবে
  useEffect(() => {
    if (selectedDivision) {
      const filteredDistricts = locations
        .filter((loc) => loc.region === selectedDivision)
        .map((loc) => loc.district)
      setDistricts([...new Set(filteredDistricts)])
      setSelectedDistrict('')
      setSelectedLocation(null)
      setSelectedCinema(null)
    } else {
      setDistricts([])
      setSelectedLocation(null)
      setSelectedCinema(null)
    }
  }, [selectedDivision])

  // District select হলে Location update হবে
  useEffect(() => {
    if (selectedDistrict && selectedDivision) {
      const loc = locations.find(
        (l) => l.region === selectedDivision && l.district === selectedDistrict
      )
      setSelectedLocation(loc || null)
      setSelectedCinema(null)
    } else {
      setSelectedLocation(null)
      setSelectedCinema(null)
    }
  }, [selectedDistrict, selectedDivision])

  // Find Cinemas
  const handleFindCinemas = () => {
    if (selectedLocation) {
      setIsLoading(true)
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Cinemas Found!',
          text: `Now viewing cinemas in ${selectedLocation.district}, ${selectedLocation.region}`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#E50914',
          background: '#1e1e1e',
          color: '#fff',
        })
        setIsLoading(false)
      }, 700)
    }
  }

  // Cinema select করলে update হবে
  const handleSelectCinema = (cinema) => {
    setSelectedCinema(cinema)
  }

  // ✅ Book Now click করলে redirect হবে booking page এ
  const handleBookNow = () => {
    if (!selectedCinema || !selectedLocation) return
    router.push(
      `/booking/1311031?cinema=${encodeURIComponent(
        selectedCinema
      )}&city=${encodeURIComponent(selectedLocation.city)}&district=${encodeURIComponent(
        selectedLocation.district
      )}`
    )
  }

  return (
    <div className="text-white space-y-5">
      {/* Division + District Select */}
      <div className="rounded-xl p-4 border border-gray-700 bg-[#111111]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          {/* Division */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Division
            </label>
            <div className="relative">
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-3 py-2 pl-8 border border-gray-600 rounded-md text-white bg-[#1a1a1a] text-sm appearance-none"
              >
                <option value="">Select</option>
                {uniqueDivisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
              <FaSearchLocation className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            </div>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              District
            </label>
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedDivision}
                className="w-full px-3 py-2 pl-8 border border-gray-600 rounded-md text-white bg-[#1a1a1a] text-sm appearance-none disabled:bg-gray-800"
              >
                <option value="">Select</option>
                {districts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              <FaMapMarkerAlt className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <FaChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            </div>
          </div>


        </div>
      </div>

      {/* Cinemas */}
      {selectedLocation && (
        <div className="rounded-xl p-4 border border-gray-700 bg-[#111111]">
          <h2 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-1">
             {selectedLocation.district}, {selectedLocation.region}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedLocation.cinemas.map((cinema, index) => (
              <div
                key={index}
                onClick={() => handleSelectCinema(cinema)}
                className={`rounded-md p-3 border text-sm cursor-pointer ${selectedCinema === cinema
                  ? 'border-red-500 bg-gray-800'
                  : 'border-gray-700 hover:bg-gray-800'
                  }`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{cinema}</span>
                  {selectedCinema === cinema && (
                    <button
                      onClick={handleBookNow}
                      className="text-xs bg-red-600 px-2 py-1 rounded-md hover:bg-red-700"
                    >
                      Book
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-700 bg-dark h-72">
        <SeatMap
          locations={locations}
          selectedLocation={selectedLocation}
          selectedCinema={selectedCinema}
          mapRef={mapRef}
        />
      </div>
    </div>
  )
}
