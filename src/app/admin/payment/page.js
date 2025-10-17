'use client';
import { useEffect, useState } from 'react';
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
import {
    FiDollarSign, FiShoppingCart, FiCheckCircle, FiClock, FiTrendingUp,
    FiCalendar, FiUser, FiFilm, FiRefreshCw, FiArrowLeft, FiAlertCircle,
    FiBarChart2, FiGrid
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
    const [activeTab, setActiveTab] = useState('today'); // 'today' or 'weekly'

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

            // Sort bookings by latest first (newest createdAt first)
            const sortedBookings = bookingsRes.data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setBookings(sortedBookings);

            // Sort payments by latest first (newest createdAt first)
            const sortedPayments = paymentsRes.data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setPayments(sortedPayments);

            // API returns array of objects like [{ name: "Fri", revenue: 0 }, ...]
            setRevenueData(revenueRes.data.map(item => ({
                day: item.name,
                amount: item.revenue
            })));
            ;
            // setRevenueData(chartData);

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Get today's date in YYYY-MM-DD format
    const getTodayDateString = () => {
        return new Date().toISOString().split('T')[0];
    };

    // Filter today's payments (already sorted by latest first)
    const todayDate = getTodayDateString();
    const todayPayments = payments.filter(payment =>
        payment.createdAt && payment.createdAt.includes(todayDate)
    );

    // Get this week's payments (last 7 days) - already sorted by latest first
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    const last7Days = getLast7Days();
    const weeklyPayments = payments.filter(payment =>
        payment.createdAt && last7Days.some(day => payment.createdAt.includes(day))
    );

    // Calculate statistics for today
    const todayStats = {
        totalRevenue: todayPayments.reduce((sum, payment) => sum + payment.amount, 0),
        totalBookings: bookings.filter(booking =>
            booking.createdAt && booking.createdAt.includes(todayDate)
        ).length,
        paidBookings: bookings.filter(b =>
            b.paymentStatus === 'paid' && b.createdAt && b.createdAt.includes(todayDate)
        ).length,
        pendingPayments: todayPayments.filter(p => p.status === 'pending').length,
        refundedPayments: todayPayments.filter(p => p.status === 'refunded').length,
        totalRefunds: todayPayments
            .filter(p => p.status === 'refunded')
            .reduce((sum, payment) => sum + (payment.refundAmount || 0), 0)
    };

    // Calculate statistics for weekly
    const weeklyStats = {
        totalRevenue: weeklyPayments.reduce((sum, payment) => sum + payment.amount, 0),
        totalBookings: bookings.filter(booking =>
            booking.createdAt && last7Days.some(day => booking.createdAt.includes(day))
        ).length,
        paidBookings: bookings.filter(b =>
            b.paymentStatus === 'paid' && b.createdAt && last7Days.some(day => b.createdAt.includes(day))
        ).length,
        pendingPayments: weeklyPayments.filter(p => p.status === 'pending').length,
        refundedPayments: weeklyPayments.filter(p => p.status === 'refunded').length,
        totalRefunds: weeklyPayments
            .filter(p => p.status === 'refunded')
            .reduce((sum, payment) => sum + (payment.refundAmount || 0), 0)
    };

    // Get payments based on active tab (already sorted by latest first)
    const getActivePayments = () => {
        return activeTab === 'today' ? todayPayments : weeklyPayments;
    };

    const activePayments = getActivePayments();

    // Get recent payments - latest first (already sorted from API)
    const recentPayments = activePayments.slice(0, 10);

    // Get unpaid bookings based on active tab (latest first)
    const getUnpaidBookings = () => {
        const unpaid = bookings.filter(b =>
            b.paymentStatus === 'unpaid' &&
            (activeTab === 'today'
                ? b.createdAt && b.createdAt.includes(todayDate)
                : b.createdAt && last7Days.some(day => b.createdAt.includes(day))
            )
        );
        return unpaid.slice(0, 5); // Already sorted by latest first
    };

    const unpaidBookings = getUnpaidBookings();

    // Get refunded payments based on active tab (latest first)
    const getRefundedPayments = () => {
        const refunded = activeTab === 'today'
            ? todayPayments.filter(p => p.status === 'refunded')
            : weeklyPayments.filter(p => p.status === 'refunded');
        return refunded.slice(0, activeTab === 'today' ? 3 : 5); // Already sorted by latest first
    };

    const refundedPayments = getRefundedPayments();

    // Create revenue breakdown based on active tab
    const getRevenueBreakdown = () => {
        if (activeTab === 'today') {
            return [
                {
                    day: 'Today',
                    amount: todayStats.totalRevenue,
                    count: todayPayments.length
                }
            ];
        } else {
            return revenueData.map(item => {
                const normalizedItemDay = item.day.slice(0, 3).toLowerCase(); // e.g. "Mon"
                const count = weeklyPayments.filter(payment => {
                    const paymentDay = new Date(payment.createdAt)
                        .toLocaleDateString('en-US', { weekday: 'short' })
                        .toLowerCase(); // e.g. "mon"
                    return paymentDay === normalizedItemDay;
                }).length;

                return { ...item, count };
            });

        }
    };

    const revenueBreakdown = getRevenueBreakdown();

    // Get active stats based on tab
    const activeStats = activeTab === 'today' ? todayStats : weeklyStats;

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
        return <AdminLoading />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233] p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    Payments Dashboard
                </h1>
                <p className="text-gray-400 text-lg">
                    {activeTab === 'today' ? "Today's payments and revenue tracking" : "Weekly payments and revenue overview"}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-green-400">
                    <FiCalendar className="text-green-400" />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('today')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'today'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    <FiCalendar className="text-lg" />
                    Today's Overview
                </button>
                <button
                    onClick={() => setActiveTab('weekly')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'weekly'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    <FiBarChart2 className="text-lg" />
                    Weekly Overview
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title={activeTab === 'today' ? "Today's Revenue" : "Weekly Revenue"}
                    value={`$${activeStats.totalRevenue.toLocaleString()}`}
                    icon={<FiDollarSign />}
                    color="from-purple-500 to-pink-500"
                    trend={`${activePayments.length} payments`}
                />
                <StatCard
                    title={activeTab === 'today' ? "Today's Bookings" : "Weekly Bookings"}
                    value={activeStats.totalBookings.toLocaleString()}
                    icon={<FiShoppingCart />}
                    color="from-blue-500 to-cyan-500"
                    trend={`${activeStats.paidBookings} paid`}
                />
                <StatCard
                    title={activeTab === 'today' ? "Paid Today" : "Paid This Week"}
                    value={activeStats.paidBookings.toLocaleString()}
                    icon={<FiCheckCircle />}
                    color="from-green-500 to-emerald-500"
                    trend={`${activeStats.pendingPayments} pending`}
                />
                <StatCard
                    title={activeTab === 'today' ? "Refunds Today" : "Weekly Refunds"}
                    value={`$${activeStats.totalRefunds.toLocaleString()}`}
                    icon={<FiRefreshCw />}
                    color="from-orange-500 to-red-500"
                    trend={`${activeStats.refundedPayments} refunds`}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column - Payments */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Payments Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <FiTrendingUp className="text-green-400" />
                                {activeTab === 'today' ? "Today's Payments" : "Weekly Payments"}
                                <span className="text-sm text-green-400 ml-2">(Latest First)</span>
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                                    {recentPayments.length} transactions
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${activeTab === 'today'
                                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    }`}>
                                    {activeTab === 'today' ? 'TODAY' : 'THIS WEEK'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {recentPayments.length > 0 ? recentPayments.map((payment, index) => (
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
                                                <p className="text-blue-400 text-xs font-semibold mt-1">
                                                    #{index + 1} Latest
                                                </p>
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
                                                {new Date(payment.createdAt).toLocaleDateString()} at {' '}
                                                {new Date(payment.createdAt).toLocaleTimeString()}
                                            </p>
                                            <p className="text-green-400 text-xs font-semibold mt-1">
                                                Latest Transaction
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <FiDollarSign className="text-gray-500 text-4xl mx-auto mb-3" />
                                    <p className="text-gray-400 text-lg">
                                        {activeTab === 'today' ? 'No payments today' : 'No payments this week'}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {activeTab === 'today'
                                            ? 'All payments made today will appear here'
                                            : 'All payments made this week will appear here'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Revenue Breakdown Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <FiBarChart2 className="text-blue-400" />
                            {activeTab === 'today' ? "Today's Revenue" : "Weekly Revenue Breakdown"}
                        </h2>

                        <div className="space-y-3">
                            {revenueBreakdown.map((item, index) => (
                                <div key={index} className={`flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors ${activeTab === 'today' ? 'border border-green-500/20' : 'border border-blue-500/20'
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeTab === 'today'
                                            ? 'bg-green-500/20'
                                            : 'bg-blue-500/20'
                                            }`}>
                                            <FiDollarSign className={
                                                activeTab === 'today' ? 'text-green-400' : 'text-blue-400'
                                            } />
                                        </div>
                                        <div>
                                            <span className="text-white font-medium text-lg">{item.day}</span>
                                            <p className="text-gray-400 text-sm">{item.count} transactions</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`font-bold text-xl ${activeTab === 'today' ? 'text-green-400' : 'text-blue-400'
                                            }`}>
                                            ${item.amount.toLocaleString()}
                                        </span>
                                        <p className="text-gray-500 text-sm">total revenue</p>
                                    </div>
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
                                {activeTab === 'today' ? "Today's Unpaid" : "Weekly Unpaid"}
                                <span className="text-sm text-orange-400 ml-2">(Latest First)</span>
                            </h2>
                            <span className="bg-red-500/20 text-red-400 px-8  py-2 rounded-xl text-sm">
                                {unpaidBookings.length} pending
                            </span>
                        </div>

                        <div className="space-y-4">
                            {unpaidBookings.length > 0 ? unpaidBookings.map((booking, index) => (
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
                                                <p className="text-orange-400 text-xs font-semibold mt-1">
                                                    #{index + 1} Latest
                                                </p>
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
                                            {new Date(booking.createdAt).toLocaleDateString()}
                                            <br />
                                            <span className="text-green-400">Latest</span>
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-4">
                                    <FiCheckCircle className="text-green-400 text-2xl mx-auto mb-2" />
                                    <p className="text-gray-400">
                                        {activeTab === 'today' ? 'No unpaid bookings today' : 'No unpaid bookings this week'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Refunds Card */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-900/55 rounded-2xl border border-gray-700 p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <FiRefreshCw className="text-red-400" />
                                {activeTab === 'today' ? "Today's Refunds" : "Weekly Refunds"}
                                <span className="text-sm text-red-400 ml-2">(Latest First)</span>
                            </h2>
                            <span className="bg-red-500/20 text-red-400 px-8 py-1 rounded-xl text-sm">
                                {refundedPayments.length} refunds
                            </span>
                        </div>

                        <div className="space-y-4">
                            {refundedPayments.length > 0 ? refundedPayments.map((payment, index) => (
                                <div
                                    key={payment._id}
                                    className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 border border-red-500/20"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="text-white font-semibold">${payment.refundAmount || payment.amount}</p>
                                            <p className="text-blue-400 text-xs font-semibold">#{index + 1} Latest Refund</p>
                                        </div>
                                        <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                                            Refunded
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{payment.provider}</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {new Date(payment.updatedAt || payment.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            )) : (
                                <div className="text-center py-4">
                                    <FiRefreshCw className="text-gray-500 text-2xl mx-auto mb-2" />
                                    <p className="text-gray-400">
                                        {activeTab === 'today' ? 'No refunds processed today' : 'No refunds processed this week'}
                                    </p>
                                </div>
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