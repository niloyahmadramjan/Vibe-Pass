import { useState } from "react";

const { default: Image } = require("next/image");
import { motion } from 'framer-motion';
import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
import toast from "react-hot-toast";

// Edit Movie Modal Component - without useMutation
const EditMovieModal = ({ movie, onClose, onSuccess }) => {
    const [formData, setFormData] = useState(movie);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    const imgbbUrl = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;

    const categoryOptions = [
        "nowPlaying", "trending", "popular", "topRated", "upcoming",
        "genreAction", "genreIndia", "genreAnimation", "banglaFilm"
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked :
                type === 'number' ? Number(value) : value
        }));
    };

    const handleImageUpload = async (e, imageType) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append("image", file);

        try {
            setUploading(true);
            const response = await fetch(imgbbUrl, {
                method: "POST",
                body: uploadFormData,
            });

            const data = await response.json();

            if (data.success) {
                const imageUrl = data.data.display_url;
                setFormData(prev => ({
                    ...prev,
                    [imageType === 'poster' ? 'custom_poster' : 'custom_backdrop']: imageUrl
                }));
                toast.success(`✅ ${imageType === 'poster' ? 'Poster' : 'Backdrop'} uploaded successfully!`);
            } else {
                toast.error('❌ Image upload failed!');
            }
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error('❌ Failed to upload image!');
        } finally {
            setUploading(false);
        }
    };

    // ✅ Regular axios call without useMutation
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await axiosSecure.put(`/api/movies/${movie._id}`, formData);

            if (response.data.success) {
                toast.success('✅ Movie updated successfully!');
                onSuccess(); // ✅ Parent component-কে inform করবে
            } else {
                toast.error('❌ Failed to update movie');
            }
        } catch (error) {
            console.error('Error updating movie:', error);
            toast.error('❌ Failed to update movie');
        } finally {
            setLoading(false);
        }
    };

    const getPosterUrl = () => {
        return formData.custom_poster ||
            (formData.poster_path?.startsWith('http')
                ? formData.poster_path
                : `https://image.tmdb.org/t/p/w500${formData.poster_path}`)
            || '/images/placeholder-poster.jpg';
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#1a1b2f] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Edit Movie</h2>
                        <p className="text-gray-400">Update movie information</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 p-6 border-b border-gray-700">
                    {['basic', 'details', 'images'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === tab
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                                : 'bg-[#12131a] text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-[#12131a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-[#12131a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categoryOptions.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">Original Title</label>
                                    <input
                                        type="text"
                                        name="original_title"
                                        value={formData.original_title}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-[#12131a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">Language</label>
                                    <select
                                        name="original_language"
                                        value={formData.original_language}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-[#12131a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    >
                                        <option value="en">English</option>
                                        <option value="bn">Bangla</option>
                                        <option value="hi">Hindi</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">Overview</label>
                                <textarea
                                    name="overview"
                                    value={formData.overview}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-3 py-2 bg-[#12131a] border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Details Tab */}
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">Release Date</label>
                                    <input
                                        type="date"
                                        name="release_date"
                                        value={formData.release_date}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-[#12131a] border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">Vote Average</label>
                                    <input
                                        type="number"
                                        name="vote_average"
                                        value={formData.vote_average}
                                        onChange={handleChange}
                                        step="0.1"
                                        min="0"
                                        max="10"
                                        className="w-full px-3 py-2 bg-[#12131a] border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">Vote Count</label>
                                    <input
                                        type="number"
                                        name="vote_count"
                                        value={formData.vote_count}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-[#12131a] border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-white text-sm font-medium mb-2 block">Popularity</label>
                                    <input
                                        type="number"
                                        name="popularity"
                                        value={formData.popularity}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="w-full px-3 py-2 bg-[#12131a] border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3 p-3 bg-[#12131a] rounded-lg border border-gray-700">
                                    <input
                                        type="checkbox"
                                        name="adult"
                                        checked={formData.adult}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                                        id="adult-check"
                                    />
                                    <label htmlFor="adult-check" className="text-white text-sm">
                                        Adult Content
                                    </label>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-[#12131a] rounded-lg border border-gray-700">
                                    <input
                                        type="checkbox"
                                        name="video"
                                        checked={formData.video}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                                        id="video-check"
                                    />
                                    <label htmlFor="video-check" className="text-white text-sm">
                                        Has Video
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Images Tab */}
                    {activeTab === 'images' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-white text-sm font-medium mb-3 block">
                                        Upload Poster
                                    </label>
                                    <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center transition-all duration-300 hover:border-green-500/50">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, 'poster')}
                                            className="hidden"
                                            id="poster-upload"
                                        />
                                        <label htmlFor="poster-upload" className="cursor-pointer block">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4">
                                                    <span className="text-2xl">🖼️</span>
                                                </div>
                                                <p className="text-gray-400 mb-2">Click to upload poster</p>
                                                <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-white text-sm font-medium mb-3 block">Poster Preview</label>
                                    <div className="relative h-48 rounded-xl overflow-hidden border-2 border-gray-600">
                                        <Image
                                            src={getPosterUrl()}
                                            alt="Poster Preview"
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder-poster.jpg';
                                            }}
                                        />
                                        {formData.custom_poster && (
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full border border-green-400">
                                                    Custom
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {uploading && (
                                <div className="flex items-center justify-center space-x-2 text-green-400">
                                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Uploading image...</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-700/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-400 hover:text-white transition-colors duration-300 bg-[#12131a] rounded-xl border border-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <span>Update Movie</span>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditMovieModal