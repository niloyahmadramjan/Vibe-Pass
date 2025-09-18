'use client'
import Image from 'next/image';
import { useEffect, useState } from 'react'

export default function MoviesPage() {
  const [movies, setMovies] = useState([])
  const api = '66fbde5079d3e3e3fe62430f8a619178';

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${api}&language=en-US&page=1`
      )
      const data = await res.json()
      setMovies(data.results)
    }
    fetchMovies()
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10 pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        🎬 Popular Movies
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transform transition duration-300"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750} // typical poster ratio
              className="object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{movie.release_date}</p>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
