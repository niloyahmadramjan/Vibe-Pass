'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import LoadingSpinner from '../hooks/LoadingSpiner'
import BookingLocationModal from '../components/BookingLocationModal'
import axiosSecure from '../api/axiosHook/useAxiosSecure'

export default function MoviesPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [allMovies, setAllMovies] = useState([])
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectionMode, setSelectionMode] = useState('auto')
  const [selectedCinema, setSelectedCinema] = useState(null)

  const IMG_URL = 'https://image.tmdb.org/t/p/w500'

  // Load all movies on component mount
  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true)
        const res = await axiosSecure.get(`/api/movies`)

        const allMoviesData = res.data || []
        setAllMovies(allMoviesData)

        const totalMovies = allMoviesData.length
        const calculatedTotalPages = Math.ceil(totalMovies / 12)
        setTotalPages(calculatedTotalPages)

      } catch (error) {
        console.error("Failed to fetch movies", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllMovies()
  }, [])

  // Update movies when page changes
  useEffect(() => {
    if (allMovies.length > 0) {
      const startIndex = (page - 1) * 12
      const endIndex = startIndex + 12
      const currentPageMovies = allMovies.slice(startIndex, endIndex)
      setMovies(currentPageMovies)
    }
  }, [page, allMovies])

  // Update visible page numbers when page changes
  useEffect(() => {
    const updateVisiblePages = () => {
      const maxVisiblePages = 5 // Show only 5 page numbers at a time
      let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
      let endPage = startPage + maxVisiblePages - 1

      // Adjust if we're near the end
      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }

      const pages = []
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      setVisiblePageNumbers(pages)
    }

    updateVisiblePages()
  }, [page, totalPages])

  const handleBookNow = (movie) => {
    setSelectedMovie(movie)
    setSelectedCinema(null)
    setSelectionMode('auto')
    setIsModalOpen(true)
  }

  const handleNextPages = () => {
    const currentLastPage = visiblePageNumbers[visiblePageNumbers.length - 1]
    if (currentLastPage < totalPages) {
      setPage(currentLastPage + 1)
    }
  }

  const handlePrevPages = () => {
    const currentFirstPage = visiblePageNumbers[0]
    if (currentFirstPage > 1) {
      setPage(currentFirstPage - 1)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen text-white px-4 md:px-6 py-10 pt-25 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-10 text-red-500 text-center">
        Popular Movies
      </h1>

      {movies.length === 0 ? (
        <p className="text-center text-gray-400">No movies found!</p>
      ) : (
        <>
          {/* Movie Grid - Show 12 movies per page */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <div
                key={movie.tmdb_id}
                className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-105 transform transition duration-300 flex flex-col"
              >
                {/* Poster Image */}
                <div className="relative w-full h-[350px]">
                  <Image
                    src={
                      typeof movie.poster_path === "string" && movie.poster_path.startsWith("http")
                        ? movie.poster_path // full URL (like i.ibb.co)
                        : IMG_URL + movie.poster_path // TMDB partial path
                    }
                    alt={movie.title || "Movie Poster"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={movies.indexOf(movie) < 4}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                </div>

                {/* Movie Details */}
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-lg font-bold truncate">{movie.title}</h2>
                  <p className="text-sm text-gray-400">{movie.release_date}</p>
                  <p className="text-sm text-gray-300 mt-2 line-clamp-3">
                    {movie.overview}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-yellow-400 font-bold">
                      ⭐ {movie.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {movie.vote_count} votes
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookNow(movie)}
                    className="mt-4 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - Show limited page numbers */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 my-12 flex-wrap">
              {/* Previous Pages Button */}
              <button
                onClick={handlePrevPages}
                disabled={visiblePageNumbers[0] === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition ${visiblePageNumbers[0] === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
              >
                &larr; Prev
              </button>

              {/* Show first page if not in current visible pages */}
              {visiblePageNumbers[0] > 1 && (
                <>
                  <button
                    onClick={() => setPage(1)}
                    className="px-4 py-2 rounded-lg font-semibold transition bg-gray-800 hover:bg-gray-700 text-gray-300"
                  >
                    1
                  </button>
                  {visiblePageNumbers[0] > 2 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                </>
              )}

              {/* Visible Page Numbers */}
              {visiblePageNumbers.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${pageNum === page
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Show last page if not in current visible pages */}
              {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages && (
                <>
                  {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages - 1 && (
                    <span className="px-2 text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => setPage(totalPages)}
                    className="px-4 py-2 rounded-lg font-semibold transition bg-gray-800 hover:bg-gray-700 text-gray-300"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              {/* Next Pages Button */}
              <button
                onClick={handleNextPages}
                disabled={visiblePageNumbers[visiblePageNumbers.length - 1] === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition ${visiblePageNumbers[visiblePageNumbers.length - 1] === totalPages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
              >
                Next &rarr;
              </button>
            </div>
          )}

          {/* Page Info */}
          <div className="text-center text-gray-400 text-sm mb-8">
            Showing {Math.min(12, movies.length)} movies on page {page} of {totalPages}
          </div>
        </>
      )}

      {/* Booking Modal */}
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