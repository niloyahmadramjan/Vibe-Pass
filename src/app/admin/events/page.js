// app/admin/events/page.jsx - CLEAN VERSION
"use client";
import { useState, useEffect } from 'react';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import { motion } from 'framer-motion';
import {
    FiPlus,
    FiCalendar,
    FiUsers,
    FiDollarSign,
    FiEdit,
    FiTrash2,
    FiEye,
    FiSearch,
    FiClock,
    FiMapPin
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLoading from '../components/AdminLoading';
import { useAuth } from "@/app/context/AuthContext";
import EventCreationForm from '../components/EventCreationForm';
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
            toast.success('Event created successfully!');
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
            toast.success('Event updated successfully!');
            return true;
        } catch (error) {
            console.error("❌ Error updating event:", error);
            toast.error(error.response?.data?.message || 'Failed to update event');
            return false;
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await axiosSecure.delete(`/api/events/${eventId}`);
            setEvents(prev => prev.filter(event => event._id !== eventId));
            toast.success('Event deleted successfully');
        } catch (error) {
            console.error("❌ Error deleting event:", error);
            toast.error('Failed to delete event');
        }
    };

    const handleEditClick = (event) => {
        setSelectedEvent(event);
        setShowEditForm(true);
    };

    const handleViewClick = (event) => {
        console.log("View event:", event);
        toast.success(`Viewing: ${event.title}`);
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

            {/* Events Table .................................*/}
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
                    onClose={() => {
                        console.log("🔒 Closing create form");
                        setShowCreateForm(false);
                    }}
                    onSubmit={(newEvent) => {
                        console.log("✅ Form submitted with:", newEvent);
                        // This will only be called once
                        handleCreateEvent(newEvent);
                    }}
                />
            )}

            {/* Edit Event Modal - You need to create EventEditForm component */}
            {showEditForm && selectedEvent && (
                <EventCreationForm
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Upcoming': return 'bg-green-500/20 text-green-400';
            case 'Ongoing': return 'bg-blue-500/20 text-blue-400';
            case 'Ended': return 'bg-gray-500/20 text-gray-400';
            case 'Cancelled': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusText = (status) => {
        if (isPastEvent && status === 'Upcoming') return 'Ended';
        return status || 'Upcoming';
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
                    <div className="flex-shrink-0 w-24 h-4 bg-gray-600 rounded-lg flex items-center justify-center">
                        {event.poster ? (
                            <Image
                                src={event.poster}
                                alt={event.title}
                                width={100}
                                height={100}
                                className="rounded-lg object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : (
                            <FiCalendar className="text-gray-400 text-xl" />
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
                        <span className="text-sm font-semibold">{event.price || 0}</span>
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                    {getStatusText(event.status)}
                </span>
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    {/* View Button */}
                    <button
                        onClick={() => onView(event)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors"
                        title="View Event"
                    >
                        <FiEye size={16} />
                    </button>

                    {/* Edit Button */}
                    <button
                        onClick={() => onEdit(event)}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-600/20 rounded-lg transition-colors"
                        title="Edit Event"
                    >
                        <FiEdit size={16} />
                    </button>

                    {/* Delete Button */}
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