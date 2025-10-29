// app/admin/movies/page.js
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import toast, { Toaster } from "react-hot-toast";
import Image from 'next/image';
import {
    FiEdit,
    FiTrash2,
    FiEye,
    FiChevronLeft,
    FiChevronRight,
    FiSearch,
    FiStar,
    FiClock,
    FiDollarSign,
    FiPlus,
    FiFilm,
    FiTrendingUp
} from 'react-icons/fi';
import { Edit } from 'lucide-react';
import EditMovieModal from '@/app/booking/[id]/components/EditMovie';

export default function ManageMoviesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const moviesPerPage = 12;
    const queryClient = useQueryClient();

    // ✅ Fetch movies with pagination
    const { data: moviesData, isLoading, error } = useQuery({
        queryKey: ['movies', currentPage, searchTerm],
        queryFn: async () => {
            const response = await axiosSecure.get(
                `/api/movies/allMovieSeeAdmin?page=${currentPage}&limit=${moviesPerPage}&search=${searchTerm}`
            );
            return response.data;
        },
        keepPreviousData: true,
    });

    // ✅ Delete mutation with React Query (no page reload)
    const deleteMutation = useMutation({
        mutationFn: (movieId) => axiosSecure.delete(`/api/movies/${movieId}`),
        onSuccess: () => {
            toast.success('🎬 Movie deleted successfully!');
            queryClient.invalidateQueries(['movies']); // ✅ শুধু data refetch হবে, page reload হবে না
            setIsDeleteModalOpen(false);
        },
        onError: (error) => {
            console.error('Error deleting movie:', error);
            toast.error('❌ Failed to delete movie');
        }
    });

    const movies = moviesData?.movies || [];
    const totalPages = moviesData?.totalPages || 1;
    const totalMovies = moviesData?.total || 0;

    // Pagination controls
    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = (movieId) => {
        deleteMutation.mutate(movieId);
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-full mx-auto"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                         Movie Management
                    </h1>
                    <p className="text-gray-400 text-lg">Manage your movie collection with ease</p>

                    {/* Stats */}
                    {moviesData && (
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                            <div className="bg-[#1a1b2f] p-4 rounded-xl border border-purple-500/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-white">{totalMovies}</p>
                                        <p className="text-gray-400 text-sm">Total Movies</p>
                                    </div>
                                    <FiFilm className="w-8 h-8 text-purple-400" />
                                </div>
                            </div>
                            <div className="bg-[#1a1b2f] p-4 rounded-xl border border-blue-500/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-white">{totalPages}</p>
                                        <p className="text-gray-400 text-sm">Total Pages</p>
                                    </div>
                                    <FiTrendingUp className="w-8 h-8 text-blue-400" />
                                </div>
                            </div>
                            <div className="bg-[#1a1b2f] p-4 rounded-xl border border-green-500/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-white">{movies.length}</p>
                                        <p className="text-gray-400 text-sm">This Page</p>
                                    </div>
                                    <FiStar className="w-8 h-8 text-green-400" />
                                </div>
                            </div>
                            <div className="bg-[#1a1b2f] p-4 rounded-xl border border-pink-500/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-white">{currentPage}</p>
                                        <p className="text-gray-400 text-sm">Current Page</p>
                                    </div>
                                    <FiClock className="w-8 h-8 text-pink-400" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md mx-auto">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search movies by title, overview, or category..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Search করলে প্রথম পেজে যাবে
                            }}
                            className="w-full pl-12 pr-4 py-3 bg-[#1a1b2f] border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Movies Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        <span className="ml-4 text-white">Loading movies...</span>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-400 py-8">
                        <p>Error loading movies: {error.message}</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-center">
                            <p className="text-gray-400">
                                Showing <span className="text-white font-semibold">{movies.length}</span> of{' '}
                                <span className="text-white font-semibold">{totalMovies}</span> movies
                                (Page <span className="text-white font-semibold">{currentPage}</span> of{' '}
                                <span className="text-white font-semibold">{totalPages}</span>)
                            </p>
                        </div>

                        {/* ✅ প্রথমে ১২টা মুভি দেখাবে, Next Page-এ আরো ১২টা লোড হবে */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {movies.map((movie, index) => (
                                <MovieCard
                                    key={movie._id}
                                    movie={movie}
                                    index={index}
                                    onEdit={() => {
                                        setSelectedMovie(movie);
                                        setIsEditModalOpen(true);
                                    }}
                                    onDelete={() => {
                                        setSelectedMovie(movie);
                                        setIsDeleteModalOpen(true);
                                    }}
                                    onView={() => {
                                        setSelectedMovie(movie);
                                        setIsViewModalOpen(true);
                                    }}
                                />
                            ))}
                        </div>

                        {/* Pagination - Next/Previous দিয়ে আরো মুভি লোড হবে */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPrevious={handlePreviousPage}
                                onNext={handleNextPage}
                                onPageClick={handlePageClick}
                                getPageNumbers={getPageNumbers}
                            />
                        )}
                    </>
                )}

                {/* ✅ Edit Modal - একই কম্পোনেন্টে সব আপডেট করার অপশন */}
                {isEditModalOpen && (
                    <EditMovieModal movie={selectedMovie}
                        onClose={() => setIsEditModalOpen(false)}
                        onSuccess={() => {
                            setIsEditModalOpen(false);
                            queryClient.invalidateQueries(['movies']); // ✅ Auto update without reload
                        }}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <DeleteConfirmationModal
                        movie={selectedMovie}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={() => handleDelete(selectedMovie._id)}
                        loading={deleteMutation.isLoading}
                    />
                )}

                {/* View Movie Modal */}
                {isViewModalOpen && (
                    <ViewMovieModal
                        movie={selectedMovie}
                        onClose={() => setIsViewModalOpen(false)}
                    />
                )}
            </motion.div>
            <Toaster position="top-right" />
        </div>
    );
}

