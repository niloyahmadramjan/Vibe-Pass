"use client";
import { useState, useEffect } from "react";
import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiFilm, FiCalendar, FiClock, FiDollarSign, FiMapPin, FiGlobe, FiLayers } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AddShowtimeModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        movieId: "",
        date: "",
        time: "",
        price: "",
        hall: "",
        language: "English",
        format: "2D",
        totalSeats: 100,
        availableSeats: 100
    });

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [movieLoading, setMovieLoading] = useState(true);

    // Fetch movies for dropdown
    useEffect(() => {
        if (isOpen) {
            fetchMovies();
        }
    }, [isOpen]);

    const fetchMovies = async () => {
        try {
            setMovieLoading(true);
            const res = await axiosSecure.get("/api/movies"); // Adjust API endpoint as needed
            setMovies(res.data);
        } catch (error) {
            toast.error("Failed to load movies");
        } finally {
            setMovieLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'totalSeats' || name === 'availableSeats'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.movieId || !formData.date || !formData.time || !formData.price || !formData.hall) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (formData.price <= 0) {
            toast.error("Price must be greater than 0");
            return;
        }

        if (formData.totalSeats <= 0) {
            toast.error("Total seats must be greater than 0");
            return;
        }

        if (formData.availableSeats > formData.totalSeats) {
            toast.error("Available seats cannot exceed total seats");
            return;
        }

        setLoading(true);
        try {
            await axiosSecure.post("/api/showtimes/add", formData);
            toast.success("Showtime added successfully!");
            onSuccess();
            handleClose();
        } catch (error) {
            console.error("Add showtime error:", error);
            toast.error(error.response?.data?.message || "Failed to add showtime");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            movieId: "",
            date: "",
            time: "",
            price: "",
            hall: "",
            language: "English",
            format: "2D",
            totalSeats: 100,
            availableSeats: 100
        });
        onClose();
    };

    // Get today's date in YYYY-MM-DD format for min date
    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-gradient-to-br from-[#1a1c2b] to-[#151724] rounded-2xl border border-gray-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Add New Showtime</h2>
                                <p className="text-gray-400 mt-1">Create a new movie screening schedule</p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-800 rounded-xl transition-colors duration-200"
                            >
                                <FiX size={24} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Movie Selection */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                                        <FiFilm className="mr-2 text-purple-400" />
                                        Select Movie *
                                    </label>
                                    <select
                                        name="movieId"
                                        value={formData.movieId}
                                        onChange={handleChange}
                                        required
                                        disabled={movieLoading}
                                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="">Choose a movie</option>
                                        {movies.map((movie) => (
                                            <option key={movie._id} value={movie._id}>
                                                {movie.title} ({movie.release_year || new Date(movie.release_date).getFullYear()})
                                            </option>
                                        ))}
                                    </select>
                                    {movieLoading && (
                                        <p className="text-gray-500 text-sm mt-1">Loading movies...</p>
                                    )}
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                                        <FiCalendar className="mr-2 text-blue-400" />
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        min={getTodayDate()}
                                        required
                                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                                        <FiClock className="mr-2 text-green-400" />
                                        Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Hall */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                                        <FiMapPin className="mr-2 text-yellow-400" />
                                        Hall *
                                    </label>
                                    <input
                                        type="text"
                                        name="hall"
                                        placeholder="e.g., Hall A, IMAX, VIP"
                                        value={formData.hall}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                                        <FiDollarSign className="mr-2 text-emerald-400" />
                                        Price ($) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Language */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                                        <FiGlobe className="mr-2 text-cyan-400" />
                                        Language
                                    </label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    >
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Format */}
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
                                        <FiLayers className="mr-2 text-orange-400" />
                                        Format
                                    </label>
                                    <select
                                        name="format"
                                        value={formData.format}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="2D">2D</option>
                                        <option value="3D">3D</option>
                                        <option value="IMAX">IMAX</option>
                                        <option value="4DX">4DX</option>
                                    </select>
                                </div>

                                {/* Total Seats */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Total Seats
                                    </label>
                                    <input
                                        type="number"
                                        name="totalSeats"
                                        min="1"
                                        value={formData.totalSeats}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Available Seats */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Available Seats
                                    </label>
                                    <input
                                        type="number"
                                        name="availableSeats"
                                        min="0"
                                        max={formData.totalSeats}
                                        value={formData.availableSeats}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed rounded-xl text-white transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all duration-200 shadow-lg shadow-purple-600/25"
                                >
                                    {loading ? "Adding..." : "Add Showtime"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}