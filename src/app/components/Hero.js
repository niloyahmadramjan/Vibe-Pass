'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import axiosPublic from '../api/axiosHook/useAxiosPublic'

export default function HeroSection() {
  const [movies, setMovies] = useState([])
  const [trailerKey, setTrailerKey] = useState(null)
  const router = useRouter()
  const [trailerUrl, setTrailerUrl] = useState('')

  // const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
  // const url = 'https://image.tmdb.org/t/p/w500'

  useEffect(() => {
    async function fetchMovies() {
      try {
        // 🔹 Use axiosPublic to call your backend API
        const [hollywoodRes, bollywoodRes] = await Promise.all([
          axiosPublic.get('/api/movies/category/trending'),
          axiosPublic.get('/api/movies/category/genreAction'),
        ])

        const hollywoodData = hollywoodRes.data
        const bollywoodData = bollywoodRes.data

        // Merge results and filter only movies with backdrops
        const merged = [
          ...(hollywoodData || []),
          ...(bollywoodData || []),
        ].filter((m) => m.backdrop_path)

        // Remove duplicates by id
        const unique = Array.from(
          new Map(merged.map((m) => [m.id, m])).values()
        )

        // Pick top movies for hero section
        setMovies(unique.slice(9, 25))
      } catch (err) {
        console.error('Error fetching movies:', err)
      }
    }
    fetchMovies()
  }, [])

  const fetchTrailer = async (tmdbId) => {
    try {
      console.log('🎥 Fetching trailer for TMDB ID:', tmdbId)

      // ✅ Call your backend API
      const res = await axiosPublic.get(`/api/movies/${tmdbId}/videos`)

      if (res.status === 200) {
        const results = res.data.results

        const trailer = results.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        )

        if (trailer) {
          setTrailerUrl(
            `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
          )
          setTrailerKey(true)
        } else {
          alert('Trailer not available!')
        }
      } else {
        console.error('Failed to fetch trailer: Status', res.status)
      }
    } catch (error) {
      console.error('🎬 Failed to fetch trailer:', error)
    }
  }

  return (
    <section className="w-full h-[44vh] lg:h-[80vh] relative mb-7 md:mb-10 pt-16 md:pt-0">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full custom-swiper"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div
              className="w-full h-[40vh] lg:h-[100vh] bg-cover bg-center relative flex items-center"
              style={{
                backgroundImage: movie.backdrop_path
                  ? movie.backdrop_path.startsWith('http')
                    ? `url(${movie.backdrop_path})` // full URL (like i.ibb.co)
                    : `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` // TMDB path
                  : 'url(/fallback-banner.jpg)', // optional fallback
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_top,black_0%,black_30%,rgba(0,0,0,0.8)_40%,rgba(0,0,0,0.3)_50%)]"></div>

              <div className="relative z-10 w-full ">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 flex justify-start">
                  <div className="max-w-3xl text-white">
                    <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg mb-4">
                      {movie.title}
                    </h1>
                    <p className="text-sm md:text-lg mb-6 md:block hidden">
                      {movie.overview}
                    </p>
                    <div className="flex gap-4 ">
                      <button
                        onClick={() => fetchTrailer(movie.id)}
                        className=" px-2 lg:px-5 py-0 lg:py-3 rounded-lg border border-white bg-white/20 backdrop-blur-sm hover:bg-white hover:text-black transition text-sm"
                      >
                        Watch Trailer
                      </button>
                      <button
                        onClick={() => router.push(`/movies/${movie.id}`)}
                        className=" px-2 lg:px-5 py-1 lg:py-3  rounded-lg bg-red-600 hover:bg-red-700 transition"
                      >
                        Details
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-3xl p-4 bg-black rounded-xl">
            <button
              onClick={() => setTrailerKey(false)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg"
            >
              ✖ Close
            </button>
            <iframe
              src={trailerUrl}
              width="100%"
              height="500"
              title="Movie Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </section>
  )
}
