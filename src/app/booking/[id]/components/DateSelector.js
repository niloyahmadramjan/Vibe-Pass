'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from './Icons';
import { toast } from '../components/Toast';

export default function DateSelector({ selectedDate, setSelectedDate }) {
  const [dateOptions, setDateOptions] = useState([]);

  useEffect(() => {
    // আজ থেকে শুরু করে পরবর্তী 7 দিন পর্যন্ত মোট 8 দিন তৈরি করবো
    const generateDateOptions = (numDays = 8) => {
      const options = [];
      const today = new Date();

      for (let i = 0; i < numDays; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);

        const label = date.toLocaleDateString('en-US', {
          weekday: 'short', // যেমন: Fri
          month: 'short',   // Sep
          day: 'numeric',   // 1
        });

        options.push({
          value: date.toISOString().split('T')[0], // "2025-10-01" ফরম্যাটে
          label,
        });
      }

      return options;
    };

    setDateOptions(generateDateOptions());
  }, []);

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">
        <Calendar className="w-5 h-5" /> Select Date
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {dateOptions.map((date) => {
          const isSelected = selectedDate === date.value;

          return (
            <button
              key={date.value}
              onClick={() => {
                if (isSelected) {
                  setSelectedDate(null); // Deselect
                  toast.error(`Deselected ${date.label}`);
                } else {
                  setSelectedDate(date.value); // Select
                  toast.success(`Selected ${date.label}`);
                }
              }}
              className={`p-3 rounded-lg text-center transition-all ${
                isSelected
                  ? 'bg-red-600 border-red-500'
                  : 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50'
              } border-2`}
            >
              <div className="font-semibold">{date.label.split(' ')[0]}</div>
              <div className="text-sm">{date.label.split(' ').slice(1).join(' ')}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
