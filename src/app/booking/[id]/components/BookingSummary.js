'use client';

import React from 'react';

export default function BookingSummary({ selectedSeats, totalPrice }) {
  if (selectedSeats.length === 0) return null;

  return (
    <div className="mt-12 p-6 bg-gray-700 rounded-2xl border border-gray-600 shadow-lg">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h4 className="font-bold text-lg mb-1 text-red-500">Selected Seats</h4>
          <p className="text-white">
            {selectedSeats.join(', ')} ({selectedSeats.length}{' '}
            {selectedSeats.length > 1 ? 'seats' : 'seat'})
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-400">৳{totalPrice}</div>
          <div className="text-sm text-gray-300">Total Amount</div>
        </div>
      </div>
    </div>
  );
}
