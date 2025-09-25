'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

export default function HeroSection() {
const [movies, setMovies] = useState([])
const [trailerKey, setTrailerKey] = useState(null)
const router = useRouter()

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

useEffect(() => {
  async function fetchMovies() {
    try {
      // Fetch Bollywood (IN) and Hollywood (EN) movies
      const [indianRes, englishRes] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_origin_country=IN&sort_by=popularity.desc&page=1`
        ),
        fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=en&sort_by=popularity.desc&page=1`
        ),
      ])

      const [indianData, englishData] = await Promise.all([
        indianRes.json(),
        englishRes.json(),
      ])

      // Merge results
      const merged = [
        ...(indianData.results || []),
        ...(englishData.results || []),
      ].filter((m) => m.backdrop_path)

      // Remove duplicates by ID
      const unique = Array.from(new Map(merged.map((m) => [m.id, m])).values())

      // Pick top 7
      setMovies(unique.slice(6, 16))
    } catch (err) {
      console.error('Error fetching movies:', err)
    }
  }
  fetchMovies()
}, [API_KEY])

async function fetchTrailer(movieId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
  )
  const data = await res.json()
  const trailer = data.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  if (trailer) {
    setTrailerKey(trailer.key)
  } else {
    alert('Trailer not available')
  }
}

  return (
    <section className="w-full h-[40vh] lg:h-[80vh] relative mb-20 pt-16">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="w-full h-full custom-swiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div
              className="w-full h-[40vh] lg:h-[110vh] bg-cover bg-center relative flex items-center"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_top,black_0%,black_30%,rgba(0,0,0,0.8)_40%,rgba(0,0,0,0.3)_50%)]"></div>

              <div className="relative z-10 w-full">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex justify-start">
                  <div className="max-w-3xl text-white">
                    <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg mb-4">
                      {movie.title}
                    </h1>
                    <p className="text-sm md:text-lg mb-6 md:block hidden">{movie.overview}</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => fetchTrailer(movie.id)}
                        className="px-5 py-3 rounded-lg border border-white bg-white/20 backdrop-blur-sm hover:bg-white hover:text-black transition"
                      >
                        Watch Trailer
                      </button>
                      <button
                        onClick={() => router.push(`/movies/${movie.id}`)}
                        className="px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {trailerKey && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="w-full max-w-3xl aspect-video relative">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <button
            onClick={() => setTrailerKey(null)}
            className="absolute top-5 right-5 text-white text-2xl"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  )
}
