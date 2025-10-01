'use client';

import React from 'react';
import { toast } from './Toast';

export default function BookingModal({
  movieData,
  selectedDate,
  selectedTime,
  selectedSeats,
  totalPrice,
  onClose,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 bg-black/80 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md w-full shadow-2xl">
        <h3 className="text-3xl font-bold mb-4 text-center text-red-500">
          Confirm Booking
        </h3>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Movie:</span>
            <span className="font-bold text-lg text-white">{movieData.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Date:</span>
            <span className="font-bold text-lg text-white">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Time:</span>
            <span className="font-bold text-lg text-white">{selectedTime?.time}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Seats:</span>
            <span className="font-bold text-lg text-white">{selectedSeats.join(', ')}</span>
          </div>
          <div className="flex justify-between text-2xl items-center mt-4 pt-4 border-t border-gray-700">
            <span className="font-semibold text-red-500">Total:</span>
            <span className="font-bold text-green-400">৳{totalPrice}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              onClose();
              toast.error('Booking cancelled');
            }}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors font-semibold text-white"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-3 btn-primary font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
