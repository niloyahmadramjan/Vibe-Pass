"use client";
import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiUsers,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiFilm,
  FiDollarSign,
  FiVideo,
  FiUser,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function UpcomingEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const eventsPerPage = 3;
useEffect(() => {
  const fetchEvents = async () => {
    try {
      // axiosSecure not use because  not login user show  
      const response = await fetch("http://localhost:5000/api/events");
      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);

  const filteredEvents = events;

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  if (loading) {
    return <EventSectionSkeleton />;
  }

  if (error) {
    return <EventSectionError error={error} />;
  }

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D32F2F] to-[#F44336] rounded-2xl mb-6 shadow-2xl shadow-red-500/30"
          >
            <FiFilm className="text-white text-2xl" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upcoming{" "}
            <span className="bg-gradient-to-r from-[#D32F2F] via-[#F44336] to-[#FF6B6B] bg-clip-text text-transparent">
              Movies
            </span>
          </h1>
          <p className="text-xl text-[#B0B0B0] max-w-3xl mx-auto leading-relaxed">
            Discover the latest blockbusters, exclusive screenings, and
            unforgettable cinematic experiences
          </p>
        </motion.div>

        {/* All Movies Grid */}
        <div className="mb-12">
          {/* <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <FiCalendar className="text-[#D32F2F]" />
            Upcoming Movies ({filteredEvents.length})
          </h2> */}

          {currentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event, index) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onSelect={setSelectedEvent}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#1E1E1E] rounded-2xl border border-[#D32F2F]/20">
              <FiFilm className="text-[#B0B0B0] text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#B0B0B0] mb-2">
                No movies found
              </h3>
              <p className="text-[#B0B0B0]">No upcoming movies available</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 bg-[#1E1E1E] border border-[#D32F2F]/20 rounded-xl hover:border-[#D32F2F]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
            >
              <FiChevronLeft className="text-xl" />
            </motion.button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <motion.button
                    key={page}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(page)}
                    className={`w-12 h-12 rounded-xl font-medium transition-all duration-300 ${
                      currentPage === page
                        ? "bg-gradient-to-r from-[#D32F2F] to-[#F44336] text-white shadow-lg shadow-red-500/25"
                        : "bg-[#1E1E1E] text-[#B0B0B0] border border-[#D32F2F]/20 hover:border-[#D32F2F]/40"
                    }`}
                  >
                    {page}
                  </motion.button>
                )
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-3 bg-[#1E1E1E] border border-[#D32F2F]/20 rounded-xl hover:border-[#D32F2F]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
            >
              <FiChevronRight className="text-xl" />
            </motion.button>
          </div>
        )}

        {/* Event Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <EventModal
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Event Card Component
const EventCard = ({ event, onSelect, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-[#1E1E1E] rounded-2xl border border-[#D32F2F]/20 overflow-hidden hover:border-[#D32F2F]/40 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 cursor-pointer group"
    onClick={() => onSelect(event)}
  >
    {/* Event Image */}
    <div className="relative h-48 overflow-hidden">
      <img
        src={event.poster || "/api/placeholder/400/200"}
        alt={event.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {event.isFeatured && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FFD700] to-[#FFA000] text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <FiStar className="text-xs" />
          Featured
        </div>
      )}
    </div>

    {/* Event Content */}
    <div className="p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-white group-hover:text-[#D32F2F] transition-colors line-clamp-2">
          {event.title}
        </h3>
      </div>

      <p className="text-[#B0B0B0] mb-4 line-clamp-2">{event.description}</p>

      {/* Event Details */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-[#B0B0B0]">
          <FiCalendar className="text-[#D32F2F]" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-3 text-[#B0B0B0]">
          <FiClock className="text-green-400" />
          <span>{event.time || "All Day"}</span>
        </div>
        <div className="flex items-center gap-3 text-[#B0B0B0]">
          <FiMapPin className="text-red-400" />
          <span className="line-clamp-1">Cinema: {event.location}</span>
        </div>
        {event.attendees && (
          <div className="flex items-center gap-3 text-[#B0B0B0]">
            <FiUsers className="text-purple-400" />
            <span>{event.attendees} attending</span>
          </div>
        )}
      </div>

      {/* View Details Button */}
      <div className="flex gap-2 mt-6">
        <button className="flex-1 bg-gradient-to-r from-[#D32F2F] to-[#F44336] text-white py-3 rounded-xl font-semibold hover:from-[#F44336] hover:to-[#D32F2F] transition-all duration-300 shadow-lg shadow-red-500/25">
          View Details
        </button>
      </div>
    </div>
  </motion.div>
);

// Enhanced Event Modal Component
const EventModal = ({ event, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-[#1E1E1E] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#D32F2F]/20"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header with Image */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={event.poster || event.image || "/api/placeholder/800/400"}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          ✕
        </button>
        <div className="absolute bottom-4 left-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {event.name}
          </h2>
          {event.isFeatured && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFA000] text-black px-3 py-1 rounded-full text-sm font-semibold">
              <FiStar className="text-xs" />
              Featured Movie
            </div>
          )}
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-6 md:p-8">
        {/* Description */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FiFilm className="text-[#D32F2F]" />
            About the Movie
          </h3>
          <p className="text-[#B0B0B0] text-lg leading-relaxed">
            {event.description || "No description available."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FiCalendar className="text-[#D32F2F]" />
              Event Details
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#B0B0B0]">
                <FiCalendar className="text-[#D32F2F] text-lg" />
                <div>
                  <span className="font-semibold text-white">Date: </span>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#B0B0B0]">
                <FiClock className="text-green-400 text-lg" />
                <div>
                  <span className="font-semibold text-white">Time: </span>
                  {event.time || "All Day"}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#B0B0B0]">
                <FiMapPin className="text-red-400 text-lg" />
                <div>
                  <span className="font-semibold text-white">Cinema: </span>
                  {event.location || "To be announced"}
                </div>
              </div>
            </div>
          </div>

          {/* Venue & Pricing */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FiVideo className="text-[#D32F2F]" />
              Venue & Pricing
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#B0B0B0]">
                <FiVideo className="text-blue-400 text-lg" />
                <div>
                  <span className="font-semibold text-white">Screen: </span>
                  {event.screen || "Main Screen"}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#B0B0B0]">
                <FiUsers className="text-purple-400 text-lg" />
                <div>
                  <span className="font-semibold text-white">
                    Hall Capacity:{" "}
                  </span>
                  {event.capacity ? `${event.capacity} seats` : "Not specified"}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#B0B0B0]">
                <FiDollarSign className="text-[#FFD700] text-lg" />
                <div>
                  <span className="font-semibold text-white">Price: </span>
                  <span className="text-2xl font-bold text-[#D32F2F]">
                    ${event.price || "Free"}
                  </span>
                </div>
              </div>

              {event.attendees && (
                <div className="flex items-center gap-3 text-[#B0B0B0]">
                  <FiUser className="text-green-400 text-lg" />
                  <div>
                    <span className="font-semibold text-white">
                      Attendees:{" "}
                    </span>
                    {event.attendees} registered
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Loading Skeleton
const EventSectionSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A0A0A] py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-[#1E1E1E] rounded-2xl mx-auto mb-6 animate-pulse"></div>
        <div className="h-8 bg-[#1E1E1E] rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-[#1E1E1E] rounded w-96 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-[#1E1E1E] rounded-2xl p-6 animate-pulse border border-[#D32F2F]/10"
          >
            <div className="h-48 bg-[#0A0A0A] rounded-xl mb-4"></div>
            <div className="h-6 bg-[#0A0A0A] rounded mb-2"></div>
            <div className="h-4 bg-[#0A0A0A] rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-[#0A0A0A] rounded"></div>
              <div className="h-4 bg-[#0A0A0A] rounded"></div>
              <div className="h-4 bg-[#0A0A0A] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error Component
const EventSectionError = ({ error }) => (
  <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A0A0A] py-12 px-4 flex items-center justify-center">
    <div className="text-center bg-[#1E1E1E] p-8 rounded-2xl shadow-lg border border-[#D32F2F]/20 max-w-md">
      <div className="w-16 h-16 bg-[#D32F2F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiFilm className="text-[#D32F2F] text-2xl" />
      </div>
      <h2 className="text-xl font-bold text-[#D32F2F] mb-2">
        Failed to Load Movies
      </h2>
      <p className="text-[#B0B0B0] mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-gradient-to-r from-[#D32F2F] to-[#F44336] text-white rounded-xl hover:from-[#F44336] hover:to-[#D32F2F] transition-all duration-300 font-medium shadow-lg shadow-red-500/25"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default UpcomingEvent;
