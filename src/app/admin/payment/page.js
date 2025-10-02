'use client';
import { useEffect, useState } from 'react';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import {
    FiDollarSign, FiShoppingCart, FiCheckCircle, FiClock, FiTrendingUp,
    FiCalendar, FiUser, FiFilm, FiRefreshCw, FiArrowLeft, FiAlertCircle
} from 'react-icons/fi';
import StatCard from '../components/StartCard';
import toast from 'react-hot-toast';
import AdminLoading from '../components/AdminLoading';

export default function PaymentsPage() {
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [refundModalOpen, setRefundModalOpen] = useState(false);
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');

    // Fetch all data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingsRes, paymentsRes, revenueRes] = await Promise.all([
                axiosSecure.get('/api/ticket'),
                axiosSecure.get('/api/payments'),
                axiosSecure.get('/api/payments/weekly-revenue')
            ]);

            setBookings(bookingsRes.data);
            setPayments(paymentsRes.data);

            const chartData = Object.entries(revenueRes.data).map(([day, amount]) => ({
                day,
                amount
            }));
            setRevenueData(chartData);

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const stats = {
        totalRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0),
        totalBookings: bookings.length,
        paidBookings: bookings.filter(b => b.paymentStatus === 'paid').length,
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        refundedPayments: payments.filter(p => p.status === 'refunded').length,
        totalRefunds: payments
            .filter(p => p.status === 'refunded')
            .reduce((sum, payment) => sum + (payment.refundAmount || 0), 0)
    };

    // Get recent payments (last 5)
    const recentPayments = payments.slice(0, 5);

    // Get unpaid bookings
    const unpaidBookings = bookings.filter(b => b.paymentStatus === 'unpaid').slice(0, 5);

    // Get refunded payments
    const refundedPayments = payments.filter(p => p.status === 'refunded').slice(0, 3);

    // Refund API Functions
    const handleRefund = async (payment) => {
        setSelectedPayment(payment);
        setRefundAmount(payment.amount.toString());
        setRefundModalOpen(true);
    };

    const processRefund = async () => {
        if (!selectedPayment || !refundAmount || !refundReason) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            const refundData = {
                paymentId: selectedPayment._id,
                amount: parseFloat(refundAmount),
                reason: refundReason,
                currency: selectedPayment.currency || 'usd'
            };

            // Call refund API
            const response = await axiosSecure.post('/api/payments/refund', refundData);

            toast.success('Refund processed successfully!');

            // Reset form and close modal
            setRefundModalOpen(false);
            setRefundAmount('');
            setRefundReason('');
            setSelectedPayment(null);

            // Refresh data
            fetchData();

        } catch (error) {
            console.error('Refund error:', error);
            toast.error(error.response?.data?.message || 'Failed to process refund');
        }
    };

    const cancelRefund = () => {
        setRefundModalOpen(false);
        setRefundAmount('');
        setRefundReason('');
        setSelectedPayment(null);
    };

    // Check if payment can be refunded
    const canRefund = (payment) => {
        return payment.status === 'success' &&
            !payment.refunded &&
            new Date(payment.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Within 30 days
    };

    if (loading) {
        return <AdminLoading/>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233] p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                 Payments Dashboard
                </h1>
                <p className="text-gray-400 text-lg">Manage payments, refunds and track revenue in real-time</p>
            </div>

            {/* Statistics Cards with Icons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    icon={<FiDollarSign />}
                    color="from-purple-500 to-pink-500"
                    trend="+12%"
                />
                <StatCard
                    title="Total Bookings"
                    value={stats.totalBookings.toLocaleString()}
                    icon={<FiShoppingCart />}
                    color="from-blue-500 to-cyan-500"
                    trend="+8%"
                />
                <StatCard
                    title="Paid Bookings"
                    value={stats.paidBookings.toLocaleString()}
                    icon={<FiCheckCircle />}
                    color="from-green-500 to-emerald-500"
                    trend="+15%"
                />
                <StatCard
                    title="Total Refunds"
                    value={`$${stats.totalRefunds.toLocaleString()}`}
                    icon={<FiRefreshCw />}
                    color="from-orange-500 to-red-500"
                    trend={stats.totalRefunds > 0 ? `-${stats.totalRefunds}` : '0%'}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Recent Payments */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Recent Payments Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <FiTrendingUp className="text-green-400" />
                                Recent Payments
                            </h2>
                            <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                                Last 5 transactions
                            </span>
                        </div>

                        <div className="space-y-4">
                            {recentPayments.map((payment) => (
                                <div
                                    key={payment._id}
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 hover:border-gray-500/30 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${payment.status === 'success' ? 'bg-green-500/20' :
                                                    payment.status === 'pending' ? 'bg-yellow-500/20' :
                                                        payment.status === 'refunded' ? 'bg-red-500/20' : 'bg-gray-500/20'
                                                }`}>
                                                <FiDollarSign className={
                                                    payment.status === 'success' ? 'text-green-400' :
                                                        payment.status === 'pending' ? 'text-yellow-400' :
                                                            payment.status === 'refunded' ? 'text-red-400' : 'text-gray-400'
                                                } />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold text-lg">
                                                    ${payment.amount.toLocaleString()}
                                                </p>
                                                <p className="text-gray-400 text-sm capitalize">{payment.provider}</p>
                                                {payment.refundAmount && (
                                                    <p className="text-red-400 text-xs">
                                                        Refunded: ${payment.refundAmount}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${payment.status === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                        payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                            payment.status === 'refunded' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                                'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                                    }`}>
                                                    {payment.status}
                                                </span>
                                                {canRefund(payment) && (
                                                    <button
                                                        onClick={() => handleRefund(payment)}
                                                        className="p-1 text-orange-400 hover:bg-orange-500/20 rounded-lg transition-colors"
                                                        title="Process Refund"
                                                    >
                                                        <FiRefreshCw size={14} />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-500 text-xs">
                                                {new Date(payment.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Revenue Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <FiCalendar className="text-blue-400" />
                            Weekly Revenue Breakdown
                        </h2>

                        <div className="space-y-3">
                            {revenueData.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-400 font-semibold text-sm">{item.day.slice(0, 3)}</span>
                                        </div>
                                        {/* <span className="text-white font-medium">{item.day}</span> */}
                                    </div>
                                    <span className="text-green-400 font-bold text-lg">${item.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Unpaid Bookings Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <FiClock className="text-orange-400" />
                                Unpaid Bookings
                            </h2>
                            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                                {unpaidBookings.length} pending
                            </span>
                        </div>

                        <div className="space-y-4">
                            {unpaidBookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600 hover:border-gray-500/30 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                <FiFilm className="text-red-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold line-clamp-1">{booking.movieTitle}</p>
                                                <p className="text-gray-400 text-sm">{booking.userName}</p>
                                            </div>
                                        </div>
                                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-semibold">
                                            Unpaid
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4">
                                            <span className="text-yellow-400 font-bold">${booking.totalAmount}</span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-400">{booking.selectedSeats?.length} seats</span>
                                        </div>
                                        <span className="text-gray-500 text-xs">
                                            {new Date(booking.showDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Refunds Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <FiRefreshCw className="text-red-400" />
                                Recent Refunds
                            </h2>
                            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                                {refundedPayments.length} refunds
                            </span>
                        </div>

                        <div className="space-y-4">
                            {refundedPayments.map((payment) => (
                                <div
                                    key={payment._id}
                                    className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 border border-red-500/20"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-white font-semibold">${payment.refundAmount || payment.amount}</p>
                                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                                            Refunded
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{payment.provider}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {new Date(payment.updatedAt || payment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                            {refundedPayments.length === 0 && (
                                <p className="text-gray-400 text-center py-4">No refunds processed yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Refund Modal */}
            {refundModalOpen && selectedPayment && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <button onClick={cancelRefund} className="p-2 hover:bg-gray-700 rounded-lg">
                                    <FiArrowLeft className="text-gray-400" />
                                </button>
                                <h2 className="text-2xl font-bold text-white">Process Refund</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-700/50 p-4 rounded-lg">
                                    <p className="text-gray-400 text-sm">Payment Details</p>
                                    <p className="text-white font-semibold">${selectedPayment.amount} • {selectedPayment.provider}</p>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(selectedPayment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Refund Amount ($)</label>
                                    <input
                                        type="number"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter refund amount"
                                        max={selectedPayment.amount}
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-2">Refund Reason</label>
                                    <textarea
                                        value={refundReason}
                                        onChange={(e) => setRefundReason(e.target.value)}
                                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Reason for refund..."
                                        rows="3"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={cancelRefund}
                                        className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={processRefund}
                                        className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
                                    >
                                        Process Refund
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



// POST /api/payments/refund
// Request Body:
// {
//   paymentId: "string",
//   amount: number,
//   reason: "string",
//   currency: "string"
// }

// // Response:
// {
//  success: true,
//   refundId: "string",
//  message: "Refund processed successfully"
// }

// // Your payment objects should support:
// {
//     _id: "string",
//     amount: number,
//    status: "success" | "pending" | "failed" | "refunded",
//   refundAmount: number, // optional
//   refunded: boolean, // optional
//   provider: "string",
//   createdAt: "date",
//  updatedAt: "date"
// }