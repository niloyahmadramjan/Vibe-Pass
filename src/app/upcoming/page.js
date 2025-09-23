'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// ✅ Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// ✅ Loading spinner
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default function UpcomingMoviesPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true)
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
        )
        const data = await res.json()
        setMovies(data.results || [])
        setTotalPages(data.total_pages)
      } catch (error) {
        console.error('Failed to fetch upcoming movies', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [page])

  if (loading) return <LoadingSpinner />

  const heroMovies = movies.slice(0, 5) // ✅ Top 5 movies for slider

  return (
    <div className="min-h-screen text-white">
      {/* 🎬 Hero Banner Slider */}
      <div className="relative w-full h-[500px] md:h-[650px]">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop
          className="h-full"
        >
          {heroMovies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div className="relative w-full h-[500px] md:h-[650px]">
                <Image
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-8 md:p-14">
                  <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-red-500 drop-shadow-lg">
                    {movie.title}
                  </h1>
                  <p className="max-w-2xl text-gray-200 mb-6 line-clamp-3">
                    {movie.overview}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => router.push(`/movies/${movie.id}`)}
                      className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold shadow-lg transition"
                    >
                      🎟 View Details
                    </button>
                    <button className="px-5 py-2 bg-gray-800/70 hover:bg-gray-700 rounded-lg font-semibold shadow-lg transition">
                      ▶ Watch Trailer
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 🔥 Section Title */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-red-500">
          🎬 Upcoming Movies
        </h2>

        {/* 🃏 Movie Cards - 4 per row */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative bg-gray-900 rounded-xl overflow-hidden group shadow-lg hover:scale-[1.03] hover:shadow-2xl transform transition duration-300"
            >
              {/* Poster */}
              <div className="relative w-full h-[280px]">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* ⭐ Rating Badge */}
                <div className="absolute top-3 left-3 bg-red-600 px-2 py-1 rounded-md text-sm font-bold shadow-md">
                  ⭐ {movie.vote_average.toFixed(1)}
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-3">
                  {movie.release_date}
                </p>

                <button
                  onClick={() => router.push(`/movies/${movie.id}`)}
                  className="mt-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-md transition"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 🔢 Pagination */}
        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
          {Array.from(
            { length: Math.min(5, totalPages) },
            (_, i) => i + Math.max(1, page - 2)
          ).map((p) => (
            <button
              key={p}
              onClick={() => router.push(`/upcoming?page=${p}`)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${p === page
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
