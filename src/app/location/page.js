"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaChevronDown,
  FaSearchLocation,
} from "react-icons/fa";
import SeatMap from "../components/SeatMap";
import { locations } from "../lib/locations";
import Swal from "sweetalert2";

export default function LocationPage() {
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mapRef = useRef(null);

  const uniqueDivisions = [...new Set(locations.map((loc) => loc.region))];

  // Update districts when division changes
  useEffect(() => {
    if (selectedDivision) {
      const filteredDistricts = locations
        .filter((loc) => loc.region === selectedDivision)
        .map((loc) => loc.district);
      setDistricts([...new Set(filteredDistricts)]);
      setSelectedDistrict("");
      setSelectedLocation(null);
    } else {
      setDistricts([]);
      setSelectedLocation(null);
    }
  }, [selectedDivision]);

  // Update selected location when district changes
  useEffect(() => {
    if (selectedDistrict && selectedDivision) {
      const loc = locations.find(
        (l) => l.region === selectedDivision && l.district === selectedDistrict
      );
      setSelectedLocation(loc || null);
    } else {
      setSelectedLocation(null);
    }
  }, [selectedDistrict, selectedDivision]);

  // Find Cinemas Button
  const handleFindCinemas = () => {
    if (selectedLocation && mapRef.current) {
      setIsLoading(true);

      // Scroll to map
      setTimeout(() => {
        mapRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      // Fly to district
      setTimeout(() => {
        if (mapRef.current.flyTo) {
          mapRef.current.flyTo(
            [selectedLocation.latitude, selectedLocation.longitude],
            13,
            { duration: 2, easeLinearity: 0.25 }
          );
        }
        setIsLoading(false);

        Swal.fire({
          icon: "success",
          title: "Cinemas Found!",
          text: `Now viewing cinemas in ${selectedLocation.district}, ${selectedLocation.region}`,
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
      }, 500);
    }
  };

  // Zoom to specific cinema
  const handleZoomToCinema = (cinema) => {
    if (mapRef.current && selectedLocation) {
      const offset = 0.1;
      const lat = selectedLocation.latitude + (Math.random() - 0.5) * offset;
      const lng = selectedLocation.longitude + (Math.random() - 0.5) * offset;
      mapRef.current.flyTo([lat, lng], 15, { duration: 1.5 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Find Cinemas And Setup Your Location
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your division and district to discover cinema locations and
            zoom to them on the map
          </p>
        </div>

        {/* Selection Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Division Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Division
              </label>
              <div className="relative">
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black appearance-none"
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

            {/* District Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District
              </label>
              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedDivision}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-black appearance-none"
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

            {/* Find Cinemas Button */}
            <div>
              <button
                onClick={handleFindCinemas}
                disabled={!selectedLocation || isLoading}
                className="w-full bg-[#CC2027] disabled:bg-[#da7276] text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:bg-[#E53935]"
              >
                {isLoading ? "Loading..." : "Set Your Location"}
              </button>
            </div>
          </div>
        </div>

        {/* Cinemas List */}
        {selectedLocation && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 transition-all duration-500 ease-in-out transform">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Cinemas in {selectedLocation.district}, {selectedLocation.region}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedLocation.cinemas.map((cinema, index) => (
                <div
                  key={index}
                  onClick={() => handleZoomToCinema(cinema)}
                  className="bg-blue-50 rounded-lg p-4 border border-blue-100 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                      <FaMapMarkerAlt className="text-red-500 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{cinema}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedLocation.district}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <SeatMap
            locations={locations}
            selectedLocation={selectedLocation}
            mapRef={mapRef}
          />
        </div>
      </div>
    </div>
  );
}
