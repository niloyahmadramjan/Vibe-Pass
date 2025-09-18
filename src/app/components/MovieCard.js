"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function MovieCard() {
  const [moviesData, setMoviesData] = useState({ nowShowing: [], trending: [] });
  const [activeTab, setActiveTab] = useState("nowShowing");
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("/api/movies");
        const data = await res.json();
        setMoviesData({
          nowShowing: data.nowShowing || [],
          trending: data.trending || [],
        });
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  const movies = moviesData[activeTab] || [];
  const visibleMovies = movies.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (startIndex + itemsPerPage < movies.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="bg-black">
      {/* Tab Buttons */}
      <div className="flex flex-wrap justify-center lg:ml-15 lg:p-5 sm:justify-start gap-4 sm:gap-6 mb-6">
        {["nowShowing", "trending"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setStartIndex(0);
            }}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base font-semibold transition-colors duration-300 
              ${activeTab === tab
                ? "bg-red-600 text-white"
                : "bg-zinc-800 text-gray-300 hover:bg-red-500 hover:text-white"}`}
          >
            {tab === "nowShowing" ? "Now Showing" : "Trending"}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 justify-items-between">
          {visibleMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative w-[150px] sm:w-[180px] md:w-[200px] lg:w-[220px] 
                         h-[280px] sm:h-[340px] md:h-[400px] lg:h-[427px] 
                         flex-shrink-0 border rounded-md overflow-hidden 
                         bg-zinc-900 text-white transition-all duration-300 cursor-pointer
                         border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] group"
            >
              <div className="relative">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={220}
                  height={311}
                  className="object-cover w-full h-[70%] sm:h-[75%]"
                />
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 transition duration-300"></div>
                <button
                  onClick={() => alert(`Booking ticket for ${movie.title}`)}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 sm:px-4 sm:py-2 
                             bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-lg
                             opacity-0 group-hover:opacity-100 
                             transition duration-300 hover:bg-red-700"
                >
                  Book Now
                </button>
              </div>
              <div className="p-2 text-center">
                <p className="text-sm sm:text-base md:text-lg font-semibold truncate">
                  {movie.title}
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
                       opacity-60 hover:opacity-100 transition hover:bg-red-500"
          >
            ◀
          </button>
        )}
        {startIndex + itemsPerPage < movies.length && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 
                       w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 text-white 
                       flex items-center justify-center 
                       opacity-60 hover:opacity-100 transition hover:bg-red-500"
          >
            ▶
          </button>
        )}
      </div>
    </div>
  );
}
