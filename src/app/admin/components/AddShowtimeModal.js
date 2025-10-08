

// "use client";
// import { useState, useEffect } from "react";
// import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiX, FiFilm, FiCalendar, FiClock, FiDollarSign, FiMapPin, FiGlobe, FiLayers, FiSearch } from "react-icons/fi";
// import toast from "react-hot-toast";
// import Image from "next/image";

// const BASE_URL = 'https://api.themoviedb.org/3';
// const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// export default function AddShowtimeModal({ isOpen, onClose, onSuccess }) {
//     const [formData, setFormData] = useState({
//         movieId: "",
//         date: "",
//         time: "",
//         price: "",
//         hall: "",
//         language: "English",
//         format: "2D",
//         totalSeats: 100,
//         availableSeats: 100
//     });

//     const [tmdbMovies, setTmdbMovies] = useState([]);
//     const [filteredMovies, setFilteredMovies] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedMovie, setSelectedMovie] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [movieLoading, setMovieLoading] = useState(false);
//     const [activeCategory, setActiveCategory] = useState('nowPlaying');

//     const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

//     const categories = [
//         { key: 'nowPlaying', label: 'Now Playing', url: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1` },
//         { key: 'popular', label: 'Popular', url: `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1` },
//         { key: 'topRated', label: 'Top Rated', url: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1` },
//         { key: 'upcoming', label: 'Upcoming', url: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1` },
//     ];

//     // Fetch movies from TMDB when modal opens or category changes
//     useEffect(() => {
//         if (isOpen) {
//             fetchTmdbMovies(activeCategory);
//         }
//     }, []);

//     // Filter movies based on search
//     useEffect(() => {
//         if (searchTerm) {
//             const filtered = tmdbMovies.filter(movie =>
//                 movie.title.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//             setFilteredMovies(filtered);
//         } else {
//             setFilteredMovies(tmdbMovies);
//         }
//     }, [searchTerm, tmdbMovies]);

//     const fetchTmdbMovies = async (categoryKey) => {
//         try {
//             setMovieLoading(true);
//             const category = categories.find(cat => cat.key === categoryKey);
//             const response = await fetch(category.url);
//             const data = await response.json();

//             setTmdbMovies(data.results || []);
//             setFilteredMovies(data.results || []);
//         } catch (error) {
//             console.error('Error fetching TMDB movies:', error);
//             toast.error('Failed to load movies from TMDB');
//         } finally {
//             setMovieLoading(false);
//         }
//     };

