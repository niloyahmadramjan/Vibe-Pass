'use client';

import React, { useState } from 'react';

export default function AddMoviesPage() {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseDate: '',
    duration: '',
    poster: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('🎬 New Movie Added:', formData);
    alert('✅ Movie added successfully!');
    // 👉 Later, make API call to save data
  };

  return (
    <div className="pt-15 md:pt-15 lg:pt-15 min-h-screen p-4 md:p-6 bg-[var(--color-bg-dark)] text-[var(--color-text-light)]">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--color-primary)]">
        ➕ Add New Movie
      </h1>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-bg-light)] dark:bg-gray-900 shadow-xl rounded-2xl p-6 md:p-8 space-y-6 max-w-3xl mx-auto hover:shadow-2xl transition-shadow"
      >
        {/* Movie Title */}
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
            Movie Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter movie title"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl
                       focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white transition"
          />
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
            Genre
          </label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl
                       focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white transition"
          >
            <option value="">Select genre</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Sci-Fi</option>
          </select>
        </div>

        {/* Release Date + Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
              Release Date
            </label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl
                         focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
              Duration (min)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="120"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl
                         focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white transition"
            />
          </div>
        </div>

        {/* Poster URL */}
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
            Poster URL
          </label>
          <input
            type="url"
            name="poster"
            value={formData.poster}
            onChange={handleChange}
            placeholder="https://example.com/poster.jpg"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl
                       focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Write a short description about the movie..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl
                       focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full md:w-auto py-2 px-6 rounded-xl text-lg font-semibold hover:scale-105 transition-transform"
        >
          Add Movie
        </button>
      </form>
    </div>
  );
}
