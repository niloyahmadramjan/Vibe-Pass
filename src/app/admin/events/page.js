"use client";
import { useState, useEffect } from 'react';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import { motion } from 'framer-motion';
import {FiPlus, FiCalendar,FiUsers,FiDollarSign, FiEdit,FiTrash2,FiEye,  FiSearch, FiClock,FiMapPin,FiSave, FiX,FiImage,FiUpload} from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLoading from '../components/AdminLoading';
import { useAuth } from "@/app/context/AuthContext";
import Image from 'next/image';

export default function EventsManagement() {
    const { user, loading: authLoading } = useAuth();
    const [events, setEvents] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
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

    const handleCreateEvent = async (eventData) => {
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
    };

    const handleEditEvent = async (eventId, updatedData) => {
        try {

            const response = await axiosSecure.put(`/api/events/${eventId}`, updatedData);
            const updatedEvent = response.data.data || response.data;

            setEvents(prev => prev.map(event =>
                event._id === eventId ? updatedEvent : event
            ));

            toast.success(' Event updated successfully!');
            setShowEditForm(false);
            setSelectedEvent(null);
            return true;
        } catch (error) {
            console.error(" Error updating event:", error);
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
        toast.success(
            <div className="flex flex-col">
                <span className="font-semibold">👀 Viewing: {event.title}</span>
                <span className="text-sm opacity-90">
                    {event.eventType} • {new Date(event.date).toLocaleDateString()} • {event.location}
                </span>
            </div>,
            { duration: 3000 }
        );
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

            {/* Create Event Modal */}
            {showCreateForm && (
                <EventCreationForm
                    onClose={() => setShowCreateForm(false)}
                    onSubmit={handleCreateEvent}
                />
            )}

            {/* Edit Event Modal */}
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
        </div>
    );
}

// Table Row Component
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
                        onClick={() => onView(event)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors"
                        title="View Event"
                    >
                        <FiEye size={16} />
                    </button>
                    <button
                        onClick={() => onEdit(event)}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-600/20 rounded-lg transition-colors"
                        title="Edit Event"
                    >
                        <FiEdit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(event._id)}
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

// Event Creation Form Component
const EventCreationForm = ({ onClose, onSubmit, event }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: event?.title || "",
        description: event?.description || "",
        eventType: event?.eventType || "Movie Premiere",
        date: event?.date || "",
        time: event?.time || "",
        duration: event?.duration || 120,
        poster: event?.poster || "",
        hall: event?.hall || "",
        screen: event?.screen || "Screen 1",
        location: event?.location || "",
        capacity: event?.capacity || 100,
        price: event?.price || 0,
        availableSeats: event?.availableSeats || 100,
        bookingOpen: event?.bookingOpen ?? true,
        isFeatured: event?.isFeatured ?? false,
    });
    const [loading, setLoading] = useState(false);
    const [posterError, setPosterError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!user || !user._id) {
            toast.error("User not authenticated. Please login again.");
            return;
        }

        setLoading(true);

        try {
            const submitData = {
                ...formData,
                title: formData.title.trim(),
                description: formData.description.trim(),
                duration: parseInt(formData.duration) || 120,
                hall: formData.hall.trim(),
                screen: formData.screen.trim(),
                location: formData.location.trim(),
                capacity: parseInt(formData.capacity) || 100,
                price: parseFloat(formData.price) || 0,
                availableSeats: parseInt(formData.availableSeats) || 100,
                createdBy: user._id
            };

            await onSubmit(submitData);
        } catch (error) {
            console.error("❌ Error submitting event:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePosterChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, poster: url }));
        if (!url) {
            setPosterError("Poster URL is required");
        } else {
            setPosterError("");
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const Input = ({ label, value, onChange, ...props }) => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <input
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                {...props}
            />
        </div>
    );

    const TextArea = ({ label, value, onChange, ...props }) => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <textarea
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 resize-vertical min-h-[100px]"
                {...props}
            />
        </div>
    );

    const Select = ({ label, value, onChange, options, ...props }) => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <select
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                {...props}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );

    const Section = ({ title, icon, children }) => (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
                <div className="text-purple-400">{icon}</div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">
                            {event ? 'Edit Event' : 'Create New Event'}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={loading}>
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <Section title="Event Basic Info" icon={<FiCalendar />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Event Title *"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                required
                                placeholder="Enter event title"
                                disabled={loading}
                            />
                            <Select
                                label="Event Type *"
                                value={formData.eventType}
                                onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                                options={[
                                    "Movie Premiere",
                                    "Fan Meetup",
                                    "Concert",
                                    "Special Screening",
                                    "Film Festival",
                                    "Award Show",
                                    "Charity Event",
                                ]}
                                disabled={loading}
                            />
                        </div>

                        <TextArea
                            label="Description *"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            required
                            placeholder="Describe your event..."
                            disabled={loading}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                type="date"
                                label="Date *"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                required
                                min={new Date().toISOString().split("T")[0]}
                                disabled={loading}
                            />
                            <Input
                                type="time"
                                label="Time *"
                                value={formData.time}
                                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                required
                                disabled={loading}
                            />
                            <Input
                                type="number"
                                label="Duration (minutes) *"
                                value={formData.duration}
                                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 120 }))}
                                required
                                min="30"
                                max="480"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <Input
                                label="Poster URL *"
                                value={formData.poster}
                                onChange={handlePosterChange}
                                placeholder="https://example.com/poster.jpg"
                                required
                                icon={<FiImage />}
                                disabled={loading}
                            />
                            {posterError && (
                                <p className="text-red-400 text-sm mt-1">{posterError}</p>
                            )}
                        </div>

                        {formData.poster && !posterError && (
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Poster Preview
                                </label>
                                <div className="border border-gray-600 rounded-lg overflow-hidden max-w-xs">
                                    <Image
                                        src={formData.poster}
                                        alt="Poster preview"
                                        width={320}
                                        height={200}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/320x200/1f2937/6b7280?text=Invalid+Image';
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </Section>

                    <div className="flex gap-4 pt-6 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || posterError}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    {event ? 'Updating...' : 'Creating...'}
                                </span>
                            ) : (
                                <>
                                    <FiSave />
                                    {event ? 'Update Event' : 'Create Event'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

// Event Edit Form Component (uses the same form as creation)
const EventEditForm = ({ event, onClose, onSubmit }) => {
    return (
        <EventCreationForm
            event={event}
            onClose={onClose}
            onSubmit={(updatedData) => onSubmit(event._id, updatedData)}
        />
    );
};