//     const handleMovieSelect = (movie) => {
//         setSelectedMovie(movie);
//         setFormData(prev => ({
//             ...prev,
//             movieId: movie.id, // TMDB movie ID
//             language: movie.original_language || "English"
//         }));
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: name === 'price' || name === 'totalSeats' || name === 'availableSeats'
//                 ? Number(value)
//                 : value
//         }));
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!selectedMovie) {
//             toast.error("Please select a movie");
//             return;
//         }

//         //
//         const showtimeData = {
//             tmdbMovieId: selectedMovie.id.toString(), // New field
//             movieId: selectedMovie.id.toString(),     // Old field (for compatibility)
//             date: formData.date,
//             time: formData.time,
//             price: parseFloat(formData.price),
//             hall: formData.hall,
//             language: formData.language,
//             format: formData.format,
//             totalSeats: parseInt(formData.totalSeats),
//             availableSeats: parseInt(formData.availableSeats),
//             movieData: {
//                 tmdbId: selectedMovie.id,
//                 title: selectedMovie.title,
//                 poster_path: selectedMovie.poster_path,
//                 backdrop_path: selectedMovie.backdrop_path,
//                 overview: selectedMovie.overview,
//                 release_date: selectedMovie.release_date,
//                 vote_average: selectedMovie.vote_average,
//                 genre_ids: selectedMovie.genre_ids,
//                 original_language: selectedMovie.original_language,
//                 popularity: selectedMovie.popularity
//             }
//         };

//         console.log('📤 Creating showtime with both IDs:', {
//             tmdbMovieId: showtimeData.tmdbMovieId,
//             movieId: showtimeData.movieId
//         });

//         setLoading(true);
//         try {
//             const response = await axiosSecure.post("/api/showtime", showtimeData);
//             toast.success("Showtime added successfully!");
//             onSuccess();
//             handleClose();
//         } catch (error) {
//             console.error("Add showtime error:", error);
//             toast.error(error.response?.data?.error || "Failed to add showtime");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleClose = () => {
//         setFormData({
//             movieId: "",
//             date: "",
//             time: "",
//             price: "",
//             hall: "",
//             language: "English",
//             format: "2D",
//             totalSeats: 100,
//             availableSeats: 100
//         });
//         setSelectedMovie(null);
//         setSearchTerm("");
//         setActiveCategory('nowPlaying');
//         onClose();
//     };

//     const getTodayDate = () => {
//         return new Date().toISOString().split('T')[0];
//     };

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//                     onClick={handleClose}
//                 >
//                     <motion.div
//                         initial={{ scale: 0.9, opacity: 0, y: 20 }}
//                         animate={{ scale: 1, opacity: 1, y: 0 }}
//                         exit={{ scale: 0.9, opacity: 0, y: 20 }}
//                         className="bg-gradient-to-br from-[#1a1c2b] to-[#151724] rounded-2xl border border-gray-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         {/* Header */}
//                         <div className="flex items-center justify-between p-6 border-b border-gray-800">
//                             <div>
//                                 <h2 className="text-2xl font-bold text-white">Add New Showtime</h2>
//                                 <p className="text-gray-400 mt-1">Select movie from TMDB and create showtime</p>
//                             </div>
//                             <button
//                                 onClick={handleClose}
//                                 className="p-2 hover:bg-gray-800 rounded-xl transition-colors duration-200"
//                             >
//                                 <FiX size={24} className="text-gray-400" />
//                             </button>
//                         </div>

//                         {/* Form */}
//                         <form onSubmit={handleSubmit} className="p-6">
//                             {/* Movie Selection Section */}
//                             <div className="mb-6">
//                                 <label className="flex items-center text-sm font-medium text-gray-400 mb-3">
//                                     <FiFilm className="mr-2 text-purple-400" />
//                                     Select Movie from TMDB *
//                                 </label>

//                                 {/* Category Tabs */}
//                                 <div className="flex space-x-2 mb-4 overflow-x-auto">
//                                     {categories.map((category) => (
//                                         <button
//                                             key={category.key}
//                                             type="button"
//                                             onClick={() => setActiveCategory(category.key)}
//                                             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category.key
//                                                     ? 'bg-purple-600 text-white'
//                                                     : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
//                                                 }`}
//                                         >
//                                             {category.label}
//                                         </button>
//                                     ))}
//                                 </div>

//                                 {/* Search Box */}
//                                 <div className="relative mb-4">
//                                     <FiSearch className="absolute left-3 top-3 text-gray-400" />
//                                     <input
//                                         type="text"
//                                         placeholder="Search movies..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                         className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                     />
//                                 </div>

//                                 {/* Selected Movie Preview */}
//                                 {selectedMovie && (
//                                     <div className="mb-4 p-4 bg-gray-800/30 rounded-xl border border-purple-500/30">
//                                         <div className="flex items-center space-x-4">
//                                             <Image
//                                                 src={
//                                                     selectedMovie.poster_path
//                                                         ? `${IMG_URL}${selectedMovie.poster_path}`
//                                                         : '/default-poster.jpg'
//                                                 }
//                                                 alt={selectedMovie.title}
//                                                 width={60}
//                                                 height={90}
//                                                 className="rounded-lg object-cover"
//                                             />
//                                             <div>
//                                                 <h3 className="text-white font-semibold">{selectedMovie.title}</h3>
//                                                 <p className="text-gray-400 text-sm">
//                                                     {new Date(selectedMovie.release_date).getFullYear()} •
//                                                     Rating: {selectedMovie.vote_average}/10
//                                                 </p>
//                                                 <p className="text-purple-400 text-sm">Selected</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {/* Movies Grid */}
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
//                                     {movieLoading ? (
//                                         <div className="col-span-2 text-center py-8">
//                                             <div className="text-gray-400">Loading movies...</div>
//                                         </div>
//                                     ) : filteredMovies.length > 0 ? (
//                                         filteredMovies.map((movie) => (
//                                             <div
//                                                 key={movie.id}
//                                                 onClick={() => handleMovieSelect(movie)}
//                                                 className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedMovie?.id === movie.id
//                                                         ? 'border-purple-500 bg-purple-500/10'
//                                                         : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
//                                                     }`}
//                                             >
//                                                 <div className="flex items-center space-x-3">
//                                                     <Image
//                                                         src={
//                                                             movie.poster_path
//                                                                 ? `${IMG_URL}${movie.poster_path}`
//                                                                 : '/default-poster.jpg'
//                                                         }
//                                                         alt={movie.title}
//                                                         width={40}
//                                                         height={60}
//                                                         className="rounded object-cover"
//                                                     />
//                                                     <div className="flex-1 min-w-0">
//                                                         <h4 className="text-white font-medium text-sm truncate">
//                                                             {movie.title}
//                                                         </h4>
//                                                         <p className="text-gray-400 text-xs">
//                                                             {new Date(movie.release_date).getFullYear()} • ⭐ {movie.vote_average}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <div className="col-span-2 text-center py-8">
//                                             <div className="text-gray-400">No movies found</div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Showtime Details */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-800 pt-6">
//                                 {/* Date */}
//                                 <div>
//                                     <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
//                                         <FiCalendar className="mr-2 text-blue-400" />
//                                         Date *
//                                     </label>
//                                     <input
//                                         type="date"
//                                         name="date"
//                                         value={formData.date}
//                                         onChange={handleChange}
//                                         min={getTodayDate()}
//                                         required
//                                         className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     />
//                                 </div>

//                                 {/* Time */}
//                                 <div>
//                                     <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
//                                         <FiClock className="mr-2 text-green-400" />
//                                         Time *
//                                     </label>
//                                     <input
//                                         type="time"
//                                         name="time"
//                                         value={formData.time}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                                     />
//                                 </div>

//                                 {/* Hall */}
//                                 <div>
//                                     <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
//                                         <FiMapPin className="mr-2 text-yellow-400" />
//                                         Hall *
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="hall"
//                                         placeholder="e.g., Hall A, IMAX, VIP"
//                                         value={formData.hall}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                                     />
//                                 </div>

//                                 {/* Price */}
//                                 <div>
//                                     <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
//                                         <FiDollarSign className="mr-2 text-emerald-400" />
//                                         Price ($) *
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name="price"
//                                         placeholder="0.00"
//                                         min="0"
//                                         step="0.01"
//                                         value={formData.price}
//                                         onChange={handleChange}
//                                         required
//                                         className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                                     />
//                                 </div>

//                                 {/* Language */}
//                                 <div>
//                                     <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
//                                         <FiGlobe className="mr-2 text-cyan-400" />
//                                         Language
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="language"
//                                         value={formData.language}
//                                         onChange={handleChange}
//                                         className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
//                                     />
//                                 </div>

//                                 {/* Format */}
//                                 <div>
//                                     <label className="flex items-center text-sm font-medium text-gray-400 mb-2">
//                                         <FiLayers className="mr-2 text-orange-400" />
//                                         Format
//                                     </label>
//                                     <select
//                                         name="format"
//                                         value={formData.format}
//                                         onChange={handleChange}
//                                         className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
//                                     >
//                                         <option value="2D">2D</option>
//                                         <option value="3D">3D</option>
//                                         <option value="IMAX">IMAX</option>
//                                         <option value="4DX">4DX</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-800">
//                                 <button
//                                     type="button"
//                                     onClick={handleClose}
//                                     disabled={loading}
//                                     className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 rounded-xl text-white transition-colors"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={loading || !selectedMovie}
//                                     className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 rounded-xl text-white font-medium transition-all"
//                                 >
//                                     {loading ? "Adding..." : "Add Showtime"}
//                                 </button>
//                             </div>
//                         </form>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// }