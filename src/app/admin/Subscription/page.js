// components/SubscriptionTable.js
'use client'
import { useState, useEffect } from 'react'
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure'
import { motion } from 'framer-motion'
import StarCardtDeshbord from "../components/StartCard"
import AdminLoading from '../components/AdminLoading'
import Swal from 'sweetalert2'

// Icons
import {
    FaUsers, FaChartLine, FaSearch, FaFileAlt, FaMapMarkerAlt,
    FaEdit, FaTrash, FaSave, FaTimes, FaEnvelope, FaGlobe,
    FaMapPin, FaCalendar, FaClock, FaExclamationTriangle, FaCheck,
    FaChevronLeft, FaChevronRight, FaEye, FaEyeSlash
} from 'react-icons/fa'
import { Send } from 'lucide-react'

// Bangladesh divisions
const BANGLADESH_DIVISIONS = [
    'All Regions', 'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna',
    'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
]

export default function SubscriptionTable() {
    // State
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState(null)
    const [editEmail, setEditEmail] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(8)
    const [notification, setNotification] = useState({ show: false, message: '', type: '' })
    const [notificationModalOpen, setNotificationModalOpen] = useState(false)
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState('All Regions')
    const [showDetails, setShowDetails] = useState(null)

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type })
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000)
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchSubscriptions()
    }, [])

    // Fetch subscriptions from API
    const fetchSubscriptions = async () => {
        try {
            setLoading(true)
            const response = await axiosSecure.get('/api/newsletter')

            if (response.data?.success) {
                setSubscriptions(response.data.data || [])
            } else {
                setSubscriptions(response.data || [])
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error)
            showNotification('Failed to load subscriptions', 'error')
        } finally {
            setLoading(false)
        }
    }

    // Edit subscription
    const handleEdit = (subscription) => {
        setEditingId(subscription._id)
        setEditEmail(subscription.email)
    }

    // Update subscription
    const handleUpdate = async (id) => {
        if (!editEmail.trim()) {
            showNotification('Email cannot be empty', 'error')
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
            showNotification('Please enter a valid email address', 'error')
            return
        }

        try {
            const response = await axiosSecure.put(`/api/newsletter/subscribe/${id}`, {
                email: editEmail.trim()
            })

            if (response.data.success) {
                const updatedData = response.data.data
                setSubscriptions(prev =>
                    prev.map(sub =>
                        sub._id === id ? { ...sub, ...updatedData } : sub
                    )
                )
                setEditingId(null)
                setEditEmail('')
                showNotification('Email updated successfully!')
            } else {
                showNotification(response.data.message || 'Failed to update email', 'error')
            }
        } catch (error) {
            console.error('Error updating subscription:', error)
            const errorMessage = error.response?.data?.message || 'Failed to update email'
            showNotification(errorMessage, 'error')
        }
    }

    // Cancel editing
    const handleCancel = () => {
        setEditingId(null)
        setEditEmail('')
    }

    // Delete subscription
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete this subscription?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })

        if (!result.isConfirmed) return

        try {
            const response = await axiosSecure.delete(`/api/newsletter/subscribe/${id}`)

            if (response.data.success) {
                setSubscriptions(prev => prev.filter(sub => sub._id !== id))
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Subscription deleted successfully!',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                })
            } else {
                throw new Error(response.data.message)
            }
        } catch (error) {
            console.error('Error deleting subscription:', error)
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Failed to delete subscription',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            })
        }
    }

    // Send announcement
    const handleSendAnnouncement = async (e) => {
        e.preventDefault()
        setSending(true)

        try {
            const payload = {
                subject: subject.trim(),
                message: message.trim()
            }

            if (selectedRegion !== 'All Regions') {
                payload.region = selectedRegion
            }

            const response = await axiosSecure.post('/api/announcemnet/send', payload)

            if (response.data.success) {
                showNotification(`Announcement sent successfully to ${response.data.data.recipients} subscribers`)
                setNotificationModalOpen(false)
                setSubject('')
                setMessage('')
                setSelectedRegion('All Regions')
            } else {
                showNotification(response.data.message || 'Failed to send announcement', 'error')
            }
        } catch (error) {
            console.error('Error sending announcement:', error)
            const errorMessage = error.response?.data?.message || 'Failed to send announcement'
            showNotification(errorMessage, 'error')
        } finally {
            setSending(false)
        }
    }

    // Filter subscriptions based on search
    const filteredSubscriptions = subscriptions.filter(sub =>
        sub.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.country?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Get region stats
    const regionStats = filteredSubscriptions.reduce((acc, sub) => {
        const region = sub.region || 'Unknown'
        acc[region] = (acc[region] || 0) + 1
        return acc
    }, {})

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentSubscriptions = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage)

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Get time ago
    const getTimeAgo = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

        if (diffInHours < 1) return 'Just now'
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
        return formatDate(dateString)
    }

    // Toggle details
    const toggleDetails = (id) => {
        setShowDetails(showDetails === id ? null : id)
    }

    if (loading) return <AdminLoading />

    return (
        <div className="min-h-screen  p-4 md:p-6">

            {/* Notification */}
            {notification.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                        } text-white`}
                >
                    <div className="flex items-center space-x-2">
                        {notification.type === 'error' ? (
                            <FaExclamationTriangle className="w-4 h-4" />
                        ) : (
                            <FaCheck className="w-4 h-4" />
                        )}
                        <span className="text-sm">{notification.message}</span>
                    </div>
                </motion.div>
            )}

            {/* Announcement Modal */}
            {notificationModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1b1e2b] rounded-2xl w-full max-w-md border border-[#2a2c36] shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#2a2c36]">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <FaEnvelope className="text-purple-400" />
                                Send Announcement
                            </h2>
                            <button
                                onClick={() => setNotificationModalOpen(false)}
                                className="p-1 hover:bg-[#2a2c36] rounded transition-colors"
                            >
                                <FaTimes className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSendAnnouncement} className="p-4 space-y-4">

                            {/* Region Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-purple-400" />
                                    Send to Region
                                </label>
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#2a2c36] border border-[#3a3c46] rounded text-white focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                >
                                    {BANGLADESH_DIVISIONS.map(division => (
                                        <option key={division} value={division}>
                                            {division} {division !== 'All Regions' && `(${regionStats[division] || 0})`}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-400 mt-1">
                                    Selected: {selectedRegion === 'All Regions'
                                        ? `All subscribers (${filteredSubscriptions.length})`
                                        : `${selectedRegion} region (${regionStats[selectedRegion] || 0} subscribers)`
                                    }
                                </p>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Enter subject"
                                    className="w-full px-3 py-2 bg-[#2a2c36] border border-[#3a3c46] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Message
                                </label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write your message"
                                    rows="4"
                                    className="w-full px-3 py-2 bg-[#2a2c36] border border-[#3a3c46] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setNotificationModalOpen(false)}
                                    className="px-3 py-2 text-gray-300 hover:text-white border border-[#3a3c46] rounded hover:bg-[#2a2c36] transition-colors text-sm flex items-center gap-2"
                                >
                                    <FaTimes className="w-3 h-3" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded text-white font-semibold transition-all duration-300 disabled:opacity-50 text-sm"
                                >
                                    {sending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={14} />
                                            <span>Send</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="w-full mx-auto ">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 md:mb-8"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Subscription Management
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg">
                        Manage your newsletter subscribers and their email preferences
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                    <StarCardtDeshbord
                        title="Total Subscribers"
                        value={subscriptions.length}
                        subtitle="All time subscribers"
                        icon={<FaUsers className="text-white text-lg md:text-xl" />}
                        delay={0.1}
                    />
                    <StarCardtDeshbord
                        title="Active This Month"
                        value={subscriptions.filter(sub => {
                            if (!sub.createdAt) return false
                            const subDate = new Date(sub.createdAt)
                            const monthAgo = new Date()
                            monthAgo.setMonth(monthAgo.getMonth() - 1)
                            return subDate > monthAgo
                        }).length}
                        subtitle="New subscriptions"
                        icon={<FaChartLine className="text-white text-lg md:text-xl" />}
                        delay={0.2}
                    />
                    <StarCardtDeshbord
                        title="Search Results"
                        value={filteredSubscriptions.length}
                        subtitle="Filtered subscribers"
                        icon={<FaSearch className="text-white text-lg md:text-xl" />}
                        delay={0.3}
                    />
                    <StarCardtDeshbord
                        title="Regions"
                        value={Object.keys(regionStats).length}
                        subtitle="Different regions"
                        icon={<FaMapMarkerAlt className="text-white text-lg md:text-xl" />}
                        delay={0.4}
                    />
                </div>

                {/* Region Statistics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-700/50 mb-6"
                >
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FaGlobe className="text-purple-400" />
                        Subscribers by Region
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
                        {Object.entries(regionStats)
                            .sort(([, a], [, b]) => b - a)
                            .map(([region, count]) => (
                                <div key={region} className="text-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                                    <div className="text-white font-semibold text-sm truncate">
                                        {region || 'Unknown'}
                                    </div>
                                    <div className="text-purple-400 font-bold text-lg">
                                        {count}
                                    </div>
                                    <div className="text-gray-400 text-xs">subscribers</div>
                                </div>
                            ))}
                    </div>
                </motion.div>

                {/* Search and Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-700/50 mb-6"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">

                        {/* Search Input */}
                        <div className="relative w-full lg:w-64">
                            <input
                                type="text"
                                placeholder="Search by email, city, region..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-full px-4 py-2 pl-10 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-700/50 text-white placeholder-gray-400 text-sm"
                            />
                            <FaSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>

                        {/* Send Announcement Button */}
                        <button
                            onClick={() => setNotificationModalOpen(true)}
                            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25"
                        >
                            <Send size={16} />
                            <span>Send Announcement</span>
                        </button>
                    </div>
                </motion.div>

                {/* Subscriptions Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
                >

                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-b border-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Subscriber
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Subscription Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {currentSubscriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center">
                                                    <FaFileAlt className="w-8 h-8 text-gray-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-1">
                                                        No subscribers found
                                                    </h3>
                                                    <p className="text-gray-400">
                                                        {searchTerm ? 'Try adjusting your search terms' : 'No subscribers in your list yet'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    currentSubscriptions.map((subscription, index) => (
                                        <motion.tr
                                            key={subscription._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="hover:bg-gray-700/30 transition-colors duration-150"
                                        >
                                            {/* Email Column */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                                        {subscription.email?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        {editingId === subscription._id ? (
                                                            <input
                                                                type="email"
                                                                value={editEmail}
                                                                onChange={(e) => setEditEmail(e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white"
                                                                placeholder="Enter email address"
                                                                autoFocus
                                                            />
                                                        ) : (
                                                            <div>
                                                                <p className="text-sm font-semibold text-white truncate">
                                                                    {subscription.email || 'No email'}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">Subscriber</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Location Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaMapPin className="text-purple-400 text-sm" />
                                                    <div className="text-sm text-white font-medium">
                                                        {subscription.city && `${subscription.city}, `}
                                                        {subscription.region || 'Unknown Region'}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <FaGlobe className="text-gray-500" />
                                                    {subscription.country || 'Unknown Country'}
                                                    {subscription.org && ` • ${subscription.org}`}
                                                </div>
                                                <button
                                                    onClick={() => toggleDetails(subscription._id)}
                                                    className="text-xs text-purple-400 hover:text-purple-300 mt-1 flex items-center gap-1"
                                                >
                                                    {showDetails === subscription._id ? (
                                                        <>
                                                            <FaEyeSlash className="w-3 h-3" />
                                                            Hide Details
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaEye className="w-3 h-3" />
                                                            Show Details
                                                        </>
                                                    )}
                                                </button>

                                                {/* Details Panel */}
                                                {showDetails === subscription._id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="mt-2 p-3 bg-gray-700/50 rounded-lg text-xs"
                                                    >
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <span className="text-gray-400">IP:</span>
                                                                <div className="text-white font-mono">{subscription.ip}</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Coordinates:</span>
                                                                <div className="text-white">
                                                                    {subscription.latitude && subscription.longitude
                                                                        ? `${subscription.latitude.toFixed(4)}, ${subscription.longitude.toFixed(4)}`
                                                                        : 'N/A'
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Postal:</span>
                                                                <div className="text-white">{subscription.postal || 'N/A'}</div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-400">Timezone:</span>
                                                                <div className="text-white">{subscription.timezone || 'N/A'}</div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </td>

                                            {/* Date Column */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaCalendar className="text-blue-400 text-sm" />
                                                    <div className="text-sm text-white font-medium">
                                                        {formatDate(subscription.createdAt)}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <FaClock className="text-gray-500" />
                                                    {getTimeAgo(subscription.createdAt)}
                                                </div>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingId === subscription._id ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleUpdate(subscription._id)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                                        >
                                                            <FaSave className="w-3 h-3" />
                                                            <span>Save</span>
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                                                        >
                                                            <FaTimes className="w-3 h-3" />
                                                            <span>Cancel</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(subscription)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                                        >
                                                            <FaEdit className="w-3 h-3" />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(subscription._id)}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                                                        >
                                                            <FaTrash className="w-3 h-3" />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden p-4">
                        {currentSubscriptions.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="flex flex-col items-center justify-center space-y-3">
                                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center">
                                        <FaFileAlt className="w-8 h-8 text-gray-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">No subscribers found</h3>
                                    <p className="text-gray-400">
                                        {searchTerm ? 'Try adjusting your search terms' : 'No subscribers in your list yet'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {currentSubscriptions.map((subscription, index) => (
                                    <motion.div
                                        key={subscription._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                                {subscription.email?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1">
                                                {editingId === subscription._id ? (
                                                    <input
                                                        type="email"
                                                        value={editEmail}
                                                        onChange={(e) => setEditEmail(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-white text-sm"
                                                        placeholder="Enter email address"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <div>
                                                        <p className="text-sm font-semibold text-white truncate">
                                                            {subscription.email || 'No email'}
                                                        </p>
                                                        <p className="text-xs text-gray-400">Subscriber</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="space-y-2 mb-3">
                                            <div className="flex items-center gap-2">
                                                <FaMapPin className="text-purple-400 text-xs" />
                                                <div className="text-sm text-white">
                                                    {subscription.city && `${subscription.city}, `}
                                                    {subscription.region || 'Unknown Region'}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                                <FaGlobe className="text-gray-500" />
                                                {subscription.country || 'Unknown Country'}
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="space-y-1 mb-3">
                                            <div className="flex items-center gap-2">
                                                <FaCalendar className="text-blue-400 text-xs" />
                                                <div className="text-xs text-white">
                                                    {getTimeAgo(subscription.createdAt)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-600/50">
                                            <button
                                                onClick={() => toggleDetails(subscription._id)}
                                                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                            >
                                                {showDetails === subscription._id ? (
                                                    <>
                                                        <FaEyeSlash className="w-3 h-3" />
                                                        Hide
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaEye className="w-3 h-3" />
                                                        Details
                                                    </>
                                                )}
                                            </button>

                                            {editingId === subscription._id ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleUpdate(subscription._id)}
                                                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs flex items-center space-x-1"
                                                    >
                                                        <FaSave className="w-2 h-2" />
                                                        <span>Save</span>
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs flex items-center space-x-1"
                                                    >
                                                        <FaTimes className="w-2 h-2" />
                                                        <span>Cancel</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(subscription)}
                                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <FaEdit className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(subscription._id)}
                                                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        <FaTrash className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Mobile Details Panel */}
                                        {showDetails === subscription._id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-3 p-3 bg-gray-700/50 rounded-lg text-xs"
                                            >
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <span className="text-gray-400">IP:</span>
                                                        <div className="text-white font-mono truncate">{subscription.ip}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Coordinates:</span>
                                                        <div className="text-white truncate">
                                                            {subscription.latitude && subscription.longitude
                                                                ? `${subscription.latitude.toFixed(4)}, ${subscription.longitude.toFixed(4)}`
                                                                : 'N/A'
                                                            }
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Postal:</span>
                                                        <div className="text-white truncate">{subscription.postal || 'N/A'}</div>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">Timezone:</span>
                                                        <div className="text-white truncate">{subscription.timezone || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-4 md:px-6 py-4 border-t border-gray-700/50 bg-gray-900/30">
                            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">

                                {/* Results Info */}
                                <div className="text-sm text-gray-400">
                                    Showing <span className="font-semibold text-white">{indexOfFirstItem + 1}</span> to{' '}
                                    <span className="font-semibold text-white">
                                        {Math.min(indexOfLastItem, filteredSubscriptions.length)}
                                    </span> of{' '}
                                    <span className="font-semibold text-white">{filteredSubscriptions.length}</span> results
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex space-x-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                    >
                                        <FaChevronLeft className="w-3 h-3" />
                                        <span>Previous</span>
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center space-x-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(page =>
                                                page === 1 ||
                                                page === totalPages ||
                                                Math.abs(page - currentPage) <= 1
                                            )
                                            .map((page, index, array) => {
                                                if (index > 0 && page - array[index - 1] > 1) {
                                                    return (
                                                        <span key={`ellipsis-${page}`} className="px-3 py-2 text-gray-500">
                                                            ...
                                                        </span>
                                                    )
                                                }
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                                ? 'bg-red-500 text-white shadow-lg'
                                                                : 'text-gray-300 hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            })}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                    >
                                        <span>Next</span>
                                        <FaChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}