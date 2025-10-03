'use client';

import React from 'react';

export default function SeatSections({ seatSections, selectedSeats, reservedSeats, hoveredSeat, setHoveredSeat, handleSeatClick, getSeatSection }) {
  return (
    <div className="space-y-4 md:space-y-6">
      {seatSections.map((section) => (
        <div key={section.id} className="text-center">
          <h4 className={`text-lg font-bold mb-4 bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
            {section.name} - ৳{section.price}
          </h4>

          <div className="space-y-2">
            {section.rows.map((row) => (
              <div key={row.row} className="flex justify-center items-center gap-2">
                <span className="text-gray-400 font-bold w-6 text-right mr-2">{row.row}</span>

                <div className="flex gap-1 flex-wrap justify-center">
                  {row.seats.map((seat) => {
                    const isSelected = selectedSeats.includes(seat);
                    const isReserved = reservedSeats.includes(seat);
                    const isHovered = hoveredSeat === seat;
                    const seatSection = getSeatSection(seat);

                    return (
                      <button
                        key={seat}
                        onClick={() => handleSeatClick(seat)}
                        onMouseEnter={() => setHoveredSeat(seat)}
                        onMouseLeave={() => setHoveredSeat(null)}
                        disabled={isReserved}
                        className={`relative w-8 h-8 md:w-10 md:h-10 rounded-lg font-bold text-xs seat-btn border-2
                          ${
                            isReserved
                              ? 'bg-red-800 border-red-700 cursor-not-allowed text-red-300'
                              : isSelected
                              ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/30 scale-110'
                              : isHovered
                              ? `bg-gradient-to-r ${seatSection.color} border-white/50 text-white scale-105 shadow-lg`
                              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                          }`}
                      >
                        {seat.slice(1)}

                        {isHovered && !isReserved && seatSection && (
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 border border-gray-700 shadow-md">
                            {seatSection.name} - ৳{seatSection.price}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <span className="text-gray-400 font-bold w-6 text-left ml-2">{row.row}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
