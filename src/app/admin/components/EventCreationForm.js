"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiCalendar,
    FiMapPin,
    FiDollarSign,
    FiSave,
    FiX,
    FiImage,
} from "react-icons/fi";
import toast from "react-hot-toast";
import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

const EventCreationForm = ({ onClose, onSubmit }) => {
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
        earlyBirdDiscount: 0,
        earlyBirdEnd: "",
        guestNames: [],
        performers: [],
        hostedBy: "",
        sponsors: [],
        tags: [],
        isFeatured: false,
    });

    const [loading, setLoading] = useState(false);
    const [posterError, setPosterError] = useState("");

    // Use ref to track submission state
    const isSubmitting = useRef(false);
    const formRef = useRef(null);

    // : Validate Poster URL
    const validatePosterUrl = (url) => {
        if (!url) return "Poster URL is required";
        if (url.length < 5) return "URL is too short";
        try {
            new URL(url);
            return "";
        } catch {
            return "Please enter a valid URL";
        }
    };

    
    useEffect(() => {
        return () => {
            isSubmitting.current = false;
        };
    }, []);

    // Prevent 
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading || isSubmitting.current) {
            // console.log(" Already submitting, ignoring...");
            return;
        }

        isSubmitting.current = true;
        setLoading(true);

        try {
            // console.log(" Current User from Auth:", user);

            if (!user || !user._id) {
                toast.error("User not authenticated. Please login again.");
                return;
            }

            const posterValidation = validatePosterUrl(formData.poster);
            if (posterValidation) {
                setPosterError(posterValidation);
                toast.error(posterValidation);
                return;
            }

            const submitData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                eventType: formData.eventType,
                date: formData.date,
                time: formData.time,
                duration: parseInt(formData.duration) || 120,
                poster: formData.poster.trim(),
                hall: formData.hall.trim(),
                screen: formData.screen.trim(),
                location: formData.location.trim(),
                capacity: parseInt(formData.capacity) || 100,
                price: parseFloat(formData.price) || 0,
                availableSeats: parseInt(formData.availableSeats) || 100,
                bookingOpen: formData.bookingOpen,
                guestNames: formData.guestNames.map(g => g.trim()),
                performers: formData.performers.map(p => p.trim()),
                hostedBy: formData.hostedBy?.trim() || '',
                tags: formData.tags.map(t => t.trim()),
                isFeatured: formData.isFeatured,
                createdBy: user._id
            };

            console.log("📤 Sending event data:", submitData);

            const response = await axiosSecure.post("/api/events", submitData);
            console.log("✅ Event created successfully:", response.data);

            toast.success("Event created successfully!");

          
            if (onSubmit && typeof onSubmit === 'function') {
                onSubmit(response.data.data);
            }

            // Close modal
            onClose();

        } catch (error) {
            console.error("❌ Error creating event:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create event";
            toast.error(errorMessage);
        } finally {
            // Reset states.....................
            setLoading(false);
            isSubmitting.current = false;
        }
    };

    const handlePosterChange = (e) => {
        const url = e.target.value;
        setFormData((prev) => ({ ...prev, poster: url }));
        setPosterError(validatePosterUrl(url));
    };


    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Prevent backdrop click
            >
                <div className="p-6 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white"
                            disabled={loading}
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                </div>
{/* from */}
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6"
                >
                    {/*  Basic Info */}
                    <Section title="Event Basic Info" icon={<FiCalendar />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Event Title *"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, title: e.target.value }))
                                }
                                required
                                placeholder="Enter event title"
                                disabled={loading}
                            />
                            <Select
                                label="Event Type *"
                                value={formData.eventType}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, eventType: e.target.value }))
                                }
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
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, description: e.target.value }))
                            }
                            required
                            placeholder="Describe your event..."
                            disabled={loading}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                type="date"
                                label="Date *"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, date: e.target.value }))
                                }
                                required
                                min={new Date().toISOString().split("T")[0]}
                                disabled={loading}
                            />
                            <Input
                                type="time"
                                label="Time *"
                                value={formData.time}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, time: e.target.value }))
                                }
                                required
                                disabled={loading}
                            />
                            <Input
                                type="number"
                                label="Duration (minutes) *"
                                value={formData.duration}
                                onChange={(e) =>
                                    setFormData((p) => ({
                                        ...p,
                                        duration: parseInt(e.target.value) || 120,
                                    }))
                                }
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
                            {formData.poster && !posterError && (
                                <p className="text-green-400 text-sm mt-1">✓ Valid URL</p>
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

                    {/*  Venue */}
                    <Section title="Venue Information" icon={<FiMapPin />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Hall Name *"
                                value={formData.hall}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, hall: e.target.value }))
                                }
                                required
                                placeholder="Main Hall"
                                disabled={loading}
                            />
                            <Input
                                label="Screen *"
                                value={formData.screen}
                                onChange={(e) =>
                                    setFormData((p) => ({ ...p, screen: e.target.value }))
                                }
                                required
                                placeholder="Screen 1"
                                disabled={loading}
                            />
                        </div>
                        <Input
                            label="Location *"
                            value={formData.location}
                            onChange={(e) =>
                                setFormData((p) => ({ ...p, location: e.target.value }))
                            }
                            required
                            placeholder="123 Main Street"
                            disabled={loading}
                        />
                        <Input
                            type="number"
                            label="Capacity *"
                            value={formData.capacity}
                            onChange={(e) =>
                                setFormData((p) => ({
                                    ...p,
                                    capacity: parseInt(e.target.value) || 100,
                                }))
                            }
                            required
                            min="1"
                            disabled={loading}
                        />
                    </Section>

                    {/*  Ticket & Pricing */}
                    <Section title="Ticket & Pricing" icon={<FiDollarSign />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="number"
                                label="Ticket Price *"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData((p) => ({
                                        ...p,
                                        price: parseFloat(e.target.value) || 0,
                                    }))
                                }
                                required
                                min="0"
                                step="0.01"
                                disabled={loading}
                            />
                            <Input
                                type="number"
                                label="Available Seats *"
                                value={formData.availableSeats}
                                onChange={(e) =>
                                    setFormData((p) => ({
                                        ...p,
                                        availableSeats: parseInt(e.target.value) || 100,
                                    }))
                                }
                                required
                                min="1"
                                disabled={loading}
                            />
                        </div>
                    </Section>

                    {/* Submit Buttons */}
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
                            disabled={loading || posterError || isSubmitting.current}
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

// Reusable Components
const Input = ({ label, icon, disabled, ...props }) => (
    <div>
        {label && (
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
        )}
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {icon}
                </div>
            )}
            <input
                className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${icon ? "pl-10" : ""
                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={disabled}
                {...props}
            />
        </div>
    </div>
);

const TextArea = ({ label, disabled, ...props }) => (
    <div>
        {label && (
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
        )}
        <textarea
            className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] ${disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            disabled={disabled}
            {...props}
        />
    </div>
);

const Select = ({ label, options, disabled, ...props }) => (
    <div>
        {label && (
            <label className="block text-sm font-medium text-gray-300 mb-2">
                {label}
            </label>
        )}
        <select
            className={`w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
            disabled={disabled}
            {...props}
        >
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

const Section = ({ title, icon, children }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        {children}
    </div>
);

export default EventCreationForm;