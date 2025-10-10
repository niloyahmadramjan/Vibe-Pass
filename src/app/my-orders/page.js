"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosSecure from "../api/axiosHook/useAxiosSecure";
import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEye,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiUser,
  FiFilm,
  FiCreditCard,
} from "react-icons/fi";
import LoadingSpinner from "../hooks/LoadingSpiner";
import Swal from "sweetalert2";

function MyOrder() {
  const { user } = useAuth();
  const userEmail = user?.email;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [bookings, setBookings] = useState([]);
// payment data
  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await axiosSecure.get(
          `/api/payments/user?userEmail=${userEmail}`
        );
        console.log("📦 Orders data:", data); // Debug log
        setOrders(data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        Swal.fire("Error!", "Failed to load orders.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userEmail]);

  // booking data
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

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center space-x-1 w-20";
    switch (status) {
      case "paid":
      case "confirmed":
        return `${baseClasses} bg-green-500/20 text-green-400 `;
      case "pending":
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      case "cancelled":
      case "failed":
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      case "completed":
        return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
      case "confirmed":
        return <FiCheckCircle size={14} className="text-green-400" />;
      case "pending":
        return <FiClock size={14} className="text-yellow-400" />;
      case "cancelled":
      case "failed":
        return <FiXCircle size={14} className="text-red-400" />;
      case "completed":
        return <FiCheckCircle size={14} className="text-blue-400" />;
      default:
        return null;
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      // Handle both full datetime and time-only strings
      const date = timeString.includes("T")
        ? new Date(timeString)
        : new Date(`2000-01-01T${timeString}`);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "Invalid Time";
    }
  };

  // Transform API data to match frontend expectations
  const transformOrderData = (order) => ({
    ...order,
    // Map backend fields to frontend fields
    movieTitle: order.sessionTitle || "Unknown Movie",
    totalAmount: order.amount ? order.amount / 100 : 0, // Convert from cents if needed
    showDate: order.showTime || order.createdAt,
    showTime: order.showTime || "N/A",
    selectedSeats: order.selectedSeats || ["N/A"],
    theaterName: order.theaterName || "Unknown Theater",
    screen: order.screen || "N/A",
    userName: order.userName || "Customer",
    userEmail: order.userEmail,
    status: order.status || "confirmed",
    paymentStatus: order.status || "paid",
    transactionId: order.transactionId || order.providerPaymentId,
  });

  if (loading) return <LoadingSpinner />;

  const transformedOrders = orders.map(transformOrderData);

  if (!transformedOrders.length)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-20 pt-25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="bg-gray-800/50 rounded-2xl p-8 max-w-md mx-auto border border-gray-700/50">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiFilm className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-400">You haven't made any orders yet.</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-gray-400">
            View and manage your movie ticket orders
          </p>
        </div>

        {/* Table Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Movie & Theater
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                    Show Time
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
                {transformedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-700/30 transition-all duration-200 group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {order.movieTitle?.charAt(0) || "M"}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                            {order.movieTitle}
                          </div>
                          <div className="text-gray-400 text-sm mt-1">
                            {order.theaterName}
                            {order.screen &&
                              order.screen !== "N/A" &&
                              ` • Screen ${order.screen}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="text-white font-medium">
                          {formatDate(order.showDate)}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {formatTime(order.showTime)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="text-green-400 font-semibold">
                          ৳{order.totalAmount}
                        </div>
                        {order.transactionId && (
                          <div className="text-gray-400 text-xs">
                            TXN: {order.transactionId.slice(-8)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={getStatusBadge(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 rounded-lg hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-400 transition-all duration-200 group"
                          title="View Order Details"
                        >
                          <FiEye
                            size={18}
                            className="text-blue-400 group-hover:text-blue-300"
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
          <div>Total Orders: {transformedOrders.length}</div>
          <div className="flex space-x-4">
            <span className="flex items-center space-x-1">
              <FiCheckCircle className="text-green-400" />
              <span>
                Confirmed:{" "}
                {
                  transformedOrders.filter((o) =>
                    ["paid", "confirmed"].includes(o.status)
                  ).length
                }
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <FiClock className="text-yellow-400" />
              <span>
                Pending:{" "}
                {transformedOrders.filter((o) => o.status === "pending").length}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full border border-gray-700/50 shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Order Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FiXCircle className="text-gray-400 text-xl" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Movie & Theater Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {selectedOrder.movieTitle?.charAt(0) || "M"}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg">
                    {selectedOrder.movieTitle}
                  </h4>
                  <p className="text-gray-400">
                    {selectedOrder.theaterName}
                    {selectedOrder.screen &&
                      selectedOrder.screen !== "N/A" &&
                      ` • Screen ${selectedOrder.screen}`}
                  </p>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="text-blue-400 text-lg" />
                    <div>
                      <p className="text-gray-400 text-sm">Show Date & Time</p>
                      <p className="text-white font-medium">
                        {formatDate(selectedOrder.showDate)} at{" "}
                        {formatTime(selectedOrder.showTime)}
                      </p>
                    </div>
                  </div>

                 
                  <div className="flex items-center space-x-3">
                    <FiUser className="text-purple-400 text-lg" />
                    <div>
                      <p className="text-gray-400 text-sm">Booked By</p>
                      <p className="text-white font-medium">
                        {selectedOrder.userName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {selectedOrder.userEmail}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FiDollarSign className="text-yellow-400 text-lg" />
                    <div>
                      <p className="text-gray-400 text-sm">Total Amount</p>
                      <p className="text-green-400 font-semibold text-xl">
                        ৳{selectedOrder.totalAmount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FiCreditCard className="text-blue-400 text-lg" />
                    <div>
                      <p className="text-gray-400 text-sm">Transaction ID</p>
                      <p className="text-white font-mono text-sm">
                        {selectedOrder.transactionId || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <span className={getStatusBadge(selectedOrder.status)}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-1">{selectedOrder.status}</span>
                      </span>
                    </div>
                    <div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order ID */}
              <div className="pt-4 border-t border-gray-700/50">
                <p className="text-gray-400 text-sm">Order ID</p>
                <p className="text-white font-mono text-sm">
                  {selectedOrder._id}
                </p>
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

export default MyOrder;
