"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function UpcomingMovie() {
  const [upcoming, setUpcoming] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5; // upcoming এ একটু কম রাখলাম যাতে card গুলো বড় হয়

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
    <div className="bg-black p-8">
      <h2 className="text-3xl font-bold text-red-500 m-20 text-left ml-25">
         Coming Soon To Theaters 🎬
      </h2>

      <div className="relative">
        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-items-center max-w-11/12 mx-auto">
          {visibleMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative w-[260px] h-[480px] flex-shrink-0 border rounded-lg overflow-hidden 
                         bg-zinc-900 text-white transition-all duration-300 cursor-pointer
                         border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.7)] group"
            >
              <div className="relative">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={260}
                  height={360}
                  className="object-cover w-full h-[360px]"
                />
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-20 transition duration-300"></div>
              </div>

              {/* Title + Release Date */}
              <div className="p-3 text-center">
                <p className="text-lg font-bold">{movie.title}</p>
                <p className="text-sm text-gray-400 mt-2">
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
                       w-10 h-10 rounded-full bg-red-600 text-white 
                       flex items-center justify-center 
                       opacity-60 hover:opacity-100 transition hover:bg-red-500"
          >
            ◀
          </button>
        )}
        {startIndex + itemsPerPage < upcoming.length && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 
                       w-10 h-10 rounded-full bg-red-600 text-white 
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
