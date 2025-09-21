'use client'
import Image from 'next/image'
import React, { useState, useEffect, useMemo } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

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
  const [activeTab, setActiveTab] = useState('nowPlaying')
  const [loading, setLoading] = useState(true)

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY


  const categories = useMemo(
    () => [
      {
        key: 'nowPlaying',
        label: 'Now Playing',
        url: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`,
      },
      {
        key: 'trending',
        label: 'Trending',
        url: `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
      },
      {
        key: 'popular',
        label: 'Popular',
        url: `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
      },
      {
        key: 'topRated',
        label: 'Top Rated',
        url: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`,
      },
      {
        key: 'upcoming',
        label: 'Upcoming',
        url: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`,
      },
    ],
    [API_KEY] 
  )

  useEffect(() => {
    const fetchAllMovies = async () => {
      setLoading(true)
      try {
        const results = await Promise.all(
          categories.map(async (cat) => {
            const res = await fetch(cat.url)
            const data = await res.json()
            return { key: cat.key, movies: data.results || [] }
          })
        )

        const dataObj = results.reduce((acc, cur) => {
          acc[cur.key] = cur.movies
          return acc
        }, {})

        setMoviesData(dataObj)
      } catch (error) {
        console.error('Error fetching movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllMovies()
  }, [categories]) 

  const movies = moviesData[activeTab] || []

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Tab Buttons */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base font-semibold transition-colors duration-300 
              ${
                activeTab === cat.key
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
          640: { slidesPerView: 3, spaceBetween: 14 }, // mobile
          768: { slidesPerView: 4, spaceBetween: 16 }, // tablet
          1024: { slidesPerView: 6, spaceBetween: 20 }, // desktop
        }}
        className="pb-10"
      >
        {movies.length > 0 ? (
          movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div
                className="relative w-full 
                           h-[250px] sm:h-[320px] md:h-[380px] lg:h-[420px] 
                           border rounded-md overflow-hidden 
                           bg-zinc-900 text-white transition-all duration-300 cursor-pointer
                           border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] group"
              >
                {/* Poster */}
                <div className="relative">
                  <Image
                    src={
                      movie.poster_path
                        ? IMG_URL + movie.poster_path
                        : '/no-poster.png'
                    }
                    alt={movie.title || 'No title'}
                    width={220}
                    height={320}
                    className="object-cover w-full h-[70%] sm:h-[75%]"
                    // 🔹 Blur fallback if image is missing
                    placeholder="blur"
                    blurDataURL="/blur-placeholder.png"
                  />

                  <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 transition duration-300"></div>

                  {/* Book Button */}
                  <button
                    onClick={() => alert(`Booking ticket for ${movie.title}`)}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 sm:px-4 sm:py-2 
                               bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-lg
                               block sm:opacity-0 sm:group-hover:opacity-100 
                               transition duration-300 hover:bg-red-700"
                  >
                    Book Now
                  </button>
                </div>

                {/* Title */}
                <div className="p-2 text-center">
                  <p className="text-sm sm:text-base md:text-lg font-semibold truncate">
                    {movie.title}
                  </p>
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
    </div>
  )
}
