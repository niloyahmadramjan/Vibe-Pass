'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axiosSecure from '../api/axiosHook/useAxiosSecure'
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiUser,
  FiMoreVertical,
  FiCreditCard,
  FiGlobe,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import LoadingSpinner from '../hooks/LoadingSpiner'
import Swal from 'sweetalert2'

function MyBooking() {
  const { user } = useAuth()
  const userEmail = user?.email
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [actionMenuOpen, setActionMenuOpen] = useState(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(7)

  useEffect(() => {
    if (!userEmail) {
      setLoading(false)
      return
    }

    const fetchBookings = async () => {
      try {
        const { data } = await axiosSecure.get(
          `api/ticket/my-bookings?userEmail=${userEmail}`
        )
        setBookings(data)
      } catch (err) {
        console.error('❌ Error fetching booking:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [userEmail])

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(bookings.length / itemsPerPage)

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const handleDelete = async (bookingId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleteLoading(bookingId)
        try {
          await axiosSecure.delete(`/api/ticket/${bookingId}`)
          setBookings(bookings.filter((booking) => booking._id !== bookingId))
          Swal.fire('Deleted!', 'The booking has been deleted.', 'success')
        } catch (error) {
          console.error('Error deleting booking:', error)
          if (error.response?.status === 404) {
            Swal.fire(
              'Error!',
              'Booking not found. It may have been already deleted.',
              'error'
            )
            const { data } = await axiosSecure.get(
              `api/ticket/my-bookings?userEmail=${userEmail}`
            )
            setBookings(data)
          } else if (error.response?.status === 500) {
            Swal.fire(
              'Error!',
              'Server error. Please try again later.',
              'error'
            )
          } else {
            Swal.fire('Error!', 'Something went wrong while deleting.', 'error')
          }
        } finally {
          setDeleteLoading(null)
          setActionMenuOpen(null)
        }
      }
    })
  }

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
    setActionMenuOpen(null)
  }

  const handlePayNow = (booking) => {
    setSelectedBooking(booking)
    setShowPaymentModal(true)
    setActionMenuOpen(null)
  }

  // const handleRefund = async (booking) => {
  //   Swal.fire({
  //     title: 'Request Refund?',
  //     text: 'Are you sure you want to request a refund for this booking?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, request refund',
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         // Add your refund API call here
  //         await axiosSecure.post(`/api/ticket/${booking._id}/refund`)
  //         Swal.fire('Success!', 'Refund request has been submitted.', 'success')
  //         // Refresh bookings
  //         const { data } = await axiosSecure.get(
  //           `api/ticket/my-bookings?userEmail=${userEmail}`
  //         )
  //         setBookings(data)
  //       } catch (error) {
  //         console.error('Error processing refund:', error)
  //         Swal.fire('Error!', 'Failed to process refund request.', 'error')
  //       }
  //       setActionMenuOpen(null)
  //     }
  //   })
  // }

  const getStatusBadge = (status) => {
    const baseClasses =
      'px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium capitalize'
    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`
      case 'cancelled':
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`
    }
  }

  const getPaymentBadge = (paymentStatus) => {
    const baseClasses =
      'px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium capitalize'
    switch (paymentStatus) {
      case 'paid':
        return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`
      case 'unpaid':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`
      case 'failed':
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`
      case 'refunded':
        return `${baseClasses} bg-purple-500/20 text-purple-400 border border-purple-500/30`
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`
    }
  }

  const paymentMethods = [
    {
      id: 'stripe',
      name: 'International Cards',
      description: 'Visa, MasterCard, American Express',
      color: 'from-blue-500 to-indigo-600',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-500/10',
      icon: FiCreditCard,
      features: [
        'Secure international payments',
        'Multiple currency support',
        'Instant processing',
      ],
    },
    {
      id: 'sslcommerz',
      name: 'Local Payment (BD)',
      description: 'bKash, Nagad, Rocket, Local Cards',
      color: 'from-green-500 to-emerald-600',
      borderColor: 'border-green-500',
      bgColor: 'bg-green-500/10',
      icon: FiGlobe,
      features: [
        'Popular Bangladeshi methods',
        'Quick and easy',
        'Local currency',
      ],
    },
  ]

  if (loading) return <LoadingSpinner />

  if (!bookings.length)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-20 pt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="bg-gray-800/50 rounded-2xl p-8 max-w-md mx-auto border border-gray-700/50">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Bookings Found
              </h3>
              <p className="text-gray-400">
                You haven't made any bookings yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 md:py-20 pt-20 md:pt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            My Bookings
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Manage your movie bookings and reservations
          </p>
        </div>

        {/* Bookings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Total Bookings</div>
            <div className="text-2xl font-bold text-white">
              {bookings.length}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Paid</div>
            <div className="text-2xl font-bold text-green-400">
              {bookings.filter((b) => b.paymentStatus === 'paid').length}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Unpaid</div>
            <div className="text-2xl font-bold text-yellow-400">
              {bookings.filter((b) => b.paymentStatus === 'unpaid').length}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Page</div>
            <div className="text-2xl font-bold text-purple-400">
              {currentPage} / {totalPages}
            </div>
          </div>
        </div>

        {/* Bookings Grid for Mobile, Table for Desktop */}
        <div className="lg:hidden">
          {/* Mobile & Tablet View */}
          <div className="space-y-4">
            {currentBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 md:p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {booking.movieTitle?.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold truncate text-sm md:text-base">
                        {booking.movieTitle}
                      </h3>
                      <p className="text-gray-400 text-xs md:text-sm truncate">
                        {booking.theaterName}
                      </p>
                    </div>
                  </div>

                  {/* Action Menu for Mobile */}
                  <div className="relative flex-shrink-0 ml-2">
                    <button
                      onClick={() =>
                        setActionMenuOpen(
                          actionMenuOpen === booking._id ? null : booking._id
                        )
                      }
                      className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      <FiMoreVertical className="text-gray-400" size={18} />
                    </button>

                    {actionMenuOpen === booking._id && (
                      <div className="absolute right-0 top-10 z-10 bg-gray-700 border border-gray-600 rounded-xl shadow-2xl min-w-40">
                        <div className="p-2 space-y-1">
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-600 rounded-lg flex items-center space-x-2"
                          >
                            <FiEye size={14} />
                            <span>View Details</span>
                          </button>

                          {booking.paymentStatus === 'unpaid' && (
                            <button
                              onClick={() => handlePayNow(booking)}
                              className="w-full text-left px-3 py-2 text-sm text-green-400 hover:bg-gray-600 rounded-lg flex items-center space-x-2"
                            >
                              <FiCreditCard size={14} />
                              <span>Pay Now</span>
                            </button>
                          )}

                          {/* {booking.paymentStatus === 'paid' &&
                            booking.status !== 'cancelled' && (
                              <button
                                onClick={() => handleRefund(booking)}
                                className="w-full text-left px-3 py-2 text-sm text-purple-400 hover:bg-gray-600 rounded-lg flex items-center space-x-2"
                              >
                                <FiArrowLeft size={14} />
                                <span>Request Refund</span>
                              </button>
                            )} */}

                          {/* Always show delete button, but disable for paid bookings that aren't cancelled */}
                          <button
                            onClick={() => handleDelete(booking._id)}
                            disabled={
                              (booking.paymentStatus === 'paid' &&
                                booking.status !== 'cancelled') ||
                              deleteLoading === booking._id
                            }
                            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-600 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FiTrash2 size={14} />
                            <span>
                              {deleteLoading === booking._id
                                ? 'Deleting...'
                                : booking.paymentStatus === 'paid' &&
                                  booking.status !== 'cancelled'
                                ? 'Cannot Delete'
                                : 'Delete'}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs">Amount</p>
                    <p className="text-green-400 font-semibold text-sm md:text-base">
                      ৳{booking.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Status</p>
                    <div className="flex flex-wrap gap-1">
                      <span className={getPaymentBadge(booking.paymentStatus)}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pay Now Button for Mobile */}
                {booking.paymentStatus === 'unpaid' && (
                  <button
                    onClick={() => handlePayNow(booking)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm md:text-base"
                  >
                    Pay Now - ৳{booking.totalAmount}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Theater
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {currentBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-700/30 transition-all duration-200 group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {booking.movieTitle?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                            {booking.movieTitle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {booking.theaterName}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-green-400 font-semibold">
                        ৳{booking.totalAmount}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={getPaymentBadge(booking.paymentStatus)}
                        >
                          {booking.paymentStatus}
                        </span>
                        {booking.paymentStatus === 'unpaid' && (
                          <button
                            onClick={() => handlePayNow(booking)}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center space-x-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="p-2 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-400 transition-all duration-200 group"
                          title="View Details"
                        >
                          <FiEye
                            size={18}
                            className="text-blue-400 group-hover:text-blue-300"
                          />
                        </button>

                        {/* Refund Button for paid bookings
                        {booking.paymentStatus === 'paid' &&
                          booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleRefund(booking)}
                              className="p-2 rounded-lg hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-400 transition-all duration-200 group"
                              title="Request Refund"
                            >
                              <FiArrowLeft
                                size={18}
                                className="text-purple-400 group-hover:text-purple-300"
                              />
                            </button>
                          )} */}

                        {/* Delete Button - Always visible but conditionally disabled */}
                        <button
                          onClick={() => handleDelete(booking._id)}
                          disabled={
                            (booking.paymentStatus === 'paid' &&
                              booking.status !== 'cancelled') ||
                            deleteLoading === booking._id
                          }
                          className="p-2 rounded-lg hover:bg-red-500/20 border border-red-500/30 hover:border-red-400 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                            booking.paymentStatus === 'paid' &&
                            booking.status !== 'cancelled'
                              ? 'Cannot delete paid booking'
                              : 'Delete Booking'
                          }
                        >
                          <FiTrash2
                            size={18}
                            className="text-red-400 group-hover:text-red-300"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            

            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
              >
                <FiChevronLeft size={18} />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => {
                    const showEllipsis =
                      index > 0 && page - array[index - 1] > 1
                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => paginate(page)}
                          className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
                            currentPage === page
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                              : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    )
                  })}
              </div>

              {/* Next Button */}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && selectedBooking && (
        <PaymentModal
          bookingData={selectedBooking}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedPaymentMethod(null)
          }}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          paymentMethods={paymentMethods}
        />
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <DetailsModal
          booking={selectedBooking}
          onClose={() => setShowDetailsModal(false)}
          getStatusBadge={getStatusBadge}
          getPaymentBadge={getPaymentBadge}
        />
      )}
    </div>
  )
}

// Payment Modal Component (same as before)
const PaymentModal = ({
  bookingData,
  onClose,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  paymentMethods,
}) => {
  const handleContinue = () => {
    if (selectedPaymentMethod === 'stripe') {
      window.location.href = `/payment/stripe/${bookingData._id}`
    } else if (selectedPaymentMethod === 'sslcommerz') {
      window.location.href = `/payment/sslcommerz/${bookingData._id}`
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl max-w-md w-full mx-auto animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Choose Payment Method
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700/50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Select your preferred payment gateway
          </p>
        </div>

        {/* Payment Options */}
        <div className="p-4 md:p-6 space-y-3 md:space-y-4 max-h-96 overflow-y-auto">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                selectedPaymentMethod === method.id
                  ? `${method.borderColor} ${method.bgColor} transform scale-105`
                  : 'border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/30'
              }`}
            >
              <div className="flex items-start space-x-3 md:space-x-4">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center flex-shrink-0`}
                >
                  <method.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-base md:text-lg truncate">
                      {method.name}
                    </h3>
                    <div
                      className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-2 ${
                        selectedPaymentMethod === method.id
                          ? 'border-white bg-white'
                          : 'border-gray-400'
                      }`}
                    >
                      {selectedPaymentMethod === method.id && (
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-red-500 to-red-600"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs md:text-sm mb-2 md:mb-3">
                    {method.description}
                  </p>
                  <div className="space-y-1">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-current opacity-60 flex-shrink-0"></div>
                        <span className="text-xs text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <span className="text-gray-400 text-sm md:text-base">
              Total Amount
            </span>
            <span className="text-xl md:text-2xl font-bold text-green-400">
              ৳{bookingData?.totalAmount || 0}
            </span>
          </div>
          <div className="flex space-x-2 md:space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 md:py-3 px-3 md:px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedPaymentMethod}
              className={`flex-1 py-2 md:py-3 px-3 md:px-4 rounded-lg font-semibold transition-all text-sm md:text-base ${
                selectedPaymentMethod
                  ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 transform hover:scale-105 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Details Modal Component (same as before)
const DetailsModal = ({
  booking,
  onClose,
  getStatusBadge,
  getPaymentBadge,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl max-w-md w-full border border-gray-700/50 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-bold text-white">
              Booking Details
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiXCircle className="text-gray-400 text-lg md:text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {booking.movieTitle?.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm md:text-base">
                {booking.movieTitle}
              </h4>
              <p className="text-gray-400 text-xs md:text-sm">
                {booking.theaterName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="flex items-center space-x-2">
              <FiCalendar className="text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs md:text-sm">Show Time</p>
                <p className="text-white font-medium text-sm">
                  {booking.showTime}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FiMapPin className="text-green-400 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs md:text-sm">Seats</p>
                <p className="text-white font-medium text-sm">
                  {booking.selectedSeats?.join(', ') || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FiDollarSign className="text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs md:text-sm">Amount</p>
                <p className="text-green-400 font-semibold text-sm">
                  ৳{booking.totalAmount}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FiUser className="text-purple-400 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs md:text-sm">Booking ID</p>
                <p className="text-white font-mono text-xs">
                  {booking._id}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-3 md:pt-4">
            <span className={getStatusBadge(booking.status)}>
              {booking.status}
            </span>
            <span className={getPaymentBadge(booking.paymentStatus)}>
              {booking.paymentStatus}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-gray-700/50">
          <button
            onClick={onClose}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 md:py-3 px-4 rounded-lg font-medium transition-colors text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyBooking
