"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function UpcomingMovie() {
  const [upcoming, setUpcoming] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 6;

  // Fetch upcoming movies from API
  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await fetch("/api/movies");
        const data = await res.json();
        setUpcoming(data.upcoming || []);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
      }
    };
    fetchUpcoming();
  }, []);

  const visibleMovies = upcoming.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (startIndex + itemsPerPage < upcoming.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="bg-black p-4 sm:p-6 md:p-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-red-500 mb-6 text-left px-4 sm:px-0 lg:ml-15 lg:p-5">
        Coming Soon To Theaters 🎬
      </h2>

      <div className="relative">
        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center max-w-[95%] mx-auto">
          {visibleMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative w-[150px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px]
                         flex-shrink-0 border rounded-lg overflow-hidden 
                         bg-zinc-900 text-white transition-all duration-300 cursor-pointer
                         border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] group"
            >
              <div className="relative w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] xl:h-[460px]">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={240}
                  height={360}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 transition duration-300"></div>
              </div>

              {/* Title + Release Date */}
              <div className="p-3 text-center">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-bold truncate">
                  {movie.title}
                </p>
                <p className="text-xs sm:text-sm md:text-base text-gray-400 mt-2">
                  Release:{" "}
                  <span className="text-red-400 font-semibold">
                    {movie.release_date || "TBA"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {startIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 
                       w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 text-white 
                       flex items-center justify-center 
                       opacity-60 hover:opacity-100 transition hover:bg-red-500 z-10"
          >
            ◀
          </button>
        )}
        {startIndex + itemsPerPage < upcoming.length && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 
                       w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 text-white 
                       flex items-center justify-center 
                       opacity-60 hover:opacity-100 transition hover:bg-red-500 z-10"
          >
            ▶
          </button>
        )}
      </div>
    </div>
  );
}
