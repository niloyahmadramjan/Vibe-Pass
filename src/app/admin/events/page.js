

// components/EventsManagement.jsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiDollarSign, FiEye, FiEdit, FiTrash2, FiX, FiPlus, FiSearch, FiInfo, FiTag, FiBarChart2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from "@/app/context/AuthContext";
import Image from 'next/image';

// Import only Create and Edit forms as separate components

import AdminLoading from '../components/AdminLoading';
import EventCreateForm from '../components/EventCreateForm';
import EventEditForm from '../components/EventEditForm';

export default function EventsManagement() {
    const { user, loading: authLoading } = useAuth();
    const [events, setEvents] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading) {
            fetchEvents();
        }
    }, [authLoading]);

    const fetchEvents = async () => {
        try {
            const response = await axiosSecure.get('/api/events');
            const eventsData = response.data.data || response.data;
            setEvents(Array.isArray(eventsData) ? eventsData : []);
        } catch (error) {
            console.error("❌ Error fetching events:", error);
            toast.error('Failed to fetch events');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = useCallback(async (eventData) => {
        try {
            const response = await axiosSecure.post('/api/events', eventData);
            const newEvent = response.data.data || response.data;
            setEvents(prev => [newEvent, ...prev]);
            toast.success('🎉 Event created successfully!');
            setShowCreateForm(false);
        } catch (error) {
            console.error("❌ Error creating event:", error);
            toast.error(error.response?.data?.message || 'Failed to create event');
        }
    }, []);

    const handleEditEvent = async (eventId, updatedData) => {
        try {
            const response = await axiosSecure.put(`/api/events/${eventId}`, updatedData);
            const updatedEvent = response.data.data || response.data;

            setEvents(prev => prev.map(event =>
                event._id === eventId ? updatedEvent : event
            ));

            toast.success('✅ Event updated successfully!');
            setShowEditForm(false);
            setSelectedEvent(null);
            return true;
        } catch (error) {
            console.error("❌ Error updating event:", error);
            const errorMessage = error.response?.data?.message || 'Failed to update event';
            toast.error(`Update Error: ${errorMessage}`);
            return false;
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;

        try {
            console.log("🗑️ Deleting event:", eventId);
            await axiosSecure.delete(`/api/events/${eventId}`);

            setEvents(prev => prev.filter(event => event._id !== eventId));
            toast.success('🗑️ Event deleted successfully');
        } catch (error) {
            console.error("❌ Error deleting event:", error);
            const errorMessage = error.response?.data?.message || 'Failed to delete event';
            toast.error(`Delete Error: ${errorMessage}`);
        }
    };

    const handleEditClick = (event) => {
        console.log("✏️ Edit clicked for event:", event._id);
        setSelectedEvent(event);
        setShowEditForm(true);
    };

    const handleViewClick = (event) => {
        setSelectedEvent(event);
        setShowViewModal(true);
    };

    // Filter events for search
    const filteredEvents = events.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.hall?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Show loading if auth is still loading
    if (authLoading || loading) return <AdminLoading />;

    // Check if user is authenticated
    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Authentication Required</h2>
                    <p className="text-gray-400">Please login to manage events</p>
                </div>
            </div>
        );
    }

    // TableRow Component (Inside main component)
    const TableRow = ({ event, index, onView, onEdit, onDelete }) => {
        const eventDate = new Date(event.date);
        const isPastEvent = eventDate < new Date();

        const getStatusColor = () => {
            if (isPastEvent) return 'bg-gray-500/20 text-gray-400';
            if (event.bookingOpen) return 'bg-green-500/20 text-green-400';
            return 'bg-yellow-500/20 text-yellow-400';
        };

        const getStatusText = () => {
            if (isPastEvent) return 'Ended';
            if (event.bookingOpen) return 'Active';
            return 'Closed';
        };

        const handleViewClick = () => {
            onView(event);
        };

        const handleEditClick = () => {
            onEdit(event);
        };

        const handleDeleteClick = () => {
            onDelete(event._id);
        };

        return (
            <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-700/50 transition-colors"
            >
                {/* Event Info */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-600 rounded-lg overflow-hidden">
                            {event.poster ? (
                                <Image
                                    src={event.poster}
                                    alt={event.title}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-600">
                                    <FiCalendar className="text-gray-400 text-xl" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-white truncate">
                                {event.title || 'Untitled Event'}
                                {event.isFeatured && (
                                    <span className="ml-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                                        Featured
                                    </span>
                                )}
                            </h3>
                            <p className="text-gray-400 text-sm truncate">
                                {event.eventType || 'Event'}
                            </p>
                            <p className="text-gray-500 text-xs truncate mt-1">
                                {event.description ? `${event.description.substring(0, 50)}...` : 'No description'}
                            </p>
                        </div>
                    </div>
                </td>

                {/* Date & Time */}
                <td className="px-6 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-white">
                            <FiCalendar size={14} />
                            <span className="text-sm">{eventDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <FiClock size={14} />
                            <span className="text-sm">{event.time}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            {event.duration} mins
                        </div>
                    </div>
                </td>

                {/* Venue */}
                <td className="px-6 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-white">
                            <FiMapPin size={14} />
                            <span className="text-sm">{event.hall || 'No hall'}</span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            {event.screen}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                            {event.location || 'No location'}
                        </div>
                    </div>
                </td>

                {/* Tickets */}
                <td className="px-6 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-green-400">
                            <FiDollarSign size={14} />
                            <span className="text-sm font-semibold">${event.price || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <FiUsers size={14} />
                            <span className="text-sm">
                                {event.availableSeats || 0}/{event.capacity || 0}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500">
                            {event.bookingOpen ? 'Booking Open' : 'Booking Closed'}
                        </div>
                    </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
                        {getStatusText()}
                    </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleViewClick}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors"
                            title="View Event Details"
                        >
                            <FiEye size={16} />
                        </button>
                        <button
                            onClick={handleEditClick}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-600/20 rounded-lg transition-colors"
                            title="Edit Event"
                        >
                            <FiEdit size={16} />
                        </button>
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-colors"
                            title="Delete Event"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                </td>
            </motion.tr>
        );
    };

    // EventDetailsModal Component (Inside main component)
    const EventDetailsModal = ({ event, onClose }) => {
        const eventDate = new Date(event.date);
        const isPastEvent = eventDate < new Date();

        const getStatusColor = () => {
            if (isPastEvent) return 'bg-gray-500 text-white';
            if (event.bookingOpen) return 'bg-green-500 text-white';
            return 'bg-yellow-500 text-white';
        };

        const getStatusText = () => {
            if (isPastEvent) return 'Event Ended';
            if (event.bookingOpen) return 'Booking Open';
            return 'Booking Closed';
        };

        const handleBackdropClick = (e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        };

        const DetailItem = ({ icon, label, value, className = "" }) => (
            <div className={`flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg ${className}`}>
                <div className="text-purple-400 mt-1 flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-400">{label}</p>
                    <p className="text-white font-medium truncate">{value || 'Not specified'}</p>
                </div>
            </div>
        );

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative">
                        {event.poster ? (
                            <div className="h-48 w-full relative">
                                <Image
                                    src={event.poster}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                            </div>
                        ) : (
                            <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                                <FiCalendar className="text-white text-4xl" />
                            </div>
                        )}

                        <div className="absolute top-4 right-4 flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                                {getStatusText()}
                            </span>
                            {event.isFeatured && (
                                <span className="px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-sm font-bold">
                                    Featured
                                </span>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="p-6 pt-4">
                            <h2 className="text-3xl font-bold text-white mb-2">{event.title}</h2>
                            <p className="text-gray-400 text-lg mb-4">{event.eventType}</p>

                            {event.description && (
                                <div className="mb-6">
                                    <p className="text-white leading-relaxed">{event.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <DetailItem
                                    icon={<FiCalendar size={18} />}
                                    label="Date & Time"
                                    value={`${eventDate.toLocaleDateString()} at ${event.time}`}
                                />

                                <DetailItem
                                    icon={<FiClock size={18} />}
                                    label="Duration"
                                    value={`${event.duration} minutes`}
                                />

                                <DetailItem
                                    icon={<FiMapPin size={18} />}
                                    label="Location"
                                    value={event.location}
                                />

                                <DetailItem
                                    icon={<FiTag size={18} />}
                                    label="Hall & Screen"
                                    value={`${event.hall} - ${event.screen}`}
                                />
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <DetailItem
                                    icon={<FiDollarSign size={18} />}
                                    label="Ticket Price"
                                    value={`$${event.price}`}
                                />

                                <DetailItem
                                    icon={<FiUsers size={18} />}
                                    label="Capacity"
                                    value={`${event.availableSeats || 0} / ${event.capacity || 0} seats available`}
                                />

                                <DetailItem
                                    icon={<FiBarChart2 size={18} />}
                                    label="Event Type"
                                    value={event.eventType}
                                />

                                <DetailItem
                                    icon={<FiInfo size={18} />}
                                    label="Booking Status"
                                    value={event.bookingOpen ? 'Open for bookings' : 'Bookings closed'}
                                    className={event.bookingOpen ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}
                                />
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <FiInfo className="text-blue-400" />
                                Event Summary
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="bg-gray-700/50 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-white">{event.duration}</p>
                                    <p className="text-sm text-gray-400">Minutes</p>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-white">${event.price}</p>
                                    <p className="text-sm text-gray-400">Per Ticket</p>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-white">{event.capacity}</p>
                                    <p className="text-sm text-gray-400">Total Seats</p>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-3">
                                    <p className="text-2xl font-bold text-white">{event.availableSeats}</p>
                                    <p className="text-sm text-gray-400">Available</p>
                                </div>
                            </div>
                        </div>

                        {/* Created Info */}
                        {event.createdAt && (
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-500">
                                    Event created on {new Date(event.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-700 bg-gray-800/30">
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">Events Management</h1>
                    <p className="text-gray-400">Manage all your events in one place</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
                >
                    <FiPlus />
                    Create Event
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search events by title, type, location, or hall..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Events Table */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Event</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date & Time</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Venue</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tickets</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredEvents.map((event, index) => (
                                <TableRow
                                    key={event._id}
                                    event={event}
                                    index={index}
                                    onView={handleViewClick}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteEvent}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty States */}
                {filteredEvents.length === 0 && events.length > 0 && (
                    <div className="text-center py-12">
                        <FiSearch className="mx-auto text-gray-400 text-4xl mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No events found</h3>
                        <p className="text-gray-400">Try adjusting your search terms</p>
                    </div>
                )}

                {events.length === 0 && (
                    <div className="text-center py-12">
                        <FiCalendar className="mx-auto text-gray-400 text-4xl mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No events yet</h3>
                        <p className="text-gray-400">Create your first event to get started</p>
                    </div>
                )}
            </div>

            {/* Use Separate Form Components */}
            {showCreateForm && (
                <EventCreateForm
                    onClose={() => setShowCreateForm(false)}
                    onSubmit={handleCreateEvent}
                />
            )}

            {showEditForm && selectedEvent && (
                <EventEditForm
                    event={selectedEvent}
                    onClose={() => {
                        setShowEditForm(false);
                        setSelectedEvent(null);
                    }}
                    onSubmit={handleEditEvent}
                />
            )}

            {showViewModal && selectedEvent && (
                <EventDetailsModal
                    event={selectedEvent}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedEvent(null);
                    }}
                />
            )}
        </div>
    );
}