'use client'

import { useState, useEffect, useRef } from 'react'
import { FaMapMarkerAlt, FaChevronDown, FaSearchLocation } from 'react-icons/fa'
import SeatMap from '../components/SeatMap'
import { locations } from '../lib/locations'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

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

  // Map এ zoom
  const handleFindCinemas = () => {
    if (selectedLocation && mapRef.current) {
      setIsLoading(true)

      setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)

      setTimeout(() => {
        if (mapRef.current.flyTo) {
          mapRef.current.flyTo(
            [selectedLocation.latitude, selectedLocation.longitude],
            10,
            { duration: 2 }
          )
        }
        setIsLoading(false)

        Swal.fire({
          icon: 'success',
          title: 'Cinemas Found!',
          text: `Now viewing cinemas in ${selectedLocation.district}, ${selectedLocation.region}`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
          background: '#1e1e1e',
          color: '#fff',
        })
      }, 500)
    }
  }

  // Cinema select করলে update হবে
  const handleSelectCinema = (cinema) => {
    setSelectedCinema(cinema)

    if (mapRef.current && selectedLocation) {
      mapRef.current.flyTo(
        [selectedLocation.latitude, selectedLocation.longitude],
        14,
        { duration: 1.5 }
      )
    }
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
    <div className=" py-8 px-4 sm:px-6  text-white">
      <div className="max-w-6xl mx-auto">
        {/* Division + District Select */}
        <div className="rounded-2xl shadow-xl p-6 mb-8 border border-gray-700 bg-transparent">
          <div className="grid grid-cols-1  gap-6 items-end">
            {/* Division */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Division
              </label>
              <div className="relative">
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-600 rounded-lg text-white bg-[#121212] appearance-none"
                >
                  <option value="">Choose a Division</option>
                  {uniqueDivisions.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearchLocation className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                District
              </label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedDivision}
                  className="w-full px-4 py-3 pl-10 border border-gray-600 rounded-lg disabled:bg-gray-800 text-white bg-[#121212] appearance-none"
                >
                  <option value="">Choose a District</option>
                  {districts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Button */}
            <div>
              <button
                onClick={handleFindCinemas}
                disabled={!selectedLocation || isLoading}
                className="w-full bg-[#E50914] disabled:bg-[#7a3d3f] text-white py-3 px-6 rounded-lg font-medium"
              >
                {isLoading ? 'Loading...' : 'Set Your Location'}
              </button>
            </div>
          </div>
        </div>

        {/* Cinemas */}
        {selectedLocation && (
          <div className="rounded-2xl shadow-md p-6 mb-8 border border-gray-700 bg-transparent">
            <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Cinemas in {selectedLocation.district}, {selectedLocation.region}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {selectedLocation.cinemas.map((cinema, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectCinema(cinema)}
                  className={`rounded-lg p-4 border cursor-pointer transition-colors ${
                    selectedCinema === cinema
                      ? 'border-red-500 bg-gray-800'
                      : 'border-gray-700 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500 text-lg" />
                      <h3 className="font-medium text-white">{cinema}</h3>
                    </div>
                    <p className="text-sm text-gray-400">
                      {selectedLocation.district}
                    </p>
                    {selectedCinema === cinema && (
                      <button
                        onClick={handleBookNow}
                        className="bg-red-600 text-white py-2 rounded-md mt-2 hover:bg-red-700 transition"
                      >
                        Book Now
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
    </div>
  )
}
