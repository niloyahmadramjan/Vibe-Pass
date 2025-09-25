'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default function MoviesPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true)
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
        )
        const data = await res.json()
        setMovies(data.results || [])
      } catch (error) {
        console.error('Failed to fetch movies', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen text-white px-4 md:px-6 py-10 pt-25 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-red-500">
      Popular Movies
      </h1>

      {movies.length === 0 ? (
        <p className="text-center text-gray-400">No movies found!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 flex flex-col"
            >
              <div className="relative w-full h-[350px]">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-lg font-bold truncate">{movie.title}</h2>
                <p className="text-sm text-gray-400">{movie.release_date}</p>

                <p className="text-sm text-gray-300 mt-2 line-clamp-3">
                  {movie.overview}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-yellow-400 font-bold">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {movie.vote_count} votes
                  </span>
                </div>

                <button
                  onClick={() => router.push(`/booking/${movie.id}`)}
                  className="mt-4 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
