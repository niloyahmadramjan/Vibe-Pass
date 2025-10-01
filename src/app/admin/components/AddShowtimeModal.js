'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiClock, FiDollarSign, FiFilm, FiMapPin, FiMonitor } from 'react-icons/fi';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import toast from 'react-hot-toast';

export default function AddShowtimeModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        movieId: '',
        date: '',
        time: '',
        hall: '',
        price: '',
        screen: 'Screen 1'
    });
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch movies for dropdown
    useEffect(() => {
        if (isOpen) {
            fetchMovies();
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            setFormData(prev => ({ ...prev, date: today }));
        }
    }, [isOpen]);

    const fetchMovies = async () => {
        try {
            const res = await axiosSecure.get('/api/movies');
            setMovies(res.data || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
            toast.error('Failed to load movies');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.movieId || !formData.date || !formData.time || !formData.hall || !formData.price) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);

        try {
            await axiosSecure.post('/api/showtimes/add', formData);
            toast.success(' Showtime added successfully!');
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                movieId: '',
                date: new Date().toISOString().split('T')[0],
                time: '',
                hall: '',
                price: '',
                screen: 'Screen 1'
            });
        } catch (error) {
            console.error('Error adding showtime:', error);
            toast.error(error.response?.data?.message || '❌ Failed to add showtime');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            movieId: '',
            date: new Date().toISOString().split('T')[0],
            time: '',
            hall: '',
            price: '',
            screen: 'Screen 1'
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800/90 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <FiFilm className="text-purple-400" />
                                Add New Showtime
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Movie Selection */}
                            <div>
                                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                    <FiFilm />
                                    Select Movie *
                                </label>
                                <select
                                    name="movieId"
                                    value={formData.movieId}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Choose a movie...</option>
                                    {movies.map((movie) => (
                                        <option key={movie._id} value={movie._id}>
                                            {movie.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Date */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                        <FiCalendar />
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                        <FiClock />
                                        Time *
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Hall.......................................................... */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                        <FiMapPin />
                                        Hall *
                                    </label>
                                    <select
                                        name="hall"
                                        value={formData.hall}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option value="">Select Hall</option>
                                        <option value="Main Hall">Main Hall</option>
                                        <option value="IMAX Hall">IMAX Hall</option>
                                        <option value="VIP Hall">VIP Hall</option>
                                        <option value="Hall 1">Hall 1</option>
                                        <option value="Hall 2">Hall 2</option>
                                        <option value="Hall 3">Hall 3</option>
                                    </select>
                                </div>

                                {/* Price............................................................ */}
                                <div>
                                    <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                        <FiDollarSign />
                                        Price *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="15.00"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        min="0"
                                        step="0.01"
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Screen ..........................................*/}
                            <div>
                                <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                    <FiMonitor />
                                    Screen
                                </label>
                                <select
                                    name="screen"
                                    value={formData.screen}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="Screen 1">Screen 1</option>
                                    <option value="Screen 2">Screen 2</option>
                                    <option value="Screen 3">Screen 3</option>
                                    <option value="Screen 4">Screen 4</option>
                                    <option value="IMAX">IMAX</option>
                                    <option value="VIP">VIP</option>
                                </select>
                            </div>

                            {/* Form Preview ...........................................................*/}
                            {(formData.movieId || formData.date || formData.time || formData.hall) && (
                                <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <FiFilm className="text-purple-400" />
                                        Showtime Preview
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        {formData.movieId && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Movie:</span>
                                                <span className="text-white">
                                                    {movies.find(m => m._id === formData.movieId)?.title}
                                                </span>
                                            </div>
                                        )}
                                        {formData.date && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Date:</span>
                                                <span className="text-white">
                                                    {new Date(formData.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                        {formData.time && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Time:</span>
                                                <span className="text-white">{formData.time}</span>
                                            </div>
                                        )}
                                        {formData.hall && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Hall:</span>
                                                <span className="text-white">{formData.hall}</span>
                                            </div>
                                        )}
                                        {formData.price && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Price:</span>
                                                <span className="text-green-400 font-semibold">${formData.price}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Showtime'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}