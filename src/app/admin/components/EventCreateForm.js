// components/events/EventCreateForm.jsx
"use client";
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiSave, FiImage, FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiInfo, FiTag, FiUser, FiBarChart2, FiPlus } from 'react-icons/fi';
import { useAuth } from "@/app/context/AuthContext";
import Image from 'next/image';
import toast from 'react-hot-toast';

const EventCreateForm = ({ onClose, onSubmit }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventType: "Movie Premiere",
        date: "",
        time: "",
        duration: 120,
        poster: "",
        hall: "",
        screen: "Screen 1",
        location: "",
        capacity: 100,
        price: 0,
        availableSeats: 100,
        bookingOpen: true,
        isFeatured: false,
        guestNames: [],
        performers: [],
        hostedBy: "",
        tags: [],
    });
    const [loading, setLoading] = useState(false);
    const [posterError, setPosterError] = useState("");
    const [newGuest, setNewGuest] = useState("");
    const [newPerformer, setNewPerformer] = useState("");
    const [newTag, setNewTag] = useState("");

    // useCallback দিয়ে event handlers optimize করুন
    const handleInputChange = useCallback((field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleNumberInputChange = useCallback((field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value === '' ? '' : Number(value)
        }));
    }, []);

    const handleCheckboxChange = useCallback((field) => (e) => {
        const value = e.target.checked;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

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
                createdBy: user._id,
                userEmail: user.email || "",
                userName: user.name || user.username || ""
            };

            await onSubmit(submitData);
        } catch (error) {
            console.error("❌ Error creating event:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePosterChange = useCallback((e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, poster: url }));
        if (!url) {
            setPosterError("Poster URL is required");
        } else {
            setPosterError("");
        }
    }, []);

    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    // Array management functions with useCallback
    const addGuest = useCallback(() => {
        if (newGuest.trim() && !formData.guestNames.includes(newGuest.trim())) {
            setFormData(prev => ({
                ...prev,
                guestNames: [...prev.guestNames, newGuest.trim()]
            }));
            setNewGuest("");
        }
    }, [newGuest, formData.guestNames]);

    const removeGuest = useCallback((index) => {
        setFormData(prev => ({
            ...prev,
            guestNames: prev.guestNames.filter((_, i) => i !== index)
        }));
    }, []);

    const addPerformer = useCallback(() => {
        if (newPerformer.trim() && !formData.performers.includes(newPerformer.trim())) {
            setFormData(prev => ({
                ...prev,
                performers: [...prev.performers, newPerformer.trim()]
            }));
            setNewPerformer("");
        }
    }, [newPerformer, formData.performers]);

    const removePerformer = useCallback((index) => {
        setFormData(prev => ({
            ...prev,
            performers: prev.performers.filter((_, i) => i !== index)
        }));
    }, []);

    const addTag = useCallback(() => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag("");
        }
    }, [newTag, formData.tags]);

    const removeTag = useCallback((index) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    }, []);

    const handleArrayInputKeyPress = useCallback((e, addFunction) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFunction();
        }
    }, []);

    // Reusable form components with React.memo
    const Input = useCallback(({ label, value, onChange, ...props }) => (
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
    ), []);

    const TextArea = useCallback(({ label, value, onChange, ...props }) => (
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
    ), []);

    const Select = useCallback(({ label, value, onChange, options, ...props }) => (
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
    ), []);

    const ArrayInput = useCallback(({
        label,
        items,
        newItem,
        setNewItem,
        onAdd,
        onRemove,
        placeholder
    }) => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => handleArrayInputKeyPress(e, onAdd)}
                    placeholder={placeholder}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                    type="button"
                    onClick={onAdd}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <FiPlus />
                </button>
            </div>
            {items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                        >
                            {item}
                            <button
                                type="button"
                                onClick={() => onRemove(index)}
                                className="text-purple-400 hover:text-purple-200"
                            >
                                <FiX size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    ), [handleArrayInputKeyPress]);

    const Section = useCallback(({ title, icon, children }) => (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
                <div className="text-purple-400">{icon}</div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            {children}
        </div>
    ), []);

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
                            Create New Event
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={loading}>
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Event Basic Info Section */}
                    <Section title="Event Basic Info" icon={<FiCalendar />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Event Title *"
                                value={formData.title}
                                onChange={handleInputChange('title')}
                                required
                                placeholder="Enter event title"
                                disabled={loading}
                            />
                            <Select
                                label="Event Type *"
                                value={formData.eventType}
                                onChange={handleInputChange('eventType')}
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
                            onChange={handleInputChange('description')}
                            required
                            placeholder="Describe your event..."
                            disabled={loading}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                type="date"
                                label="Date *"
                                value={formData.date}
                                onChange={handleInputChange('date')}
                                required
                                min={new Date().toISOString().split("T")[0]}
                                disabled={loading}
                            />
                            <Input
                                type="time"
                                label="Time *"
                                value={formData.time}
                                onChange={handleInputChange('time')}
                                required
                                disabled={loading}
                            />
                            <Input
                                type="number"
                                label="Duration (minutes) *"
                                value={formData.duration}
                                onChange={handleNumberInputChange('duration')}
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

                    {/* Venue & Location Section */}
                    <Section title="Venue & Location" icon={<FiMapPin />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Hall *"
                                value={formData.hall}
                                onChange={handleInputChange('hall')}
                                required
                                placeholder="Enter hall name"
                                disabled={loading}
                            />
                            <Input
                                label="Screen *"
                                value={formData.screen}
                                onChange={handleInputChange('screen')}
                                required
                                placeholder="Enter screen number/name"
                                disabled={loading}
                            />
                            <Input
                                label="Location *"
                                value={formData.location}
                                onChange={handleInputChange('location')}
                                required
                                placeholder="Enter event location"
                                disabled={loading}
                            />
                        </div>
                    </Section>

                    {/* Ticket & Capacity Section */}
                    <Section title="Ticket & Capacity" icon={<FiUsers />}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                type="number"
                                label="Capacity *"
                                value={formData.capacity}
                                onChange={handleNumberInputChange('capacity')}
                                required
                                min="1"
                                max="10000"
                                disabled={loading}
                            />
                            <Input
                                type="number"
                                label="Available Seats *"
                                value={formData.availableSeats}
                                onChange={handleNumberInputChange('availableSeats')}
                                required
                                min="0"
                                max={formData.capacity}
                                disabled={loading}
                            />
                            <Input
                                type="number"
                                step="0.01"
                                label="Price ($) *"
                                value={formData.price}
                                onChange={handleNumberInputChange('price')}
                                required
                                min="0"
                                disabled={loading}
                            />
                        </div>
                    </Section>

                    {/* Additional Information Section */}
                    <Section title="Additional Information" icon={<FiInfo />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Hosted By"
                                value={formData.hostedBy}
                                onChange={handleInputChange('hostedBy')}
                                placeholder="Name of the host/organizer"
                                disabled={loading}
                            />

                            <ArrayInput
                                label="Guest Names"
                                items={formData.guestNames}
                                newItem={newGuest}
                                setNewItem={setNewGuest}
                                onAdd={addGuest}
                                onRemove={removeGuest}
                                placeholder="Add guest name"
                            />

                            <ArrayInput
                                label="Performers"
                                items={formData.performers}
                                newItem={newPerformer}
                                setNewItem={setNewPerformer}
                                onAdd={addPerformer}
                                onRemove={removePerformer}
                                placeholder="Add performer name"
                            />

                            <ArrayInput
                                label="Tags"
                                items={formData.tags}
                                newItem={newTag}
                                setNewItem={setNewTag}
                                onAdd={addTag}
                                onRemove={removeTag}
                                placeholder="Add tag"
                            />
                        </div>
                    </Section>

                    {/* Event Settings Section */}
                    <Section title="Event Settings" icon={<FiBarChart2 />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Booking Open
                                    </label>
                                    <p className="text-sm text-gray-400">
                                        Allow users to book tickets for this event
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.bookingOpen}
                                        onChange={handleCheckboxChange('bookingOpen')}
                                        className="sr-only peer"
                                        disabled={loading}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Featured Event
                                    </label>
                                    <p className="text-sm text-gray-400">
                                        Highlight this event as featured
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={handleCheckboxChange('isFeatured')}
                                        className="sr-only peer"
                                        disabled={loading}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>
                        </div>
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
                                    Creating...
                                </span>
                            ) : (
                                <>
                                    <FiSave />
                                    Create Event
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EventCreateForm;