
"use client";

import React, { useEffect, useState } from "react";
import { FiMapPin, FiPlayCircle } from "react-icons/fi";

// Static theater list
const theaters = [
  { name: "VibePass Cinema Downtown", distance: "0.5 mi", screens: 12 },
  { name: "VibePass IMAX Center", distance: "1.2 mi", screens: 8 },
  { name: "VibePass Premium Mall", distance: "2.3 mi", screens: 15 },
];

export default function NearbyHome() {

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null; // Prevent server/client mismatch

  return (
    <div className="bg-black text-white py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center ">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎬 Nearby
            <span className="bg-gradient-to-r from-[#D32F2F] via-[#F44336] to-[#FF6B6B] bg-clip-text text-transparent">
              Movies
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Discover the closest cinemas and book your seat now
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Map Section */}
          <div className="h-72 lg:h-[500px] bg-gradient-to-br from-[#1a1a1a] to-[#330000] rounded-2xl flex flex-col items-center justify-center border border-[#E50914]/30 shadow-[0_0_20px_#E50914aa]">
            <FiMapPin className="text-[#E50914] text-5xl mb-3 animate-bounce" />
            <span className="text-gray-300 text-lg font-medium">
              Interactive Map Coming Soon
            </span>
          </div>

          {/* Theater List */}
          <div className="space-y-5">
            {theaters.map((theater, index) => (
              <div
                key={index}
                className="group flex justify-between items-center bg-gradient-to-r from-[#1a1a1a] to-[#330000] border border-[#E50914]/30 rounded-2xl p-5 hover:from-[#2a0000] hover:to-[#4d0000] transition-all duration-300 shadow-md hover:shadow-[0_0_25px_#E50914aa] cursor-pointer"
              >
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1 group-hover:text-[#E50914] transition">
                    {theater.name}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {theater.distance} · {theater.screens} screens
                  </p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#ff1e1e] text-white font-medium rounded-lg transition-all">
                  <FiPlayCircle className="text-lg" />
                  Book Here
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
