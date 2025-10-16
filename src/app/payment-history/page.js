"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FiDollarSign,
  FiCreditCard,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFilm,
  FiHash,
  FiTrendingUp,
  FiPieChart,
} from "react-icons/fi";
import LoadingSpinner from "../hooks/LoadingSpiner";

export default function PaymentHistory() {
  const { user } = useAuth();
  const userEmail = user?.email;
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (!userEmail) return;

    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/user?userEmail=${userEmail}`
        );

        if (!response.ok) throw new Error("Payment fetch failed");
        const data = await response.json();
        setPayments(data);

        // Calculate total expense from successful payments
        const expense = data
          .filter((payment) => payment.status === "paid")
          .reduce((total, payment) => total + payment.amount / 100, 0); // Convert cents to dollars
        setTotalExpense(expense);
      } catch (error) {
        console.error("❌ Fetch payments error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [userEmail]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount, currency = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert cents to dollars
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <FiCheckCircle className="text-green-500" />;
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "failed":
        return <FiClock className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "failed":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  // Calculate statistics
  const totalTransactions = payments.length;
  const successfulPayments = payments.filter((p) => p.status === "paid").length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const failedPayments = payments.filter((p) => p.status === "failed").length;

  if (isLoading) {
    return (
     <LoadingSpinner/>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 pt-20 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-gray-800/70 backdrop-blur-xl px-6 py-3 rounded-2xl border border-gray-700 mb-6 shadow-lg">
            <FiPieChart className="text-purple-400 text-xl" />
            <span className="text-gray-200 font-semibold tracking-wide">
              Financial Overview
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Payment History
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Track your expenses and monitor all financial transactions in one
            place
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Expense */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Total Expense
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-400">
                    {formatCurrency(totalExpense * 100)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">All-time spending</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                <FiTrendingUp className="text-purple-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Total Transactions
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-400">
                    {totalTransactions}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">All payments</p>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                <FiCreditCard className="text-blue-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Successful Payments */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Completed
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-green-400">
                    {successfulPayments}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Successful payments
                </p>
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl group-hover:bg-green-500/30 transition-colors">
                <FiCheckCircle className="text-green-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Pending & Failed */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  In Progress
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-400">
                    {pendingPayments + failedPayments}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-2">Pending & failed</p>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                <FiClock className="text-orange-400 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Transaction History
              </h2>
              <p className="text-gray-400">
                Detailed view of all your payments and bookings
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-gray-400 text-sm">Total Spent</div>
                <div className="text-xl font-bold text-purple-400">
                  {formatCurrency(totalExpense * 100)}
                </div>
              </div>
              <div className="h-8 w-px bg-gray-600"></div>
              <div className="text-gray-400 text-sm">
                {payments.length} transaction
                {payments.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-800/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <FiCreditCard className="text-gray-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-3">
                No transactions yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Your payment history will appear here once you start making
                bookings and payments.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <div
                  key={payment._id || payment.providerPaymentId || index}
                  className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Payment Basic Info */}
                    <div className="flex items-start justify-between xl:col-span-1">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl border ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                        </div>
                        <div>
                          <div
                            className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {payment.status?.charAt(0).toUpperCase() +
                              payment.status?.slice(1)}
                          </div>
                          <div className="text-white text-2xl font-bold mt-2">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="xl:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <FiFilm className="text-purple-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm text-gray-400">Movie</div>
                              <div className="text-white font-medium truncate">
                                {payment.sessionTitle || "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <FiHash className="text-blue-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm text-gray-400">
                                Booking ID
                              </div>
                              <div className="text-white font-mono text-sm truncate">
                                {payment.bookingId || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <FiCreditCard className="text-green-400 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-400">
                                Provider
                              </div>
                              <div className="text-white font-medium capitalize">
                                {payment.provider || "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <FiCalendar className="text-orange-400 flex-shrink-0" />
                            <div>
                              <div className="text-sm text-gray-400">Date</div>
                              <div className="text-white text-sm">
                                {payment.createdAt
                                  ? formatDate(payment.createdAt)
                                  : "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {payment.transactionId && (
                        <div className="mt-4 flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                          <FiHash className="text-cyan-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm text-gray-400">
                              Transaction ID
                            </div>
                            <div className="text-white font-mono text-xs break-all">
                              {payment.transactionId}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
