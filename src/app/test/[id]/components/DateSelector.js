'use client';

import React from 'react';
import { Calendar } from './Icons';

export default function DateSelector({ dateOptions, selectedDate, setSelectedDate }) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">
        <Calendar className="w-5 h-5" /> Select Date
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {dateOptions.map((date) => (
          <button
            key={date.value}
            onClick={() => setSelectedDate(date.value)}
            className={`p-3 rounded-lg text-center transition-all ${
              selectedDate === date.value
                ? 'bg-red-600 border-red-500'
                : 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50'
            } border-2`}
          >
            <div className="font-semibold">{date.label.split(' ')[0]}</div>
            <div className="text-sm">{date.label.split(' ').slice(1).join(' ')}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
