'use client';



import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import React, { useEffect, useState } from 'react';
import {
  FiSearch,
  FiDownload,
  FiClock,
  FiUser,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiBarChart2,
  FiCalendar,
  FiTrash2,
  FiEye
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLoading from '../components/AdminLoading';
import toast from 'react-hot-toast';
import StatCard from '../components/StartCard';
import Swal from "sweetalert2";

import UniversalTable from '../components/UniversalTable';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Fetch data from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosSecure.get('/api/ticket');
        setBookings(res.data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filter bookings
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.movieTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.selectedSeats?.some(seat => seat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const filteredDate = new Date();

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(booking =>
            new Date(booking.showDate).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          filteredDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(booking =>
            new Date(booking.showDate) >= filteredDate
          );
          break;
        case 'month':
          filteredDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(booking =>
            new Date(booking.showDate) >= filteredDate
          );
          break;
        default:
          break;
      }
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  // Statistics
  const stats = {
    totalBookings: bookings.length,
    totalSeats: bookings.reduce((sum, b) => sum + (b.selectedSeats?.length || 0), 0),
    totalRevenue: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await axiosSecure.patch(`/api/ticket/${bookingId}`, { status: newStatus });
      toast.success(`Booking ${newStatus} successfully`);
      // Refresh bookings
      const res = await axiosSecure.get('/api/ticket');
      setBookings(res.data || []);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/api/ticket/${bookingId}`);
          toast.success("Booking deleted successfully");

          // Refresh bookings
          const res = await axiosSecure.get("/api/ticket");
          setBookings(res.data || []);

          Swal.fire("Deleted!", "The booking has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting booking:", error);
          toast.error("Failed to delete booking");
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };
  const exportBookings = () => {
    const csvContent = [
      ['Movie', 'User', 'Date', 'Time', 'Screen', 'Seats', 'Amount', 'Status', 'Payment Status'],
      ...filteredBookings.map(booking => [
        booking.movieTitle,
        booking.userName,
        new Date(booking.showDate).toLocaleDateString(),
        booking.showTime,
        booking.screen,
        booking.selectedSeats?.join(', '),
        `$${booking.totalAmount}`,
        booking.status,
        booking.paymentStatus
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('not add on the time');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FiCheckCircle className="text-green-400" />;
      case 'pending':
        return <FiAlertCircle className="text-yellow-400" />;
      case 'cancelled':
        return <FiXCircle className="text-red-400" />;
      default:
        return <FiClock className="text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return <AdminLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4"> Bookings Management</h1>
        <p className="text-gray-400">Manage all movie bookings and reservations</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          subtitle="All time bookings"
          icon={<FiBarChart2 />}
          color="from-purple-500 to-pink-500"
          trend="+12%"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtitle="Total earnings"
          icon={<FiDollarSign />}
          color="from-green-500 to-emerald-500"
          trend="+8%"
        />
        <StatCard
          title="Seats Booked"
          value={stats.totalSeats}
          subtitle="Total seats reserved"
          icon={<FiUser />}
          color="from-blue-500 to-cyan-500"
          trend="+15%"
        />
        <StatCard
          title="Confirmed"
          value={stats.confirmedBookings}
          subtitle="Active bookings"
          icon={<FiCheckCircle />}
          color="from-orange-500 to-red-500"
          trend="+5%"
        />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1b1e2b] p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendingBookings}</p>
            </div>
            <FiAlertCircle className="text-yellow-400 text-2xl" />
          </div>
        </div>
        <div className="bg-[#1b1e2b] p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Confirmed</p>
              <p className="text-2xl font-bold text-green-400">{stats.confirmedBookings}</p>
            </div>
            <FiCheckCircle className="text-green-400 text-2xl" />
          </div>
        </div>
        <div className="bg-[#1b1e2b] p-4 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Cancelled</p>
              <p className="text-2xl font-bold text-red-400">{stats.cancelledBookings}</p>
            </div>
            <FiXCircle className="text-red-400 text-2xl" />
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 p-6 rounded-xl border border-gray-800 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by movie, user,  or seats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            {/* Export Button */}
            <button
              onClick={exportBookings}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <FiDownload size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Content */}

      <BookingsTable
        bookings={filteredBookings}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteBooking}
        getStatusColor={getStatusColor}
        getStatusIcon={getStatusIcon}
      />

      {/* Booking Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedBooking && (
          <BookingModal
            booking={selectedBooking}
            onClose={() => setModalOpen(false)}
            onUpdateStatus={handleUpdateStatus}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Booking Modal Component
function BookingModal({ booking, onClose, onUpdateStatus, getStatusColor, getStatusIcon }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1b1e2b] rounded-2xl border border-gray-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Booking Details</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiXCircle size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Movie Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Movie Information</h3>
              <div>
                <p className="text-gray-400 text-sm">Movie Title</p>
                <p className="text-white font-medium">{booking.movieTitle}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Movie ID</p>
                <p className="text-white font-mono text-sm">{booking.movieId}</p>
              </div>
            </div>

            {/* Show Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Show Information</h3>
              <div>
                <p className="text-gray-400 text-sm">Date & Time</p>
                <p className="text-white">
                  {new Date(booking.showDate).toLocaleDateString()} • {booking.showTime}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Screen</p>
                <p className="text-white">{booking.screen}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Theater</p>
                <p className="text-white">{booking.theaterName}</p>
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">User Information</h3>
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white">{booking.userName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{booking.userEmail}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">User ID</p>
                <p className="text-white font-mono text-sm">{booking.userId}</p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Booking Details</h3>
              <div>
                <p className="text-gray-400 text-sm">Selected Seats</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {booking.selectedSeats?.map((seat, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-green-400 font-bold text-xl">${booking.totalAmount}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  <span className="ml-1 capitalize">{booking.status}</span>
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Payment Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-1 ${booking.paymentStatus === 'paid'
                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                  }`}>
                  {booking.paymentStatus === 'paid' ? <FiCheckCircle /> : <FiAlertCircle />}
                  <span className="ml-1 capitalize">{booking.paymentStatus}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={() => onUpdateStatus(booking._id, 'confirmed')}
              className="flex-1 md:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
            >
              Confirm Booking
            </button>
            <button
              onClick={() => onUpdateStatus(booking._id, 'cancelled')}
              className="flex-1 md:flex-none px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
            >
              Cancel Booking
            </button>
            <button
              onClick={onClose}
              className="flex-1 md:flex-none px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// table.........................

function BookingsTable({ bookings, onViewDetails, onConfirm, onDelete }) {
  const columns = [
    {
      header: 'Movie',
      key: 'movieTitle',
      type: 'avatar',
      avatarIcon: <FiCalendar className="text-gray-400" />,
      subtitle: 'type'
    },
    {
      header: 'User',
      key: 'userName',
      render: (item) => (
        <div>
          <p className="text-white font-medium">{item.userName}</p>
          <p className="text-gray-400 text-sm">{item.userEmail}</p>
        </div>
      )
    },
    {
      header: 'Date & Time',
      key: 'showDate',
      type: 'datetime'
    },
    {
      header: 'Screen',
      key: 'screen',
      type: 'text'
    },
    {
      header: 'Seats',
      key: 'selectedSeats',
      type: 'badge'
    },
    {
      header: 'Amount',
      key: 'totalAmount',
      type: 'currency'
    },
    {
      header: 'Status',
      key: 'status',
      type: 'status',
      statusConfig: {
        'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        'confirmed': 'bg-green-500/20 text-green-400 border-green-500/30',
        'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
        'default': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      },
      statusIcons: {
        'pending': <FiClock size={12} />,
        'confirmed': <FiCheckCircle size={12} />,
        'cancelled': <FiTrash2 size={12} />,
        'default': <FiCalendar size={12} />
      }
    }
  ];

  const actions = [
    {
      icon: <FiEye size={16} />,
      onClick: onViewDetails,
      title: 'View Details',
      color: 'blue'
    },
    {
      icon: <FiCheckCircle size={16} />,
      onClick: (item) => onConfirm(item._id),
      title: 'Confirm Booking',
      color: 'green'
    },
    {
      icon: <FiTrash2 size={16} />,
      onClick: (item) => onDelete(item._id),
      title: 'Delete Booking',
      color: 'red'
    }
  ];

  return (
    <UniversalTable
      data={bookings}
      columns={columns}
      actions={actions}
      emptyMessage="No bookings found"
      emptyDescription="Try adjusting your search or filters"
    />
  );
}