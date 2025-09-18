"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import LoadingSpinner from "@/app/hooks/LoadingSpiner";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
// 📍 Map Locations in Bangladesh
const mapLocations = {
    dhaka: {
        coords: [23.8103, 90.4125],
        label: "Dhaka, Bangladesh",
        img: "https://media.istockphoto.com/id/1387289497/photo/the-crowded-street-in-old-dhaka-bangladesh.jpg?s=2048x2048&w=is&k=20&c=-zoUYi0Y3oh6aiyBqCQr57wnQOq_ombZ-TnfSpGgHjs=", // replace with your image
    },
    chattogram: {
        coords: [22.3419, 91.8155],
        label: "Chattogram, Bangladesh",
        img: "https://media.istockphoto.com/id/666047648/photo/city-life-main-bazar-by-night-paharganj-new-delhi-india.jpg?s=2048x2048&w=is&k=20&c=qj5Pf-ZslUXZiVaCMtzPRqc330wVfFO1Y-lKzNd8Msg=",
    },
    khulna: {
        coords: [22.8184, 89.5682],
        label: "Khulna, Bangladesh",
        img: "/khulna.png",
    },
    gazipur: {
        coords: [23.9999, 90.4203],
        label: "Gazipur, Bangladesh",
        img: "/gazipur.png",
    },
    uttara: {
        coords: [23.8763, 90.3796],
        label: "Uttara, Dhaka, Bangladesh",
        img: "/uttara.png",
    },
};

export default function MovieDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id, 10); // Get movie ID from URL

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);

    const api = '66fbde5079d3e3e3fe62430f8a619178';

    const [selectedPlace, setSelectedPlace] = useState("Dhaka, Bangladesh");

    const mapRef = useRef(null);


    // book handelBookTicket.............................................
    const handelBookTicket = () => {
        alert("router.push() add booking Ticket page ")
        // router.push("add booking Ticket page");
    }

  
    // 🎬 Load Movie
     useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${api}&language=en-US&page=1`
         
        );
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchMovie();
  }, [id]);
    
    // 🗺️ Init Leaflet Map
    useEffect(() => {
        // Only run on client
        if (typeof window === "undefined") return;

        // Dynamically import Leaflet
        import("leaflet").then((leaflet) => {
            const L = leaflet;

            const mapElement = document.getElementById("map");
            if (!mapElement) return;

            // Remove previous map if exists
            if (mapRef.current) {
                mapRef.current.remove();
            }

            const { coords, label, img } = mapLocations[selectedPlace];

            const map = L.map(mapElement).setView(coords, 12);
            mapRef.current = map;

            // Add tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            // Custom icon
            const customIcon = L.icon({
                iconUrl: img,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
            });

            // Add marker with custom icon
            L.marker(coords, { icon: customIcon }).addTo(map).bindPopup(label);
        });
    }, [selectedPlace, mapLocations]); // added mapLocations for safety





    if (loading) return <LoadingSpinner />;
    if (!movie)
        return (
            <div className="p-6 text-center text-red-500">❌ Movie not found!</div>
        );

    return (
        <div className="p-6  mx-auto space-y-10 mt- bg-[#1A1A1A] text-white">
            {/* 🎬 Banner */}
            <div
                className="relative w-full h-96 rounded-xl mt-15 overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => setShowTrailer(true)} // click anywhere opens trailer
            >
                {/* Back Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // prevent triggering trailer modal
                        router.push("/movies");
                    }}
                    className="absolute top-4 left-4 z-10 px-4 py-2 bg-gray-700/80 text-white rounded-lg shadow hover:bg-[#E53935] hover:scale-110 transition-transform duration-300"
                >
                    ⬅ Back
                </button>

                {/* Movie Poster */}
                <motion.div
                    className="w-full h-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover"
                    />
                </motion.div>

                {/* Overlay Info – Always Visible */}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-red-500 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-text">
                        {movie.title}
                    </h1>
                    <p className="mt-1 text-gray-200 text-sm md:text-base">
                        {movie.release_date} | ⭐ {movie.vote_average} ({movie.vote_count} votes)
                    </p>
                </div>

                {/* Play Icon */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    whileHover={{ scale: 1.2 }}
                >
                    <svg
                        className="w-16 h-16 text-white opacity-70"
                        fill="currentColor"
                        viewBox="0 0 84 84"
                    >
                        <circle cx="42" cy="42" r="42" fill="currentColor" opacity="0.5" />
                        <polygon points="32,26 32,58 58,42" fill="white" />
                    </svg>
                </motion.div>
            </div>


            {/* 🎥 Actions */}
            <div className="flex flex-wrap gap-4 my-10">
                {/* Book Tickets Button */}
                <button onClick={handelBookTicket} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-orange-500 transition-colors">
                    🎟 Book Tickets
                </button>

                {/* Watch Trailer Button */}
                <button
                    onClick={() => setShowTrailer(true)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-pink-500 transition-colors"
                >
                    ▶ Watch Trailer
                </button>
            </div>

            {/* 🎬 Trailer Modal */}
            {showTrailer && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="relative bg-black rounded-xl p-4 max-w-3xl w-full shadow-lg">
                        {/* Close button */}
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                        >
                            ✖ Close
                        </button>

                        {/* Video iframe */}
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe
                                src={movie.trailerUrl}
                                title={`${movie.title} Trailer`}
                                width="100%"
                                height="500"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}


            {/* 📖 Overview */}
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Overview</h2>
            <p className="text-gray-400 text-2xl mb-8 leading-relaxed">{movie.overview}</p>

            {/* 🏷️ Movie Info */}
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Movie Info</h2>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-3">
                {[
                    { label: "Original Language", value: movie.original_language },
                    { label: "Release Date", value: movie.release_date },
                    { label: "Duration", value: movie.duration },
                    { label: "Genres", value: movie.genre?.join(", ") },
                    { label: "Popularity", value: movie.popularity },
                    { label: "Average Rating", value: `⭐ ${movie.vote_average} (${movie.vote_count} votes)` },
                ].map((item, index) => (
                    <p
                        key={index}
                        className="text-gray-200 hover:text-[#E53935] transition-colors duration-300 cursor-pointer"
                    >
                        <strong>{item.label}:</strong> {item.value}
                    </p>
                ))}
            </div>


            {/*  Location Buttons */}
            <h2 className="text-2xl font-bold mb-4 text-green-400">Select Location</h2>
            <div className="flex gap-3 flex-wrap mb-6">
                {Object.keys(mapLocations).map((key) => (
                    <button
                        key={key}
                        onClick={() => setSelectedPlace(key)}
                        className={`px-4 py-2 rounded-lg ${selectedPlace === key
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-200"
                            }`}
                    >
                        {mapLocations[key].label}
                    </button>
                ))}
            </div>

            {/* Map */}
            <div
                id="map"
                className="w-full md:w-3/4 lg:w-1/2 h-96 rounded-xl overflow-hidden shadow-lg mx-auto"
            />
        </div>
    );
}
