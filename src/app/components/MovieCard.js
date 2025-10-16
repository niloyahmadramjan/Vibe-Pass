'use client'
import Image from 'next/image'
import React, { useState, useEffect, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BookingLocationModal from './BookingLocationModal' // ✅ modal import
import axiosPublic from '../api/axiosHook/useAxiosPublic'

// 🔹 Loading Spinner
function Spinner() {
  return (
    <div className="flex justify-center items-center h-60">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

const BASE_URL = 'https://api.themoviedb.org/3'
const IMG_URL = 'https://image.tmdb.org/t/p/w500'

export default function MovieCard() {
  const [moviesData, setMoviesData] = useState({})
  const [activeTab, setActiveTab] = useState('topRated')
  const [loading, setLoading] = useState(true)
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
  const router = useRouter()

  // 🔹 Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectionMode, setSelectionMode] = useState('auto')
  const [selectedCinema, setSelectedCinema] = useState(null)
  const categories = useMemo(
    () => [
      { key: "topRated", label: "Top Rated" },
      { key: "trending", label: "Trending" },
      { key: "popular", label: "Popular" },
      { key: "nowPlaying", label: "Now Playing" },
      { key: "upcoming", label: "Upcoming" }
    ],
    []
  )

  // 🔹 Fetch Movies
  useEffect(() => {
    const fetchAllMovies = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          categories.map(async (cat) => {
            const res = await axiosPublic.get(`/api/movies/category/${cat.key}`)
            return { key: cat.key, movies: res.data || [] }

          })
        )

        const dataObj = results.reduce((acc, cur) => {
          acc[cur.key] = cur.movies
          return acc
        }, {})

        setMoviesData(dataObj)
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllMovies()
  }, [categories])

  const movies = moviesData[activeTab] || []
  if (loading) return <Spinner />

  // 🔹 Handle Book Now
  const handleBookNow = (movie) => {
    setSelectedMovie(movie)
    setSelectedCinema(null) // reset
    setSelectionMode('auto') // default auto
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Tab Buttons */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base font-semibold transition-colors duration-300 
              ${activeTab === cat.key
                ? 'bg-red-600 text-white'
                : 'bg-zinc-800 text-gray-300 hover:bg-red-500 hover:text-white'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Movie Slider */}
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={2}
        spaceBetween={10}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 14 },
          768: { slidesPerView: 4, spaceBetween: 16 },
          1024: { slidesPerView: 5, spaceBetween: 20 },
        }}
        className="pb-10"
      >
        {movies.length > 0 ? (
          movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div
                className="relative movie-card w-full h-[350px] md:h-[380px] lg:h-[410px] 
                border rounded-md overflow-hidden bg-zinc-900 text-white transition-all duration-300 cursor-pointer
                border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] group"
              >
                {/* Poster */}
                <div className="relative w-full h-[70%] sm:h-[67%]">
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

                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 transition duration-300"></div>
                </div>

                {/* Title + Buttons */}
                <div className="p-2 flex flex-col justify-between">
                  <p className="text-sm sm:text-base md:text-lg font-semibold truncate mb-2">
                    {movie.title}
                  </p>

                  <div className="flex flex-col gap-2">
                    {/* Book Now */}
                    {activeTab !== 'upcoming' && (
                      <button
                        onClick={() => handleBookNow(movie)}
                        className="w-10/12 flex justify-center mx-auto py-1 rounded-lg btn-secondary font-semibold 
                          hover:bg-red-700 transition duration-300
                          opacity-100 lg:opacity-0 group-hover:opacity-100"
                      >
                        Book Now
                      </button>
                    )}

                    {/* Details */}
                    <Link href={`/movies/${movie.id}`}>
                      <button
                        className="w-10/12 flex justify-center mx-auto py-1 text-white bg-red-600 rounded-lg 
                          hover:bg-red-700 transition duration-300"
                      >
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p className="text-gray-400 text-center w-full">
            No movies available
          </p>
        )}
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