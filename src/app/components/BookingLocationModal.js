'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import TheatersNear from './NearbyTheaters'
import AllTheatersLocation from '../location/AllTheatersLocation'

export default function BookingLocationModal({
  isOpen,
  onClose,
  movie,
  selectionMode,
  setSelectionMode,
  selectedCinema,
  setSelectedCinema,
}) {
  const router = useRouter()
  if (!isOpen) return null

  // 🔹 Mode change handler
  const handleModeChange = (mode) => {
    setSelectionMode(mode)
    // Auto → Manual বা Manual → Auto গেলে আগের selection clear হবে
    setSelectedCinema(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-3">
      <div className="bg-[#1E1E1E] rounded-xl p-4 w-full max-w-sm sm:max-w-md relative border border-gray-700 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-3 text-gray-400 hover:text-white text-lg"
        >
          ✕
        </button>

        <div className="space-y-4">
          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-red-600 rounded-full"></div>
            <h2 className="text-base sm:text-lg font-semibold text-white">
              Book – {movie?.title?.length > 22 ? movie.title.slice(0, 22) + '...' : movie?.title}
            </h2>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-1.5 p-1 bg-gray-800 rounded-md text-xs sm:text-sm">
            <button
              onClick={() => handleModeChange('auto')}
              className={`flex-1 py-1 rounded font-medium transition-all ${selectionMode === 'auto'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Auto
            </button>
            <button
              onClick={() => handleModeChange('manual')}
              className={`flex-1 py-1 rounded font-medium transition-all ${selectionMode === 'manual'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Manual
            </button>
          </div>

          {/* Auto Mode */}
          {selectionMode === 'auto' && (
            <div className="max-h-52 overflow-y-auto border border-gray-700 rounded-md p-2">
              <TheatersNear
                selectedCinema={selectedCinema}
                setSelectedCinema={setSelectedCinema}
              />
            </div>
          )}

          {/* Manual Mode */}
          {selectionMode === 'manual' && (
            <div className="max-h-52 overflow-y-auto border border-gray-700 rounded-md p-2">
              <AllTheatersLocation
                movieId={movie?._id || movie?.id}
                onLocationSelect={(loc) => {
                  if (loc?.cinemas?.length > 0) {
                    setSelectedCinema({
                      name: loc.cinemas[0],
                      city: loc.region,
                      district: loc.district,
                    })
                  }
                }}
              />

            </div>
          )}

          {/* Book Button */}
          {selectedCinema && (
            <button
              onClick={() => {
                router.push(
                  `/booking/${movie?.id}?cinema=${encodeURIComponent(
                    selectedCinema.name
                  )}&city=${selectedCinema.city}&district=${selectedCinema.district}`
                )
                onClose()
              }}
              className="w-full py-2 rounded-md bg-gradient-to-r from-red-600 to-red-500 
                hover:from-red-500 hover:to-red-400 transition-all duration-200 
                flex items-center justify-center gap-2 font-semibold text-sm"
            >
              🎟️ Book at{' '}
              {selectedCinema.name.length > 16
                ? `${selectedCinema.name.substring(0, 16)}...`
                : selectedCinema.name}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
