'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import LoadingSpinner from '../hooks/LoadingSpiner'

export default function UpcomingMoviesPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [showTrailer, setShowTrailer] = useState(false)
  const [trailerUrl, setTrailerUrl] = useState('')

  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true)
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${page}`
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

  // ✅ Fetch Trailer URL from TMDB
  async function handleWatchTrailer(movieId) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      )
      const data = await res.json()
      const trailer = data.results.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      )
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`)
        setShowTrailer(true)
      } else {
        alert('Trailer not available!')
      }
    } catch (error) {
      console.error('Failed to fetch trailer', error)
    }
  }

  if (loading) return <LoadingSpinner/>

  return (
    <div className="min-h-screen text-white pt-20">
      {/*Section Title */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-2xl md:text-3xl font-bold py-8 mb-8 text-red-500">
         Upcoming Movies
        </h2>

        {/* Movie Cards (4 per row on large screens) */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative bg-gray-900 rounded-xl overflow-hidden group shadow-lg hover:scale-[1.03] hover:shadow-2xl transform transition duration-300"
            >
              <div className="relative w-full h-[280px]">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`    
                      : '/placeholder.jpg'
                  }
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-red-600 px-2 py-1 rounded-md text-sm font-bold shadow-md">
                 {movie.vote_average.toFixed(1)}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{movie.release_date}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/movies/${movie.id}`)}
                    className="mt-auto flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-md transition"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleWatchTrailer(movie.id)}
                    className="mt-auto flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg shadow-md transition"
                  >
                    ▶ Trailer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/*  Pagination */}
        <div className="flex justify-center items-center gap-2 my-12 flex-wrap">
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

      {/* 🎥 Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-3xl p-4 bg-black rounded-xl">
            <button
              onClick={() => setShowTrailer(false)}
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
    </div>
  )
}
