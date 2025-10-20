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
  FiGlobe,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import LoadingSpinner from "../hooks/LoadingSpiner";

export default function PaymentHistory() {
  const { user } = useAuth();
  const userEmail = user?.email;
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalExpenseUSD, setTotalExpenseUSD] = useState(0);
  const [totalExpenseBDT, setTotalExpenseBDT] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

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

        // Calculate total expenses by currency
        const usdExpense = data
          .filter(
            (payment) =>
              payment.status === "paid" &&
              (payment.currency === "usd" || !payment.currency)
          )
          .reduce((total, payment) => total + payment.amount, 0);

        const bdtExpense = data
          .filter(
            (payment) => payment.status === "paid" && payment.currency === "BDT"
          )
          .reduce((total, payment) => total + payment.amount, 0);

        setTotalExpenseUSD(usdExpense);
        setTotalExpenseBDT(bdtExpense);
      } catch (error) {
        console.error("❌ Fetch payments error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [userEmail]);

  console.log(payments);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = payments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(payments.length / itemsPerPage);

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
    const currencyConfig = {
      usd: { style: "currency", currency: "USD" },
      bdt: { style: "currency", currency: "BDT" },
    };

    const config = currencyConfig[currency.toLowerCase()] || currencyConfig.usd;

    return new Intl.NumberFormat(
      "en-IN", // Use English digits for BDT
      config
    ).format(amount);
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

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (isLoading) {
    return <LoadingSpinner />;
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {/* Total USD Expense */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-blue-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-lg font-semibold text-gray-300 mb-2 truncate">
                  Total USD
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl md:text-3xl font-bold text-blue-400 truncate">
                    {formatCurrency(totalExpenseUSD, "usd")}
                  </span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm mt-2">
                  USD spending
                </p>
              </div>
              <div className="bg-blue-500/20 p-2 md:p-3 rounded-xl group-hover:bg-blue-500/30 transition-colors flex-shrink-0 ml-2">
                <FiDollarSign className="text-blue-400 text-lg md:text-2xl" />
              </div>
            </div>
          </div>

          {/* Total BDT Expense */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-green-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-lg font-semibold text-gray-300 mb-2 truncate">
                  Total BDT
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl md:text-3xl font-bold text-green-400 truncate">
                    {formatCurrency(totalExpenseBDT, "bdt")}
                  </span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm mt-2">
                  BDT spending
                </p>
              </div>
              <div className="bg-green-500/20 p-2 md:p-3 rounded-xl group-hover:bg-green-500/30 transition-colors flex-shrink-0 ml-2">
                <FiGlobe className="text-green-400 text-lg md:text-2xl" />
              </div>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-purple-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-lg font-semibold text-gray-300 mb-2 truncate">
                  Total Transactions
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl md:text-3xl font-bold text-purple-400">
                    {totalTransactions}
                  </span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm mt-2">
                  All payments
                </p>
              </div>
              <div className="bg-purple-500/20 p-2 md:p-3 rounded-xl group-hover:bg-purple-500/30 transition-colors flex-shrink-0 ml-2">
                <FiCreditCard className="text-purple-400 text-lg md:text-2xl" />
              </div>
            </div>
          </div>

          {/* Successful Payments */}
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-orange-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-lg font-semibold text-gray-300 mb-2 truncate">
                  Completed
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl md:text-3xl font-bold text-orange-400">
                    {successfulPayments}
                  </span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm mt-2">
                  Successful payments
                </p>
              </div>
              <div className="bg-orange-500/20 p-2 md:p-3 rounded-xl group-hover:bg-orange-500/30 transition-colors flex-shrink-0 ml-2">
                <FiCheckCircle className="text-orange-400 text-lg md:text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-4 md:p-6 border border-gray-700/50 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 truncate">
                Transaction History
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Detailed view of all your payments and bookings
              </p>
            </div>
            <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-normal">
              <div className="text-right sm:text-left">
                <div className="text-gray-400 text-xs md:text-sm">
                  Total Spent
                </div>
                <div className="text-lg md:text-xl font-bold text-purple-400 truncate">
                  {formatCurrency(totalExpenseUSD + totalExpenseBDT, "usd")}
                </div>
              </div>
              <div className="h-6 md:h-8 w-px bg-gray-600"></div>
              <div className="text-gray-400 text-xs md:text-sm whitespace-nowrap">
                {payments.length} transaction{payments.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="bg-gray-800/50 rounded-full w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 md:mb-6">
                <FiCreditCard className="text-gray-500 text-xl md:text-3xl" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-400 mb-3">
                No transactions yet
              </h3>
              <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto">
                Your payment history will appear here once you start making
                bookings and payments.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                {currentPayments.map((payment, index) => (
                  <div
                    key={payment._id || payment.providerPaymentId || index}
                    className="bg-gray-800/40 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6">
                      {/* Payment Basic Info */}
                      <div className="flex items-start justify-between lg:justify-start lg:flex-1">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div
                            className={`p-2 md:p-3 rounded-xl border ${getStatusColor(
                              payment.status
                            )}`}
                          >
                            {getStatusIcon(payment.status)}
                          </div>
                          <div>
                            <div
                              className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold border ${getStatusColor(
                                payment.status
                              )}`}
                            >
                              {payment.status?.charAt(0).toUpperCase() +
                                payment.status?.slice(1)}
                            </div>
                            <div className="text-white text-lg md:text-2xl font-bold mt-1 md:mt-2">
                              {formatCurrency(payment.amount, payment.currency)}
                            </div>
                            <div className="text-gray-400 text-xs md:text-sm mt-1 capitalize">
                              {payment.currency?.toUpperCase() || "USD"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <FiFilm className="text-purple-400 flex-shrink-0 text-sm md:text-base" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs md:text-sm text-gray-400">
                                  Movie
                                </div>
                                <div className="text-white font-medium truncate text-sm md:text-base">
                                  {payment.sessionTitle || "N/A"}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3">
                              <FiHash className="text-blue-400 flex-shrink-0 text-sm md:text-base" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs md:text-sm text-gray-400">
                                  Booking ID
                                </div>
                                <div className="text-white font-mono text-xs truncate">
                                  {payment.bookingId || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 md:space-y-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <FiCreditCard className="text-green-400 flex-shrink-0 text-sm md:text-base" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs md:text-sm text-gray-400">
                                  Provider
                                </div>
                                <div className="text-white font-medium capitalize text-sm md:text-base">
                                  {payment.provider || "N/A"}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3">
                              <FiCalendar className="text-orange-400 flex-shrink-0 text-sm md:text-base" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs md:text-sm text-gray-400">
                                  Date
                                </div>
                                <div className="text-white text-xs md:text-sm">
                                  {payment.createdAt
                                    ? formatDate(payment.createdAt)
                                    : "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {payment.transactionId && (
                          <div className="mt-3 md:mt-4 flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-700/30 rounded-lg">
                            <FiHash className="text-cyan-400 flex-shrink-0 text-sm md:text-base" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs md:text-sm text-gray-400">
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

              {/* Pagination */}
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
                            index > 0 && page - array[index - 1] > 1;
                          return (
                            <div key={page} className="flex items-center">
                              {showEllipsis && (
                                <span className="px-2 text-gray-500">...</span>
                              )}
                              <button
                                onClick={() => paginate(page)}
                                className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
                                  currentPage === page
                                    ? "bg-purple-500/20 border-purple-500/50 text-purple-400"
                                    : "bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
                                }`}
                              >
                                {page}
                              </button>
                            </div>
                          );
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
