'use client';

import React from 'react';

export default function BookingsPage() {
  // Sample bookings data
  const bookings = [
    { id: 1, movie: 'Avatar 2', date: '2025-09-20', time: '18:30', hall: 'Hall 1', seats: 3 },
    { id: 2, movie: 'Interstellar', date: '2025-09-20', time: '21:00', hall: 'Hall 2', seats: 2 },
    { id: 3, movie: 'Inception', date: '2025-09-21', time: '19:00', hall: 'Hall 3', seats: 4 },
  ];

  // Summary metrics
  const totalBookings = bookings.length;
  const totalSeats = bookings.reduce((sum, b) => sum + b.seats, 0);

  return (
    <div className="pt-15 md:pt-15 lg:pt-15 p-4 md:p-6 bg-[var(--color-bg-dark)] min-h-screen text-[var(--color-text-light)]">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--color-primary)]">🎟 Bookings</h1>

      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 dark:bg-[var(--color-bg-dark)] shadow-lg rounded-xl p-5 flex flex-col justify-between hover:scale-105 transition-transform">
          <h2 className="text-sm text-gray-400">Total Bookings</h2>
          <p className="text-2xl font-bold text-[var(--color-primary)] mt-2">{totalBookings}</p>
        </div>
        <div className="bg-gray-800 dark:bg-[var(--color-bg-dark)] shadow-lg rounded-xl p-5 flex flex-col justify-between hover:scale-105 transition-transform">
          <h2 className="text-sm text-gray-400">Total Seats Booked</h2>
          <p className="text-2xl font-bold text-[var(--color-primary)] mt-2">{totalSeats}</p>
        </div>
      </div>

      {/* 🔹 Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 shadow rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-gray-400 uppercase text-sm">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Movie</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Hall</th>
              <th className="py-3 px-4 text-left">Seats</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
              >
                <td className="py-2 px-4">{booking.id}</td>
                <td className="py-2 px-4 font-semibold">{booking.movie}</td>
                <td className="py-2 px-4">{booking.date}</td>
                <td className="py-2 px-4">{booking.time}</td>
                <td className="py-2 px-4">{booking.hall}</td>
                <td className="py-2 px-4">{booking.seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Recent Bookings */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">Recent Bookings</h2>
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="bg-gray-800 dark:bg-[var(--color-bg-dark)] p-4 rounded-lg shadow hover:scale-105 transition-transform"
            >
              <p className="font-semibold">{booking.movie}</p>
              <p className="text-sm text-gray-400">{booking.date} • {booking.time} • {booking.hall}</p>
              <p className="text-sm text-[var(--color-primary)]">Seats: {booking.seats}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
