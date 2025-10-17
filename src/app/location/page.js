'use client'

import { useState, useEffect, useRef } from 'react'
import { FaMapMarkerAlt, FaChevronDown, FaSearchLocation } from 'react-icons/fa'
import SeatMap from '../components/SeatMap'
import { locations } from '../lib/locations'

export default function LocationPage() {
  const [selectedDivision, setSelectedDivision] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [districts, setDistricts] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedCinema, setSelectedCinema] = useState(null)

  const mapRef = useRef(null)

  const uniqueDivisions = [...new Set(locations.map((loc) => loc.region))]

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

 
  useEffect(() => {
    if (selectedDistrict && selectedDivision) {
      const loc = locations.find(
        (l) => l.region === selectedDivision && l.district === selectedDistrict
      )
      setSelectedLocation(loc || null)
      setSelectedCinema(null)

      if (loc && mapRef.current?.flyTo) {
        mapRef.current.flyTo([loc.latitude, loc.longitude], 10, {
          duration: 2,
        })
      }
    } else {
      setSelectedLocation(null)
      setSelectedCinema(null)
    }
  }, [selectedDistrict, selectedDivision])

  
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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 pt-20 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Find Cinemas By Location
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Select your division and district to view all nearby cinema halls.
          </p>
        </div>

        {/* Division + District Select */}
        <div className="rounded-2xl shadow-xl p-6 mb-8 border border-gray-700 bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
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
          </div>
        </div>

        {/* Cinemas auto-show */}
        {selectedLocation && (
          <div className="rounded-2xl shadow-md p-6 mb-8 border border-gray-700 bg-transparent">
            <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-gray-700 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Cinemas in {selectedLocation.district}, {selectedLocation.region}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-700 bg-dark">
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
