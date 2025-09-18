'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function AddShowtimesPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [formData, setFormData] = useState({ price: '', date: '', time: '', hall: '' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage =
    typeof window !== 'undefined'
      ? window.innerWidth < 640
        ? 2
        : window.innerWidth < 768
        ? 4
        : 8
      : 8;

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          'https://gist.githubusercontent.com/saniyusuf/406b843afdfb9c6a86e25753fe2761f4/raw/523c324c7fcc36efab8224f9ebb7556c09b69a14/Film.JSON'
        );
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Pagination logic
  const indexOfLast = currentPage * moviesPerPage;
  const indexOfFirst = indexOfLast - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  // Input handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add showtime
  const addShowtime = (e) => {
    e.preventDefault();
    if (!selectedMovie || !formData.date || !formData.time || !formData.price || !formData.hall) {
      toast.error('Please fill out all fields!');
      return;
    }
    const newShowtime = { ...formData, movie: selectedMovie };
    setShowtimes([...showtimes, newShowtime]);
    setFormData({ price: '', date: '', time: '', hall: '' });

    // ✅ Show hot toast
    toast.success('Showtime added successfully!');
  };

  // Remove showtime
  const removeShowtime = (index) => {
    setShowtimes(showtimes.filter((_, i) => i !== index));
    toast('Showtime removed.', { icon: '🗑️' });
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[var(--color-bg-dark)] text-[var(--color-text-light)]">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-primary)] mb-6 md:mb-8 text-center">
          🎬 Add New Showtimes
        </h1>

        {/* --- Movie Selection Section --- */}
        <div className="bg-[#1E1E1E] p-4 sm:p-6 md:p-8 rounded-3xl shadow-lg border border-gray-700 mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-light)] mb-4">
            Select Movie
          </h2>
          {loading && <p className="text-center text-gray-400">Loading movies...</p>}
          {error && <p className="text-center text-red-500">Failed to load data. Please try again.</p>}
          {!loading && !error && (
            <>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {currentMovies.map((movie, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedMovie(movie)}
                    className={`w-28 sm:w-32 md:w-40 cursor-pointer rounded-2xl shadow-lg transition-all duration-300 transform
                      ${selectedMovie?.Title === movie.Title ? 'ring-4 ring-[var(--color-primary)] scale-105' : 'hover:scale-105'}
                      bg-[#2A2A2A]`}
                  >
                    <Image
                        width={160}
                        height={240}
                      src={movie.Images[0]}
                      alt={movie.Title}
                      className="rounded-t-2xl w-full h-36 sm:h-44 md:h-48 object-cover"
                    />
                    <div className="p-2 sm:p-3 text-center">
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-[var(--color-text-light)] mb-1">
                        {movie.Title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-400">{movie.Genre}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-3 py-1 rounded-lg bg-gray-700 text-white disabled:opacity-40"
                  >
                    ⟨
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-3 py-1 rounded-lg bg-gray-700 text-white disabled:opacity-40"
                  >
                    ⟩
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* --- Showtime Form Section --- */}
        <div className="bg-[#1E1E1E] p-4 sm:p-6 md:p-8 rounded-3xl shadow-lg border border-gray-700 mb-6 md:mb-8 max-w-2xl mx-auto">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-light)] mb-4 sm:mb-6">
            Showtime Details
          </h2>
          <form onSubmit={addShowtime} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <input
                type="text"
                name="hall"
                value={formData.hall}
                onChange={handleChange}
                placeholder="e.g., Hall 1"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-xl bg-transparent text-[var(--color-text-light)]"
                required
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 12.5"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-xl bg-transparent text-[var(--color-text-light)]"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-xl bg-transparent text-[var(--color-text-light)]"
                required
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-xl bg-transparent text-[var(--color-text-light)]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 sm:py-3 px-4 sm:px-6 rounded-2xl text-base sm:text-lg font-bold bg-[var(--color-primary)] text-white"
            >
              Add Showtime
            </button>
          </form>
        </div>

        {/* --- Added Showtimes --- */}
        {showtimes.length > 0 && (
          <div className="bg-[#1E1E1E] p-4 sm:p-6 md:p-8 rounded-3xl shadow-lg border border-gray-700 max-w-2xl mx-auto">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-light)] mb-4 sm:mb-6">
              🎟️ Added Showtimes
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {showtimes.map((show, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between
                    bg-[#2A2A2A] text-[var(--color-text-light)] p-3 sm:p-4 rounded-xl"
                >
                  <div>
                    <h3 className="font-semibold text-[var(--color-primary)] text-base sm:text-lg">
                      {show.movie.Title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Hall: {show.hall} | Price: ${show.price}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Date: {show.date} | Time: {show.time}
                    </p>
                  </div>
                  <button
                    onClick={() => removeShowtime(idx)}
                    className="mt-2 sm:mt-0 text-red-400 border border-red-400 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
