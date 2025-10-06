'use client';

import React from 'react';
import { Clock } from './Icons';

export default function SuccessModal({
  bookingData,
  paymentTimer,
  formatTime,
  onPayNow,
  onPayLater,
}) {
  if (!bookingData) return null;

  return (
    <div className="fixed inset-0 bg-black/80 modal-backdrop flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-green-500 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-300">
            Your seats have been reserved successfully
          </p>
        </div>

        <div className="space-y-3 mb-6 p-4 bg-gray-700/50 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-400">Booking ID:</span>
            <span className="font-mono text-white">
              {bookingData._id?.slice(-8)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Movie:</span>
            <span className="text-white">{bookingData.movieTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Date & Time:</span>
            <span className="text-white">
              {new Date(bookingData.showDate).toLocaleDateString()}{' '}
              {bookingData.showTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Seats:</span>
            <span className="text-white">
              {bookingData.selectedSeats.join(', ')}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-600">
            <span className="text-red-500">Total:</span>
            <span className="text-green-400">৳{bookingData.totalAmount}</span>
          </div>
        </div>

        <div className="mb-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
          <div className="flex items-center justify-center gap-2 text-yellow-400 font-semibold">
            <Clock className="w-4 h-4" />
            Complete payment within: {formatTime(paymentTimer)}
          </div>
          <p className="text-yellow-300 text-sm text-center mt-1">
            Seats will be released if payment is not completed
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPayLater}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors font-semibold text-white"
          >
            Pay Later
          </button>

          <button
            onClick={onPayNow}
            className="flex-1 py-3 btn-primary font-semibold"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
