"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import LoadingSpinner from "@/app/hooks/LoadingSpiner";
import "leaflet/dist/leaflet.css";

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
    const id = parseInt(params.id, 10);

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState("dhaka");

    const mapRef = useRef(null);

    // 🎥 Sample Movies
    const moviesData = [
        {
            id: 1,
            title: "War of the Worlds",
            language: "English",
            genre: ["Sci-Fi", "Thriller"],
            duration: "1h 56m",
            overview:
                "As alien machines rise from beneath the ground, humanity faces its greatest challenge: survival against an overwhelming extraterrestrial force.",
            release_date: "2005-06-29",
            poster:
                "https://i.ibb.co/XfvkDKMG/the-conjuring-last-rites-movie-poster.webp",
            backdrop:
                "https://image.tmdb.org/t/p/original/iZLqwEwUViJdSkGVjePGhxYzbDb.jpg",
            vote_average: 6.7,
            vote_count: 6200,
            popularity: 554.7,
            trailerUrl: "https://www.youtube.com/embed/SMXd8r3mLDQ",
        },
        {
            id: 2,
            title: "Avengers: Infinity War",
            language: "English",
            genre: ["Action", "Adventure", "Fantasy"],
            duration: "2h 29m",
            overview:
                "The Avengers and their allies must sacrifice everything in a final stand to defeat the powerful Thanos before his devastating snap ends half the universe.",
            release_date: "2018-04-27",
            poster: "https://i.ibb.co/rXxPBBs/A4223810-1.jpg",
            backdrop:
                "https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg",
            vote_average: 8.5,
            vote_count: 26000,
            popularity: 980.1,
            trailerUrl: "https://www.youtube.com/embed/6ZfuNTqbHE8",
        },
        {
            id: 3,
            title: "Avengers: Endgame",
            language: "English",
            genre: ["Action", "Adventure", "Sci-Fi"],
            duration: "3h 1m",
            overview:
                "The remaining Avengers assemble once more to reverse the chaos caused by Thanos and restore balance to the universe.",
            release_date: "2019-04-26",
            poster:
                "https://i.ibb.co/XfvkDKMG/the-conjuring-last-rites-movie-poster.webp",
            backdrop:
                "https://image.tmdb.org/t/p/original/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
            vote_average: 8.8,
            vote_count: 34000,
            popularity: 1200.4,
            trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c",
        },
    ];

    // 🎬 Load Movie
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const found = moviesData.find((m) => m.id === id);
            setMovie(found || null);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    // 🗺️ Init Leaflet Map
    // 🗺️ Init Leaflet Map
    useEffect(() => {
        if (typeof window === "undefined") return;

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
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            // Create custom icon with image
            const customIcon = L.icon({
                iconUrl: img,      // your image
                iconSize: [40, 40], // adjust size
                iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
                popupAnchor: [0, -40], // point from which popup opens
            });

            // Add marker with custom icon
            L.marker(coords, { icon: customIcon })
                .addTo(map)
                .bindPopup(label)
                .openPopup();
        });
    }, [selectedPlace]);



    if (loading) return <LoadingSpinner />;
    if (!movie)
        return (
            <div className="p-6 text-center text-red-500">❌ Movie not found!</div>
        );

    return (
        <div className="p-6  mx-auto space-y-10 bg-[#1A1A1A] text-white">
            {/* 🎬 Banner */}
            <div className="relative mt-15 w-full h-96 rounded-xl overflow-hidden shadow-lg">
                <button
                    onClick={() => router.push("/movies")}
                    className="absolute top-4 left-4 z-10 px-4 py-2 bg-gray-700/80 text-white rounded-lg shadow hover:bg-gray-600"
                >
                    ⬅ Back
                </button>
                <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
                    <h1 className="text-3xl md:text-5xl font-bold text-red-500">
                        {movie.title}
                    </h1>
                    <p className="mt-1 text-gray-200">
                        {movie.release_date} | ⭐ {movie.vote_average} ({movie.vote_count}{" "}
                        votes)
                    </p>
                </div>
            </div>

            {/* 🎥 Trailer */}
            {showTrailer && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="relative bg-black rounded-xl p-4 max-w-3xl w-full">
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg"
                        >
                            ✖ Close
                        </button>
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
            )}

            {/* 📖 Overview */}
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Overview</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">{movie.overview}</p>

            {/* 🏷️ Movie Info */}
            <h2 className="text-2xl font-bold mb-4 text-blue-400">Movie Info</h2>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-2">
                <p>
                    <strong>Original Language:</strong> {movie.language}
                </p>
                <p>
                    <strong>Release Date:</strong> {movie.release_date}
                </p>
                <p>
                    <strong>Duration:</strong> {movie.duration}
                </p>
                <p>
                    <strong>Genres:</strong> {movie.genre?.join(", ")}
                </p>
                <p>
                    <strong>Popularity:</strong> {movie.popularity}
                </p>
                <p>
                    <strong>Average Rating:</strong> ⭐ {movie.vote_average} (
                    {movie.vote_count} votes)
                </p>
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

            {/* Leaflet Map */}
            <h2 className="text-2xl font-bold mb-4 text-purple-400">Location Map</h2>
            <div
                id="map"
                className="w-full md:w-3/4 lg:w-1/2 h-96 rounded-xl overflow-hidden shadow-lg mx-auto"
            />
        </div>
    );
}
