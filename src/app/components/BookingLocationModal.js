'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import TheatersNear from './NearbyTheaters'
import AllTheatersLocation from '../location/AllTheatersLocation'
import { X, MapPin, Navigation, Clapperboard, Ticket, Sparkles } from 'lucide-react'

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
  const [activeStep, setActiveStep] = useState(1)
  const [pulseAnimation, setPulseAnimation] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setActiveStep(1)
      setPulseAnimation(true)
      setTimeout(() => setPulseAnimation(false), 1000)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleModeChange = (mode) => {
    setSelectionMode(mode)
    setSelectedCinema(null)
    setActiveStep(2)
  }

  const handleCinemaSelect = (cinema) => {
    setSelectedCinema(cinema)
    setActiveStep(3)
  }

  // Progress Steps
  const steps = [
    { id: 1, title: 'Method', icon: Navigation },
    { id: 2, title: 'Select', icon: MapPin },
    { id: 3, title: 'Book', icon: Ticket }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-sm">
      {/* Holographic Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-blue-500/10 animate-pulse"></div>

      <div className="relative w-full max-w-3xl"> {/* Updated modal width */}
        {/* Floating Cinema Elements */}
        <div className="absolute -top-20 left-10 w-8 h-8 bg-yellow-400 rounded-full opacity-60 animate-float"></div>
        <div className="absolute -bottom-20 right-10 w-6 h-6 bg-red-400 rounded-full opacity-40 animate-float delay-1000"></div>
        <div className="absolute top-1/2 -left-10 w-4 h-4 bg-blue-400 rounded-full opacity-50 animate-float delay-500"></div>

        {/* Main Card - Futuristic Design */}
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-r from-red-900/30 via-gray-900 to-purple-900/30 p-6 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/20 rounded-xl border border-red-500/30">
                  <Clapperboard className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Experience {movie?.title?.length > 20 ? movie.title.slice(0, 20) + '...' : movie?.title}
                  </h2>
                  <p className="text-sm text-gray-300">Choose your cinematic journey</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
              >
                <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-4">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${activeStep >= step.id
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 border-red-400 text-white shadow-lg shadow-red-500/25'
                        : 'bg-gray-800 border-gray-600 text-gray-400'
                        } ${pulseAnimation && activeStep === step.id ? 'animate-pulse' : ''}`}>
                        <step.icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs mt-2 font-medium ${activeStep >= step.id ? 'text-white' : 'text-gray-500'
                        }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 rounded transition-all duration-500 ${activeStep > step.id ? 'bg-red-500' : 'bg-gray-700'
                        }`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {/* Step 1: Selection Method */}
            {activeStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-white">How would you like to find theaters?</h3>
                  <p className="text-gray-400 text-sm">Choose your discovery method</p>
                </div>

                <div className="grid gap-4">
                  <button
                    onClick={() => handleModeChange('auto')}
                    className="group p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border-2 border-gray-700 hover:border-red-500/50 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                        <Navigation className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Auto Detect</h4>
                        <p className="text-sm text-gray-400">Find nearest theaters automatically</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleModeChange('manual')}
                    className="group p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border-2 border-gray-700 hover:border-purple-500/50 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                        <MapPin className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Manual Select</h4>
                        <p className="text-sm text-gray-400">Browse all available locations</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Theater Selection */}
            {activeStep === 2 && (
              <div className="animate-fadeIn">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    {selectionMode === 'auto' ? 'Nearby Theaters' : 'All Locations'}
                  </h3>
                  <p className="text-gray-400 text-sm">Select your preferred cinema</p>
                </div>

                <div className="max-h-72 overflow-y-auto rounded-xl border border-gray-700/50">
                  {selectionMode === 'auto' ? (
                    <TheatersNear
                      selectedCinema={selectedCinema}
                      setSelectedCinema={handleCinemaSelect}
                    />
                  ) : (
                    <AllTheatersLocation
                      movieId={movie?.id}
                      onLocationSelect={(loc) => {
                        if (loc?.cinemas?.length > 0) {
                          handleCinemaSelect({
                            name: loc.cinemas[0],
                            city: loc.region,
                            district: loc.district,
                          })
                        }
                      }}
                    />

                  )}
                </div>

                <button
                  onClick={() => setActiveStep(1)}
                  className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  ← Back to methods
                </button>
              </div>
            )}

            {/* Step 3: Booking Confirmation */}
            {activeStep === 3 && selectedCinema && (
              <div className="text-center animate-fadeIn">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Ticket className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Perfect Choice!</h3>
                <p className="text-gray-300 mb-2">You're going to</p>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-green-500/30 mb-6">
                  <h4 className="font-semibold text-white text-lg">{selectedCinema.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {selectedCinema.district}, {selectedCinema.city}
                  </p>
                </div>

                {/* Original Book Button */}
                <button
                  onClick={() => {
                    router.push(
                      `/booking/${movie?.id}?cinema=${encodeURIComponent(
                        selectedCinema.name
                      )}&city=${selectedCinema.city}&district=${selectedCinema.district}`
                    )
                    onClose()
                  }}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl font-bold text-white shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                >
                  🎬 Proceed to Seating
                </button>

                <button
                  onClick={() => setActiveStep(2)}
                  className="mt-4 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  ← Choose different theater
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}