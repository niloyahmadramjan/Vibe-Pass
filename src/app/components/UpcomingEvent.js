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
import Image from "next/image";
import axiosPublic from "../api/axiosHook/useAxiosPublic";

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
        const response = await axiosPublic.get("/api/events");
        setEvents(response.data.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events;
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const currentEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  if (loading) return <EventSectionSkeleton />;
  if (error) return <EventSectionError error={error} />;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              Events
            </span>
          </h1>
          <p className="text-xl text-[#B0B0B0] max-w-3xl mx-auto leading-relaxed">
            Discover the latest blockbusters, exclusive screenings, and
            unforgettable cinematic experiences.
          </p>
        </motion.div>

        {/* Event Grid */}
        {currentEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
            <p className="text-[#B0B0B0]">No upcoming movies available.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}

        {/* Modal */}
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

const EventCard = ({ event, onSelect, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-[#1E1E1E] rounded-2xl border border-[#D32F2F]/20 overflow-hidden hover:border-[#D32F2F]/40 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 cursor-pointer group"
    onClick={() => onSelect(event)}
  >
    <div className="relative h-48 overflow-hidden">
      <Image
        src={event.poster || "/api/placeholder/400/200"}
        alt={event.title || event.name || "Event poster"}
        width={400}
        height={200}
        className="w-full h-48 md:h-56 lg:h-64 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
      />

      {event.isFeatured && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FFD700] to-[#FFA000] text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <FiStar className="text-xs" />
          Featured
        </div>
      )}
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold text-white group-hover:text-[#D32F2F] transition-colors line-clamp-2">
        {event.title}
      </h3>

      <div className="space-y-2 text-[#B0B0B0]">
        <div className="flex items-center gap-3 pt-2">
          <FiCalendar className="text-[#D32F2F]" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-3">
          <FiClock className="text-green-400" />
          <span>{event.time || "All Day"}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button className="flex-1 bg-gradient-to-r from-[#D32F2F] to-[#F44336] text-white py-3 rounded-xl font-semibold hover:from-[#F44336] hover:to-[#D32F2F] transition-all duration-300 shadow-lg shadow-red-500/25">
          View Details
        </button>
      </div>
    </div>
  </motion.div>
);

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => (
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

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
    ))}

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="p-3 bg-[#1E1E1E] border border-[#D32F2F]/20 rounded-xl hover:border-[#D32F2F]/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
    >
      <FiChevronRight className="text-xl" />
    </motion.button>
  </div>
);

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
      <div className="relative h-80 overflow-hidden">
        <Image
          src={event.poster || event.image || "/api/placeholder/800/400"}
          alt={event.title || "Event image"}
          width={800}
          height={400}
          className="w-full h-56 md:h-64 lg:h-102 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FiFilm className="text-[#D32F2F]" /> About the Movie
        </h3>
        <p className="text-[#B0B0B0] text-lg leading-relaxed mb-6">
          {event.description || "No description available."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 text-[#B0B0B0]">
            <div className="flex items-center gap-3">
              <FiCalendar className="text-[#D32F2F]" />{" "}
              {new Date(event.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-3">
              <FiClock className="text-green-400" /> {event.time || "All Day"}
            </div>
            <div className="flex items-center gap-3">
              <FiMapPin className="text-red-400" />{" "}
              {event.location || "To be announced"}
            </div>
          </div>

          <div className="space-y-3 text-[#B0B0B0]">
            <div className="flex items-center gap-3">
              <FiDollarSign className="text-[#FFD700]" /> $
              {event.price || "Free"}
            </div>
            <div className="flex items-center gap-3">
              <FiUsers className="text-purple-400" /> {event.attendees || 0}{" "}
              attending
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const EventSectionSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#1A0A0A] py-12 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-[#1E1E1E] rounded-2xl mx-auto mb-6 animate-pulse"></div>
        <div className="h-8 bg-[#1E1E1E] rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-[#1E1E1E] rounded w-96 mx-auto animate-pulse"></div>
      </div>
    </div>
  </div>
);

const EventSectionError = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
    <div className="text-center bg-[#1E1E1E] p-8 rounded-2xl border border-[#D32F2F]/30">
      <FiFilm className="text-[#D32F2F] text-4xl mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">Failed to Load Movies</h2>
      <p className="text-[#B0B0B0] mb-4">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-gradient-to-r from-[#D32F2F] to-[#F44336] rounded-xl shadow-md shadow-red-500/20 hover:opacity-90 transition"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default UpcomingEvent;
