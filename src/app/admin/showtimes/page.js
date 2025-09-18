'use client';

import React from 'react';

export default function ShowTimesPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 pt-15 md:pt-15 lg:pt-15">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)] mb-4 sm:mb-6 md:mb-8">
        🎬 Showtimes
      </h1>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-[var(--color-bg-dark)] shadow rounded-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <th className="py-2 px-2 sm:px-4 text-left text-xs sm:text-sm md:text-base lg:text-base">Movie</th>
              <th className="py-2 px-2 sm:px-4 text-left text-xs sm:text-sm md:text-base lg:text-base">Date</th>
              <th className="py-2 px-2 sm:px-4 text-left text-xs sm:text-sm md:text-base lg:text-base">Time</th>
              <th className="py-2 px-2 sm:px-4 text-left text-xs sm:text-sm md:text-base lg:text-base">Hall</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">Avatar 2</td>
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">2025-09-20</td>
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">18:30</td>
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">Hall 1</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">Interstellar</td>
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">2025-09-20</td>
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">21:00</td>
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">Hall 2</td>
            </tr>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">Inception</td>
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">2025-09-21</td>
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">19:00</td>
              <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm md:text-base lg:text-base">Hall 3</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
