'use client';

import React from 'react';
import { Clock } from './Icons';

export default function Showtimes({ showtimes, selectedTime, setSelectedTime, toast }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">
        <Clock className="w-5 h-5" /> Showtimes
      </h3>

      <div className="space-y-3">
        {showtimes.map((show) => (
          <button
            key={show.id}
            onClick={() => {
              if (selectedTime?.id === show.id) {
                setSelectedTime(null);
                toast.info(`Deselected ${show.time} showtime`);
              } else {
                setSelectedTime(show);
                toast.success(`Selected ${show.time} showtime`);
              }
            }}
            className={`w-full p-4 rounded-xl transition-all duration-300 border-2 ${
              selectedTime?.id === show.id
                ? 'bg-red-600 border-red-500 shadow-lg'
                : 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="text-left">
                <div className="font-bold text-lg">{show.time}</div>
                <div className="text-sm text-gray-300">৳{show.price}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-300">{show.available} seats</div>
                <div className="text-xs text-gray-400">available</div>
              </div>
            </div>gi
          </button>
        ))}
      </div>
    </div>
  );
}
