'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import BookingLocationModal from '../components/BookingLocationModal'
import LoadingSpinner from '../hooks/LoadingSpiner'

export default function BanglaMoviesPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔹 Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectionMode, setSelectionMode] = useState('auto')
  const [selectedCinema, setSelectedCinema] = useState(null)

  useEffect(() => {
    async function fetchBanglaMovies() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_original_language=bn&sort_by=popularity.desc`
        )
        const data = await res.json()
        setMovies(data.results || [])
      } catch (error) {
        console.error('Failed to load Bangla movies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanglaMovies()
  }, [])

  if (loading) return <LoadingSpinner />

  // 🔹 Handle Book Now
  const handleBookNow = (movie) => {
    setSelectedMovie(movie)
    setSelectedCinema(null) // reset
    setSelectionMode('auto') // default auto
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white px-6 py-10 pt-25 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-yellow-400 uppercase">
        ShowTime BD
      </h1>

      {movies.length === 0 ? (
        <p className="text-center text-gray-400">No Bangla movies found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="group bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transform transition duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative w-full h-[300px]">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : '/no-poster.png'
                  }
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:opacity-90 transition"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {movie.release_date || 'N/A'}
                </p>

                <p className="text-sm text-gray-300 mt-2 line-clamp-3 flex-grow">
                  {movie.overview || 'No description available.'}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-yellow-400 font-bold">
                    ⭐ {movie.vote_average?.toFixed(1) || '0'}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {movie.vote_count} votes
                  </span>
                </div>

                {/* 🔹 Book Now Button */}
                <button
                  onClick={() => handleBookNow(movie)}
                  className="mt-4 w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
