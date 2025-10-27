// components/SubscriptionTable.js
'use client'
import { useState, useEffect } from 'react'
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure'
import { motion } from 'framer-motion'
import StarCardtDeshbord from "../components/StartCard"
import { FaUsers, FaChartLine, FaSearch, FaFileAlt } from 'react-icons/fa';

import { Send } from 'lucide-react'
import AdminLoading from '../components/AdminLoading'
import Swal from 'sweetalert2'

export default function SubscriptionTable() {
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

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type })
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000)
    }

    useEffect(() => {
        fetchSubscriptions()
    }, [])

    const fetchSubscriptions = async () => {
        try {
            setLoading(true)
            const response = await axiosSecure.get('/api/newsletter')
            // console.log('Full API response:', response) // Debug log

            // Handle the response structure from your controller
            if (response.data && response.data.success) {
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

    const handleEdit = (subscription) => {
        setEditingId(subscription._id)
        setEditEmail(subscription.email)
    }

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
                        sub._id === id
                            ? { ...sub, ...updatedData }
                            : sub
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

    const handleCancel = () => {
        setEditingId(null)
        setEditEmail('')
    }

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
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: response.data.message || 'Failed to delete subscription',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                })
            }
        } catch (error) {
            console.error('Error deleting subscription:', error)
            const errorMessage = error.response?.data?.message || 'Failed to delete subscription'

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: errorMessage,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            })
        }
    }


    const handleSendAnnouncement = async (e) => {
        e.preventDefault()
        setSending(true)

        try {
            const response = await axiosSecure.post('/api/announcemnet/send', {
                subject: subject,
                message: message
            })

            if (response.data.success) {
                showNotification(`Announcement sent successfully to ${response.data.data.recipients} subscribers!`)
                setNotificationModalOpen(false)
                setSubject('')
                setMessage('')
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
        sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentSubscriptions = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage)

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

    if (loading) return <AdminLoading />

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233] p-6">
            {/* Notification */}
            {notification.show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                        }`}
                >
                    <div className="flex items-center space-x-2">
                        {notification.type === 'error' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        <span>{notification.message}</span>
                    </div>
                </motion.div>
            )}

            {/* Announcement Modal */}
            {notificationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1b1e2b] rounded-2xl w-full max-w-md border border-[#2a2c36] shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#2a2c36]">
                            <h2 className="text-lg font-bold text-white">Send Announcement</h2>
                            <button
                                onClick={() => setNotificationModalOpen(false)}
                                className="p-1 hover:bg-[#2a2c36] rounded transition-colors"
                            >
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Simple Form - Only 2 fields */}
                        <form onSubmit={handleSendAnnouncement} className="p-4 space-y-4">
                            {/* Subject - Smaller Search Bar */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Subject
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Enter subject"
                                        className="flex-1 px-3 py-2 bg-[#2a2c36] border border-[#3a3c46] rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="mt-4 lg:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25"
                                    >
                                        {sending ? (
                                            <>
                                                <div className="mt-4 lg:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25"></div>
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
                                    className="px-3 py-2 text-gray-300 hover:text-white border border-[#3a3c46] rounded hover:bg-[#2a2c36] transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">Subscription Management</h1>
                    <p className="text-gray-400 text-lg">Manage your newsletter subscribers and their email preferences</p>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StarCardtDeshbord
                        title="Total Subscribers"
                        value={subscriptions.length}
                        subtitle="All time subscribers"
                        icon={<FaUsers className="text-white text-xl" />}
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
                        icon={<FaChartLine className="text-white text-xl" />}
                        delay={0.2}
                    />
                    <StarCardtDeshbord
                        title="Search Results"
                        value={filteredSubscriptions.length}
                        subtitle="Filtered subscribers"
                        icon={<FaSearch className="text-white text-xl" />}
                        delay={0.3}
                    />
                    <StarCardtDeshbord
                        title="Current Page"
                        value={currentPage}
                        subtitle={`of ${totalPages} pages`}
                        icon={<FaFileAlt className="text-white text-xl" />}
                        delay={0.4}
                    />
                </div>

                {/* Search and Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-6"
                >
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full lg:w-64"> {/* Smaller search bar */}
                            <input
                                type="text"
                                placeholder="Search subscribers..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="w-full px-4 py-2 pl-10 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent bg-gray-700/50 text-white placeholder-gray-400 transition-all duration-200 text-sm"
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setNotificationModalOpen(true)}
                                className="mt-4 lg:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25"
                            >
                                <Send size={14} />
                                <span>Send Announcement</span>
                            </motion.button>
                            {/* <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={fetchSubscriptions}
                                className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl hover:from-green-500 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center space-x-2 text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Refresh</span>
                            </motion.button> */}
                        </div>
                    </div>
                </motion.div>

                {/* Rest of your table component remains the same */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
                >
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-b border-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Subscriber
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Subscription Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                        Last Updated
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
                                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-white mb-1">No subscribers found</h3>
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
                                                                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-700 text-white"
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
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white font-medium">
                                                    {formatDate(subscription.createdAt)}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {getTimeAgo(subscription.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-white font-medium">
                                                    {formatDate(subscription.updatedAt)}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {getTimeAgo(subscription.updatedAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {editingId === subscription._id ? (
                                                    <div className="flex space-x-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleUpdate(subscription._id)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center space-x-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span>Save</span>
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={handleCancel}
                                                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center space-x-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                            <span>Cancel</span>
                                                        </motion.button>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleEdit(subscription)}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center space-x-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            <span>Edit</span>
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleDelete(subscription._id)}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center space-x-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            <span>Delete</span>
                                                        </motion.button>
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-900/30">
                            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                                <div className="text-sm text-gray-400">
                                    Showing <span className="font-semibold text-white">{indexOfFirstItem + 1}</span> to <span className="font-semibold text-white">
                                        {Math.min(indexOfLastItem, filteredSubscriptions.length)}
                                    </span> of <span className="font-semibold text-white">{filteredSubscriptions.length}</span> results
                                </div>
                                <div className="flex space-x-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span>Previous</span>
                                    </motion.button>
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
                                                    <motion.button
                                                        key={page}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${currentPage === page
                                                            ? 'bg-red-500 text-white shadow-lg'
                                                            : 'text-gray-300 hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        {page}
                                                    </motion.button>
                                                )
                                            })}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1"
                                    >
                                        <span>Next</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}