// Movie Card Component
const MovieCard = ({ movie, index, onEdit, onDelete, onView }) => {
    const getPosterUrl = () => {
        if (movie.custom_poster) return movie.custom_poster;
        if (movie.poster_path) {
            return movie.poster_path.startsWith('http')
                ? movie.poster_path
                : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        }
        return '/images/placeholder-poster.jpg';
    };

    const posterUrl = getPosterUrl();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1a1b2f] rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group hover:shadow-2xl hover:shadow-purple-500/10"
        >
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = '/images/placeholder-poster.jpg';
                    }}
                />

                {/* Custom Image Badge */}
                {movie.custom_poster && (
                    <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium border border-green-400">
                            Custom
                        </span>
                    </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={onView}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/40 backdrop-blur-sm rounded-lg text-white transition-all duration-300 transform hover:scale-110"
                            title="View Details"
                        >
                            <FiEye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onEdit}
                            className="p-2 bg-green-500/20 hover:bg-green-500/40 backdrop-blur-sm rounded-lg text-white transition-all duration-300 transform hover:scale-110"
                            title="Edit Movie"
                        >
                            <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm rounded-lg text-white transition-all duration-300 transform hover:scale-110"
                            title="Delete Movie"
                        >
                            <FiTrash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {movie.adult && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium border border-red-400">
                            18+
                        </span>
                    )}
                    {movie.video && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium border border-blue-400">
                            Video
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 hover:text-purple-300 transition-colors cursor-pointer">
                    {movie.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <span className="flex items-center">
                        <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                        {movie.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                    <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {movie.overview || 'No description available.'}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                        {movie.category || 'Uncategorized'}
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30">
                        {movie.original_language?.toUpperCase() || 'N/A'}
                    </span>
                </div>

                {/* Additional Info */}
                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-700/50 pt-3">
                    <div className="flex items-center">
                        <FiTrendingUp className="w-3 h-3 mr-1" />
                        <span>{movie.popularity?.toFixed(0) || '0'}</span>
                    </div>
                    <div className="flex items-center">
                        <FiDollarSign className="w-3 h-3 mr-1" />
                        <span>{movie.vote_count || '0'} votes</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPrevious, onNext, onPageClick, getPageNumbers }) => {
    return (
        <div className="flex justify-center items-center space-x-2">
            <button
                onClick={onPrevious}
                disabled={currentPage === 1}
                className={`p-3 rounded-xl transition-all duration-300 ${currentPage === 1
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1a1b2f] text-white hover:bg-purple-500/20 border border-gray-700 hover:border-purple-500'
                    }`}
            >
                <FiChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageClick(page)}
                    className={`px-4 py-3 rounded-xl transition-all duration-300 border ${currentPage === page
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25 border-purple-500'
                            : 'bg-[#1a1b2f] text-white hover:bg-purple-500/20 border-gray-700 hover:border-purple-500'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={onNext}
                disabled={currentPage === totalPages}
                className={`p-3 rounded-xl transition-all duration-300 ${currentPage === totalPages
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1a1b2f] text-white hover:bg-purple-500/20 border border-gray-700 hover:border-purple-500'
                    }`}
            >
                <FiChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ movie, onClose, onConfirm, loading }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1b2f] rounded-2xl p-6 max-w-md w-full border border-red-500/20"
            >
                <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                        <FiTrash2 className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Delete Movie</h2>
                    <p className="text-gray-400">
                        Are you sure you want to delete <span className="text-white font-semibold">"{movie.title}"</span>?
                        This action cannot be undone.
                    </p>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors duration-300 bg-[#12131a] rounded-xl border border-gray-700 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300 disabled:opacity-50 flex items-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <span>Delete</span>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// View Movie Modal
const ViewMovieModal = ({ movie, onClose }) => {
    const getPosterUrl = () => {
        if (movie.custom_poster) return movie.custom_poster;
        if (movie.poster_path) {
            return movie.poster_path.startsWith('http')
                ? movie.poster_path
                : `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        }
        return '/images/placeholder-poster.jpg';
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1b2f] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors duration-300 p-2"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <div className="relative h-80 rounded-xl overflow-hidden border-2 border-gray-600">
                                <Image
                                    src={getPosterUrl()}
                                    alt={movie.title}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        e.target.src = '/images/placeholder-poster.jpg';
                                    }}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <h3 className="text-gray-400 text-sm font-medium mb-2">Overview</h3>
                                <p className="text-white leading-relaxed">{movie.overview || 'No overview available.'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-gray-400 text-sm font-medium mb-2">Release Date</h3>
                                    <p className="text-white">{movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm font-medium mb-2">Rating</h3>
                                    <p className="text-white flex items-center">
                                        <FiStar className="w-4 h-4 text-yellow-400 mr-1" />
                                        {movie.vote_average}/10
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm font-medium mb-2">Language</h3>
                                    <p className="text-white">{movie.original_language?.toUpperCase() || 'N/A'}</p>
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm font-medium mb-2">Category</h3>
                                    <p className="text-white">{movie.category || 'Uncategorized'}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-gray-400 text-sm font-medium mb-2">Additional Info</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                                        Votes: {movie.vote_count || '0'}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                                        Popularity: {movie.popularity?.toFixed(0) || '0'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-sm ${movie.adult ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'
                                        }`}>
                                        {movie.adult ? 'Adult' : 'General'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};