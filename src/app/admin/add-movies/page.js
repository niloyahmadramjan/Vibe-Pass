'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import toast, { Toaster } from "react-hot-toast";
import Image from 'next/image';

export default function AddMoviesPage() {
  const [formData, setFormData] = useState({
    adult: false,
    backdrop_path: "",
    genre_ids: [],
    original_language: "en",
    original_title: "",
    overview: "",
    popularity: 0,
    poster_path: "",
    release_date: "",
    title: "",
    video: false,
    vote_average: 0,
    vote_count: 0
  });
console.log(formData)
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const imgbbUrl = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;

  const genreOptions = [
    { id: 16, name: "Animation" },
    { id: 28, name: "Action" },
    { id: 14, name: "Fantasy" },
    { id: 53, name: "Thriller" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 878, name: "Sci-Fi" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "genre_ids") {
      setFormData({ ...formData, genre_ids: [Number(value)] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Handle Image Upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      setUploading(true);
      const res = await fetch(imgbbUrl, {
        method: "POST",
        body: formDataImg,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          poster_path: data.data.display_url
        }));
        toast.success("✅ Image uploaded successfully!");
      } else {
        toast.error("❌ Image upload failed!");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("❌ Failed to upload image!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosSecure.post("/api/movies/add", formData);
      console.log(' Movie added:', response.data);

      toast.success(' Movie added successfully!', { duration: 3000 });

      setFormData({
        adult: false,
        backdrop_path: "",
        genre_ids: [],
        original_language: "en",
        original_title: "",
        overview: "",
        popularity: 0,
        poster_path: "",
        release_date: "",
        title: "",
        video: false,
        vote_average: 0,
        vote_count: 0
      });

    } catch (error) {
      console.error(' Error adding movie:', error);
      toast.error('Failed to add movie', { duration: 3000 });
    }
  };
 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233] py-8 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
             Add New Movie
          </h1>
          <p className="text-gray-400 text-lg">Fill in the details to add a masterpiece to the collection</p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="bg-[#1a1b2f] rounded-2xl p-1 border border-gray-800">
            {['basic', 'details', 'media', 'additional'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-purple-600/30 hover:from-purple-600/40 hover:to-purple-600/50  text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          variants={itemVariants}
          className="bg-[#12131a]/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-800/50 relative overflow-hidden"
        >
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Movie Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e1f29]/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      placeholder="Enter movie title"
                      required
                    />
                  </div>

                  <div>
                    <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      Original Title
                    </label>
                    <input
                      type="text"
                      name="original_title"
                      value={formData.original_title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e1f29]/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
                      placeholder="Enter original title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                      Genre *
                    </label>
                    <select
                      name="genre_ids"
                      value={formData.genre_ids[0] || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e1f29]/80 border border-gray-700/50 rounded-xl text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                      required
                    >
                      <option value="">Select Genre</option>
                      {genreOptions.map(genre => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Language *
                    </label>
                    <select
                      name="original_language"
                      value={formData.original_language}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e1f29]/80 border border-gray-700/50 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      required
                    >
                      <option value="en">English</option>
                      <option value="bn">Bangla</option>
                      <option value="hi">Hindi</option>
                      <option value="zh">Chinese</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Release Date *
                    </label>
                    <input
                      type="date"
                      name="release_date"
                      value={formData.release_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e1f29]/80 border border-gray-700/50 rounded-xl text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      required
                    />
                  </div>

                  <div>
                    <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      Vote Average
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min=""
                      max="10"
                      name="vote_average"
                      value={formData.vote_average}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e1f29]/80 border border-gray-700/50 rounded-xl text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                      placeholder="0.0 - 10.0"
                    />
                  </div>
                </div>

                <div>
                  <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Overview
                  </label>
                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-[#1e1f29]/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 resize-none"
                    placeholder="Write a compelling movie description..."
                  ></textarea>
                </div>
              </motion.div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Upload Poster
                  </label>
                  <div className="border-2 border-dashed border-gray-700/50 rounded-2xl p-8 text-center transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="poster-upload"
                    />
                    <label htmlFor="poster-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                          <span className="text-2xl">📸</span>
                        </div>
                        <p className="text-gray-400 mb-2">Click to upload movie poster</p>
                        <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                      </div>
                    </label>
                  </div>

                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 flex items-center justify-center space-x-2 text-indigo-400"
                    >
                      <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </motion.div>
                  )}

                  {formData.poster_path && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 flex justify-center"
                    >
                      <div className="relative group">
                      
                        <Image
                          src={formData.poster_path}  
                          alt={formData.title}        
                          width={150}                    
                          height={150}                   
                          className="object-cover rounded-xl border-2 border-purple-500/50 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                          <span className="text-white text-sm font-medium">Poster Preview</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                    Backdrop Image URL
                  </label>
                  <input
                    type="url"
                    name="backdrop_path"
                    value={formData.backdrop_path}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1e1f29]/80 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-300"
                    placeholder="Enter backdrop image URL"
                  />
                </div>
              </motion.div>
            )}

            {/* Additional Info Tab */}
            {activeTab === 'additional' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Vote Count
                    </label>
                    <input
                      type="number"
                      min=""
                      name="vote_count"
                      value={formData.vote_count}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e1f29]/80 border border-gray-700/50 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      placeholder="Number of votes"
                    />
                  </div>

                  <div>
                    <label className=" text-sm font-semibold text-gray-300 mb-3 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                      Popularity
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="popularity"
                      value={formData.popularity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#1e1f29]/80 border border-gray-700/50 rounded-xl text-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                      placeholder="Popularity score"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 p-4 bg-[#1e1f29]/50 rounded-xl border border-gray-700/30">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="adult"
                        checked={formData.adult}
                        onChange={handleChange}
                        className="w-5 h-5 text-purple-500 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                        id="adult-checkbox"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="adult-checkbox" className="text-sm font-semibold text-gray-300 cursor-pointer">
                        Adult Content
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Check if this movie contains adult-only content
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${formData.adult
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                      {formData.adult ? 'Rated R' : 'General'}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-[#1e1f29]/50 rounded-xl border border-gray-700/30">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="video"
                        checked={formData.video}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        id="video-checkbox"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="video-checkbox" className="text-sm font-semibold text-gray-300 cursor-pointer">
                        Has Video
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Check if this movie has video content available
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${formData.video
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                      {formData.video ? 'Video Available' : 'No Video'}
                    </div>
                  </div>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <span className="w-3 h-3bg-gradient-to-r from-purple-600 to-purple-600/30 hover:from-purple-600/40 hover:to-purple-600/50 rounded-full mr-2"></span>
                    Movie Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Title:</span>
                      <p className="text-white font-medium truncate">{formData.title || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Genre:</span>
                      <p className="text-white font-medium">
                        {formData.genre_ids[0] ? genreOptions.find(g => g.id === formData.genre_ids[0])?.name : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Release Date:</span>
                      <p className="text-white font-medium">{formData.release_date || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Rating:</span>
                      <p className="text-white font-medium">{formData.vote_average || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-800/50">
              <button
                type="button"
                onClick={() => {
                  const tabs = ['basic', 'details', 'media', 'additional'];
                  const currentIndex = tabs.indexOf(activeTab);
                  setActiveTab(tabs[Math.max(0, currentIndex - 1)]);
                }}
                disabled={activeTab === 'basic'}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 border ${activeTab === 'basic'
                    ? 'bg-gray-800/30 text-gray-500 border-gray-700/30 cursor-not-allowed'
                    : 'bg-gray-800/50 text-gray-300 border-gray-700/50 hover:bg-gray-700/50'
                  }`}
              >
                ← Previous
              </button>

              {activeTab !== 'additional' ? (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['basic', 'details', 'media', 'additional'];
                    const currentIndex = tabs.indexOf(activeTab);
                    setActiveTab(tabs[Math.min(tabs.length - 1, currentIndex + 1)]);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-600/30 hover:from-purple-600/40 hover:to-purple-600/50  text-white font-medium rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  Next →
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-600/30 hover:from-purple-600/40 hover:to-purple-600/50  text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center space-x-2"
                >
                
                  <span>Add Movie</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

