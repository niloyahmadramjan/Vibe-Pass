'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import Link from 'next/link'
import axiosPublic from '../api/axiosHook/useAxiosPublic'

// Simple Loading Spinner Component
function Spinner() {
  return (
    <div className="flex justify-center items-center h-60">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default function UpcomingMovie() {
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // TMDB API config
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
  const BASE_URL = 'https://api.themoviedb.org/3'
  const IMG_URL = 'https://image.tmdb.org/t/p/w500'

  /**
   * Fetch upcoming movies from TMDB
   */
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        // 🔹 Use axiosPublic to call your backend API
        const res = await axiosPublic.get("/api/movies/category/upcoming")

        // 🔹 Store results (movies list) in state
        setUpcoming(res.data || [])
      } catch (error) {
        console.error("Error fetching upcoming movies:", error)
      } finally {
        // 🔹 Stop loading spinner whether success or fail
        setLoading(false)
      }
    }

    fetchUpcoming()
  }, [])

  if (loading) return <Spinner />

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold  text-red-500 mb-6 text-left">
        Coming Soon To Theaters
      </h2>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation]}
        navigation
        loop={false}
        spaceBetween={20}
        slidesPerView={2} // default for small screens
        slidesPerGroup={2}
        breakpoints={{
          640: { slidesPerView: 3, slidesPerGroup: 3 }, // mobile landscape
          768: { slidesPerView: 4, slidesPerGroup: 4 }, // tablet
          1024: { slidesPerView: 5, slidesPerGroup: 5 }, // desktop 5 cards per row
        }}
      >
        {upcoming.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div
              className="relative movie-card border rounded-lg overflow-hidden 
                         bg-zinc-900 text-white transition-all duration-300 cursor-pointer
                         border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] group"
            >
              {/* Poster */}
              <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
                <Image
                  src={
                    typeof movie.poster_path === "string" && movie.poster_path.startsWith("http")
                      ? movie.poster_path // full URL (like i.ibb.co)
                      : IMG_URL + movie.poster_path // TMDB partial path
                  }
                  alt={movie.title || "Movie Poster"}
                  width={240}
                  height={260}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 transition duration-300"></div>

                {/* Release Date Top Right */}
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs sm:text-sm px-2 py-1 rounded-md shadow-md">
                  {movie.release_date || 'TBA'}
                </span>
              </div>

              {/* Title + Button */}
              <div className="p-3 text-center flex flex-col items-center">
                <p className="text-sm sm:text-base md:text-lg font-bold truncate mb-2">
                  {movie.title}
                </p>
                <Link
                  href={`/movies/${movie.id}`}
                  className="px-3 py-1.5 sm:px-4  btn-secondary text-xs sm:text-sm font-semibold rounded-lg shadow-lg transition duration-300"
                >
                  Details
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
