'use client';
import { useState } from 'react';
import {
    FiUser, FiFilm, FiCalendar, FiClock, FiDollarSign, FiSearch, FiRefreshCw, FiCheckCircle, FiXCircle, FiEye, FiDownload, FiShoppingCart
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLoading from '../components/AdminLoading';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import { FaTicketAlt } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';


export default function TicketManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedDate, setSelectedDate] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 10;

    // Fetch tickets using React Query
    const { data: tickets = [], isLoading, error, refetch } = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            try {
                const response = await axiosSecure.get('/api/ticket');
                // Sort by latest first
                return response.data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
            } catch (error) {
                console.error('Error fetching tickets:', error);
                throw new Error('Failed to load tickets');
            }
        }
    });

    // Filter tickets
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.bookingId?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || ticket.paymentStatus === statusFilter;
        const matchesDate = !selectedDate || ticket.showDate === selectedDate;

        return matchesSearch && matchesStatus && matchesDate;
    });

    // Pagination
    const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);
    const startIndex = (currentPage - 1) * ticketsPerPage;
    const currentTickets = filteredTickets.slice(startIndex, startIndex + ticketsPerPage);

    // Calculate statistics
    const stats = {
        totalTickets: tickets.length,
        confirmedTickets: tickets.filter(t => t.paymentStatus === 'paid').length,
        pendingTickets: tickets.filter(t => t.paymentStatus === 'pending').length,
        totalRevenue: tickets
            .filter(t => t.paymentStatus === 'paid')
            .reduce((sum, ticket) => sum + (ticket.totalAmount || 0), 0),
        averageTicketValue: tickets.length > 0 ?
            tickets.reduce((sum, ticket) => sum + (ticket.totalAmount || 0), 0) / tickets.length : 0
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid': return <FiCheckCircle className="text-green-400" />;
            case 'pending': return <FiClock className="text-yellow-400" />;
            case 'cancelled': return <FiXCircle className="text-red-400" />;
            default: return <FaTicketAlt className="text-gray-400" />;
        }
    };

    // View ticket details
    const handleViewTicket = (ticket) => {
        setSelectedTicket(ticket);
        setViewModalOpen(true);
    };

    // Download ticket as PDF
    const handleDownloadTicket = async (ticket) => {
        try {
            // ✅ Send POST request with ticket data
            const response = await axiosSecure.post("/api/generate-ticket-pdf",
                {
                   
                    movieTitle: ticket.movieTitle,
                    theaterName: ticket.theaterName,
                    showDate: ticket.showDate,
                    showTime: ticket.showTime,
                    selectedSeats: ticket.selectedSeats,
                    totalAmount: ticket.totalAmount,
                    transactionId: ticket.transactionId,
                    screen: ticket.screen,
                    status: ticket.paymentStatus,
                    userName: ticket.userName,
                    userEmail: ticket.userEmail,
                    bookingId: ticket._id,
                },
                {
                    responseType: "blob", // ✅ Important: PDF is binary data
                }
            );

            // ✅ Create a download link for PDF
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `ticket-${ticket.bookingId || ticket.transactionId}.pdf`;
            link.click();

            // ✅ Clean up
            window.URL.revokeObjectURL(url);
            toast.success("Ticket downloaded successfully!");
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Failed to download ticket");
        }
    };


    // Format time
    const formatTime = (time) => {
        if (!time) return 'N/A';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    // Improved pagination - show limited page numbers
    const getVisiblePages = () => {
        const visiblePages = 5; // Show max 5 page numbers
        let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
        let endPage = Math.min(totalPages, startPage + visiblePages - 1);

        // Adjust if we're near the end
        if (endPage - startPage + 1 < visiblePages) {
            startPage = Math.max(1, endPage - visiblePages + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (isLoading) {
        return <AdminLoading />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233] p-6 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Tickets</h2>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233] p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    Ticket Management
                </h1>
                <p className="text-gray-400 text-lg">Manage and track all ticket bookings</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Tickets</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalTickets}</p>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <FaTicketAlt className="text-purple-400 text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Confirmed</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.confirmedTickets}</p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <FiCheckCircle className="text-green-400 text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.pendingTickets}</p>
                        </div>
                        <div className="p-3 bg-yellow-500/20 rounded-xl">
                            <FiClock className="text-yellow-400 text-2xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold text-white mt-2">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <FiDollarSign className="text-blue-400 text-2xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by user, movie, or booking ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    {/* Date Filter */}
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    {/* Reset Filters */}
                   
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Booking Details</th>
                                <th className="px-6 py-4 text-left text-gray-400 font-semibold">User Info</th>
                                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Show Details</th>
                                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Amount</th>
                                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Status</th>
                                <th className="px-6 py-4 text-left text-gray-400 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {currentTickets.map((ticket) => (
                                <tr key={ticket._id} className="hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-semibold">{ticket.bookingId}</p>
                                            <p className="text-gray-400 text-sm">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-semibold">{ticket.userName}</p>
                                            <p className="text-gray-400 text-sm">{ticket.userEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-semibold line-clamp-1">{ticket.movieTitle}</p>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                                                <FiCalendar size={12} />
                                                <span>{new Date(ticket.showDate).toLocaleDateString()}</span>
                                                <FiClock size={12} />
                                                <span>{formatTime(ticket.showTime)}</span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                Seats: {ticket.selectedSeats?.join(', ')}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-white font-bold text-lg">${ticket.totalAmount}</p>
                                        <p className="text-gray-400 text-sm">{ticket.selectedSeats?.length} tickets</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(ticket.paymentStatus)}`}>
                                            {getStatusIcon(ticket.paymentStatus)}
                                            {ticket.paymentStatus?.charAt(0).toUpperCase() + ticket.paymentStatus?.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewTicket(ticket)}
                                                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
                                                title="View Details"
                                            >
                                                <FiEye size={16} />
                                            </button>
                                            {ticket.paymentStatus === 'paid' && (
                                                <button
                                                    onClick={() => handleDownloadTicket(ticket)}
                                                    className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white"
                                                    title="Download Ticket"
                                                >
                                                    <FiDownload size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredTickets.length === 0 && (
                    <div className="text-center py-12">
                        <FaTicketAlt className="text-gray-500 text-6xl mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">No Tickets Found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Improved Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl text-white transition-colors flex items-center gap-2"
                    >
                        Previous
                    </button>

                    {/* Show first page if not in visible range */}
                    {currentPage > 3 && (
                        <>
                            <button
                                onClick={() => setCurrentPage(1)}
                                className={`px-4 py-2 rounded-xl transition-colors ${1 === currentPage
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                1
                            </button>
                            {currentPage > 4 && (
                                <span className="px-2 text-gray-400">...</span>
                            )}
                        </>
                    )}

                    {/* Visible page numbers */}
                    {getVisiblePages().map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-xl transition-colors ${page === currentPage
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Show last page if not in visible range */}
                    {currentPage < totalPages - 2 && (
                        <>
                            {currentPage < totalPages - 3 && (
                                <span className="px-2 text-gray-400">...</span>
                            )}
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className={`px-4 py-2 rounded-xl transition-colors ${totalPages === currentPage
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-xl text-white transition-colors flex items-center gap-2"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Ticket Details Modal */}
            {viewModalOpen && selectedTicket && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-2xl w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Ticket Details</h2>
                                <button
                                    onClick={() => setViewModalOpen(false)}
                                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <FiXCircle className="text-gray-400 text-xl" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Booking Info */}
                                <div className="space-y-4">
                                    <div className="bg-gray-700/50 rounded-xl p-4">
                                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                            <FaTicketAlt className="text-purple-400" />
                                            Booking Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Booking ID:</span>
                                                <span className="text-white font-mono">{selectedTicket.bookingId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Booked On:</span>
                                                <span className="text-white">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Status:</span>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedTicket.paymentStatus)}`}>
                                                    {selectedTicket.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-700/50 rounded-xl p-4">
                                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                            <FiUser className="text-blue-400" />
                                            User Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Name:</span>
                                                <span className="text-white">{selectedTicket.userName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Email:</span>
                                                <span className="text-white">{selectedTicket.userEmail}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Show Info */}
                                <div className="space-y-4">
                                    <div className="bg-gray-700/50 rounded-xl p-4">
                                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                            <FiFilm className="text-green-400" />
                                            Show Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Movie:</span>
                                                <span className="text-white font-semibold">{selectedTicket.movieTitle}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Date:</span>
                                                <span className="text-white">{new Date(selectedTicket.showDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Time:</span>
                                                <span className="text-white">{formatTime(selectedTicket.showTime)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Hall:</span>
                                                <span className="text-white capitalize">{selectedTicket.hall}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-700/50 rounded-xl p-4">
                                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                            <FiShoppingCart className="text-yellow-400" />
                                            Ticket Details
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Seats:</span>
                                                <span className="text-white font-semibold">
                                                    {selectedTicket.selectedSeats?.join(', ')}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Total Seats:</span>
                                                <span className="text-white">{selectedTicket.selectedSeats?.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Amount:</span>
                                                <span className="text-white font-bold text-lg">${selectedTicket.totalAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-6 border-t border-gray-700">
                                <button
                                    onClick={() => handleDownloadTicket(selectedTicket)}
                                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold"
                                >
                                    <FiDownload />
                                    Download Ticket
                                </button>
                                <button
                                    onClick={() => setViewModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}