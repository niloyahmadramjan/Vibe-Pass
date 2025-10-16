"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosSecure from "../api/axiosHook/useAxiosSecure";
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
} from "react-icons/fi";
import LoadingSpinner from "../hooks/LoadingSpiner";
import Swal from "sweetalert2";

function MyBooking() {
  const { user } = useAuth();
  const userEmail = user?.email;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // Add this to your component's state
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const { data } = await axiosSecure.get(
          `api/ticket/my-bookings?userEmail=${userEmail}`
        );
        setBookings(data);
      } catch (err) {
        console.error("❌ Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userEmail]);

  const handleDelete = async (bookingId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleteLoading(bookingId);
        try {
          // ✅ CORRECTED: Matches your backend route '/api/ticket/:id'
          await axiosSecure.delete(`/api/ticket/${bookingId}`);

          // Remove from local state
          setBookings(bookings.filter((booking) => booking._id !== bookingId));

          // Show success message
          Swal.fire("Deleted!", "The booking has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting booking:", error);

          // Handle specific error cases
          if (error.response?.status === 404) {
            Swal.fire(
              "Error!",
              "Booking not found. It may have been already deleted.",
              "error"
            );
            // Refresh bookings if 404
            const { data } = await axiosSecure.get(
              `api/ticket/my-bookings?userEmail=${userEmail}`
            );
            setBookings(data);
          } else if (error.response?.status === 500) {
            Swal.fire(
              "Error!",
              "Server error. Please try again later.",
              "error"
            );
          } else {
            Swal.fire(
              "Error!",
              "Something went wrong while deleting.",
              "error"
            );
          }
        } finally {
          setDeleteLoading(null);
        }
      }
    });
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium capitalize";
    switch (status) {
      case "confirmed":
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`;
      case "pending":
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      case "cancelled":
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium capitalize";
    switch (paymentStatus) {
      case "paid":
        return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
      case "unpaid":
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      case "failed":
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  if (loading) return <LoadingSpinner />;

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
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-20 pt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-gray-400">
            Manage your movie bookings and reservations
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
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
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-700/30 transition-all duration-200 group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {b.movieTitle?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                            {b.movieTitle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{b.theaterName}</td>
                    <td className="py-4 px-6">
                      <div className="text-green-400 font-semibold">
                        ৳{b.totalAmount}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Payment Badge */}
                        <span className={getPaymentBadge(b.paymentStatus)}>
                          {b.paymentStatus}
                        </span>

                        {/* Pay Now Button */}
                        {b.paymentStatus === "unpaid" && (
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="px-3 py-1 rounded-full text-sm font-medium capitalize bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                    {/* Payment Options Modal */}
                    {selectedBooking &&
                      selectedBooking.paymentStatus === "unpaid" && (
                        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/60 backdrop-blur-sm">
                          <div className="bg-white rounded-2xl max-w-md w-full border border-gray-100 shadow-2xl p-6 animate-in fade-in duration-200">
                            {/* Progress Steps */}
                            <div className="flex items-center justify-center mb-6">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                  <span className="text-white text-sm font-semibold">
                                    1
                                  </span>
                                </div>
                                <div className="w-12 h-1 bg-blue-600 mx-2"></div>
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                  <span className="text-gray-600 text-sm font-semibold">
                                    2
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Header */}
                            <div className="text-center mb-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg
                                  className="w-7 h-7 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                  />
                                </svg>
                              </div>
                              <h3 className="text-gray-900 text-xl font-bold">
                                Select Payment Method
                              </h3>
                              <p className="text-gray-500 text-sm mt-2">
                                Choose how you'd like to complete your payment
                              </p>
                            </div>

                            {/* Payment Options */}
                            <div className="space-y-3 mb-6">
                              {/* International Payment Option */}
                              <div
                                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                  selectedPaymentMethod === "stripe"
                                    ? "border-blue-500 bg-blue-50/50 shadow-md"
                                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                }`}
                                onClick={() =>
                                  setSelectedPaymentMethod("stripe")
                                }
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        selectedPaymentMethod === "stripe"
                                          ? "border-blue-500 bg-blue-500"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {selectedPaymentMethod === "stripe" && (
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                      )}
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                      <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        International Cards
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        Visa, MasterCard, Amex
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-1">
                                    <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                                    <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                                    <div className="w-6 h-4 bg-amber-400 rounded-sm"></div>
                                  </div>
                                </div>

                                {/* Additional Info */}
                                {selectedPaymentMethod === "stripe" && (
                                  <div className="mt-3 pl-8">
                                    <div className="text-xs text-gray-500 bg-white p-2 rounded-lg border">
                                      Secure payment processed by Stripe.
                                      Supports all major international cards.
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Bangladesh Payment Option */}
                              <div
                                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                  selectedPaymentMethod === "sslcommerz"
                                    ? "border-emerald-500 bg-emerald-50/50 shadow-md"
                                    : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                                }`}
                                onClick={() =>
                                  setSelectedPaymentMethod("sslcommerz")
                                }
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        selectedPaymentMethod === "sslcommerz"
                                          ? "border-emerald-500 bg-emerald-500"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {selectedPaymentMethod ===
                                        "sslcommerz" && (
                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                      )}
                                    </div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                                      <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-semibold text-gray-900">
                                        Local Payment
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        bKash, Nagad, Rocket, Local Cards
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                                    BD
                                  </div>
                                </div>

                                {/* Additional Info */}
                                {selectedPaymentMethod === "sslcommerz" && (
                                  <div className="mt-3 pl-8">
                                    <div className="text-xs text-gray-500 bg-white p-2 rounded-lg border">
                                      Processed by SSLCommerz. Supports all
                                      popular Bangladeshi payment methods.
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setSelectedBooking(null)}
                                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold"
                              >
                                Cancel
                              </button>

                              <button
                                onClick={() => {
                                  if (selectedPaymentMethod === "stripe") {
                                    window.location.href = `/payment/stripe/${selectedBooking._id}`;
                                  } else if (
                                    selectedPaymentMethod === "sslcommerz"
                                  ) {
                                    window.location.href = `/payment/sslcommerz/${selectedBooking._id}`;
                                  }
                                }}
                                disabled={!selectedPaymentMethod}
                                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                  selectedPaymentMethod
                                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                              >
                                Continue to Pay
                              </button>
                            </div>

                            {/* Security Badge */}
                            <div className="mt-4 text-center">
                              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                                <svg
                                  className="w-4 h-4 text-green-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                  />
                                </svg>
                                <span>Secure & Encrypted Payment</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    <td className="py-4 px-6">
                      <div className="flex justify-center space-x-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => handleViewDetails(b)}
                          className="p-2 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-400 transition-all duration-200 group"
                          title="View Details"
                        >
                          <FiEye
                            size={18}
                            className="text-blue-400 group-hover:text-blue-300"
                          />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(b._id)}
                          disabled={
                            b.status === "cancelled" || deleteLoading === b._id
                          }
                          className="p-2 rounded-lg hover:bg-red-500/20 border border-red-500/30 hover:border-red-400 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                          title={
                            b.status === "cancelled"
                              ? "Already Cancelled"
                              : "Cancel Booking"
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

        {/* Summary */}
        <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
          <div>Total Bookings: {bookings.length}</div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full border border-gray-700/50 shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Booking Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiXCircle className="text-gray-400 text-xl" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {selectedBooking.movieTitle?.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    {selectedBooking.movieTitle}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    {selectedBooking.theaterName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Show Time</p>
                    <p className="text-white font-medium">
                      {selectedBooking.showTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Seats</p>
                    <p className="text-white font-medium">
                      {selectedBooking.selectedSeats.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <FiDollarSign className="text-yellow-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Amount</p>
                    <p className="text-green-400 font-semibold">
                      ৳{selectedBooking.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <FiUser className="text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Booking ID</p>
                    <p className="text-white font-mono text-sm">
                      {selectedBooking._id.slice(-8)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <span className={getStatusBadge(selectedBooking.status)}>
                  {selectedBooking.status}
                </span>
                <span
                  className={getPaymentBadge(selectedBooking.paymentStatus)}
                >
                  {selectedBooking.paymentStatus}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700/50">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBooking;
