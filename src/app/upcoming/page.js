'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoadingSpinner from '../hooks/LoadingSpiner'


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

  if (loading) return  <LoadingSpinner/>

  return (
    <div className="min-h-screen text-white px-4 md:px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-600 drop-shadow-lg mt-14">
        🎬 Upcoming Movies
      </h1>

      {movies.length === 0 ? (
        <p className="text-center text-gray-400">No upcoming movies found!</p>
      ) : (
        <>
          {/* ✅ Unique Movie Cards */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="relative rounded-xl overflow-hidden shadow-lg group bg-white/10 backdrop-blur-md border border-white/10 hover:scale-105 transform transition duration-300"
              >
                {/* Poster with Hover Zoom */}
                <div className="relative w-full h-[280px]">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 flex flex-col justify-end p-3">
                    <h2 className="text-lg font-semibold truncate">
                      {movie.title}
                    </h2>
                    <p className="text-xs text-gray-300">{movie.release_date}</p>
                  </div>
                </div>

                {/* Info + Button */}
                <div className="p-3">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-red-400 font-bold">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {movie.vote_count} votes
                    </span>
                  </div>

                  <button
                    onClick={() => router.push(`/movies/${movie.id}`)}
                    className="w-full px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg shadow-md transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Pagination */}
          <div className="flex justify-center items-center gap-6 mt-12">
            <button
              disabled={page === 1}
              onClick={() => router.push(`/upcoming?page=${page - 1}`)}
              className={`px-5 py-2 rounded-full font-semibold transition ${page === 1
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg'
                }`}
            >
              ⬅ Prev
            </button>

            <span className="text-gray-300 font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => router.push(`/upcoming?page=${page + 1}`)}
              className={`px-5 py-2 rounded-full font-semibold transition ${page === totalPages
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                  : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg'
                }`}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  )
}
