'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import BookingLocationModal from './BookingLocationModal' // ✅ modal import
import axiosSecure from '../api/axiosHook/useAxiosSecure'

// 🔹 Loading Spinner
function Spinner() {
  return (
    <div className="flex justify-center items-center h-60">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default function KidsMovies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const IMG_URL = 'https://image.tmdb.org/t/p/w500'

  // 🔹 Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectionMode, setSelectionMode] = useState('auto')
  const [selectedCinema, setSelectedCinema] = useState(null)


  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        // 🔹 Use axiosSecure to call your backend API
        const res = await axiosSecure.get("/api/movies/category/genreAnimation")

        // 🔹 Store results (movies list) in state
        setMovies(res.data || [])
      } catch (error) {
        console.error("Error fetching upcoming movies:", error)
      } finally {
        // 🔹 Stop loading spinner whether success or fail
        setLoading(false)
      }
    }

    fetchUpcoming()
  }, [])
  
  console.log(movies)
  if (loading) return <Spinner />

  // 🔹 Handle Book Now
  const handleBookNow = (movie) => {
    setSelectedMovie(movie)
    setSelectedCinema(null) // reset
    setSelectionMode('auto') // default auto
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* 🔥 Section Title */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-left text-red-500 mb-8">
        Kids Movies is Here
      </h2>

      {/* Slider */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        navigation
        breakpoints={{
          320: { slidesPerView: 2 },
          480: { slidesPerView: 2.3 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 3.5 },
          1024: { slidesPerView: 4.2 },
          1280: { slidesPerView: 5 },
        }}
        className="pb-10"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div
              className="relative movie-card w-full h-[280px] sm:h-[330px] md:h-[380px] lg:h-[420px] 
                         border border-red-500/40 rounded-xl overflow-hidden bg-zinc-900 
                         group shadow-lg hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] 
                         transition-all duration-300 cursor-pointer"
            >
              {/* Poster */}
              <Image
                src={
                  typeof movie.poster_path === "string" && movie.poster_path.startsWith("http")
                    ? movie.poster_path // full URL (like i.ibb.co)
                    : IMG_URL + movie.poster_path // TMDB partial path
                }
                alt={movie.title || "Movie Poster"}
                fill
                className="object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

              {/* Title */}
              <div className="absolute bottom-16 w-full text-center px-3">
                <p className="text-sm sm:text-base md:text-lg font-bold text-white truncate drop-shadow-md">
                  {movie.title}
                </p>
              </div>

              {/* Book Button */}
              <button
                onClick={() => handleBookNow(movie)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 
                           py-1 px-2 btn btn-secondary
                           text-xs sm:text-sm md:text-base font-semibold rounded-lg shadow-lg
                           transition duration-300
                           opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              >
                Book Now
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔹 Booking Modal */}
      <BookingLocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        selectedCinema={selectedCinema}
        setSelectedCinema={setSelectedCinema}
      />
    </div>
  )
}
