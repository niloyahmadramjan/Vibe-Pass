"use client";
import { useEffect, useState } from "react";
import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
import { motion } from "framer-motion";
import { FiDollarSign,FiUsers,FiShoppingCart,FiActivity,FiTrendingUp,FiFilm,FiStar,FiBarChart2,FiTag
} from "react-icons/fi";
import toast from "react-hot-toast";
import StatCard from "../components/StartCard";
import AdminLoading from "../components/AdminLoading";

export default function AnalyticsDashboard() {
    const [tickets, setTickets] = useState([]);
    const [payments, setPayments] = useState({});
    const [movies, setMovies] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [ticketsRes, paymentsRes, moviesRes, couponsRes] = await Promise.all([
                axiosSecure.get("/api/ticket"),
                axiosSecure.get("/api/payments/weekly-revenue"),
                axiosSecure.get("/api/movies"),
                axiosSecure.get("/api/coupons")
            ]);

            setTickets(ticketsRes.data);
            setPayments(paymentsRes.data);
            setMovies(moviesRes.data);
            setCoupons(couponsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    // Calculate analytics from available data
    const calculateAnalytics = () => {
        // Revenue calculations
        const totalRevenue = tickets.reduce((sum, ticket) => sum + (ticket.totalAmount || 0), 0);
        const paidTickets = tickets.filter(ticket => ticket.paymentStatus === 'paid');
        const paidRevenue = paidTickets.reduce((sum, ticket) => sum + (ticket.totalAmount || 0), 0);
        const pendingTickets = tickets.filter(ticket => ticket.paymentStatus === 'unpaid');

        // Date-based calculations
        const today = new Date().toDateString();
        const todayRevenue = tickets
            .filter(ticket => new Date(ticket.createdAt).toDateString() === today && ticket.paymentStatus === 'paid')
            .reduce((sum, ticket) => sum + (ticket.totalAmount || 0), 0);

        // User statistics
        const uniqueUsers = [...new Set(tickets.map(ticket => ticket.userId))].length;

        // Coupon statistics
        const activeCoupons = coupons.filter(coupon => coupon.active);
        const usedCoupons = coupons.filter(coupon => coupon.usedCount > 0);
        const totalCouponDiscount = usedCoupons.reduce((sum, coupon) => {
            if (coupon.discountType === 'percentage') {
                return sum + (coupon.discountValue || 0);
            }
            return sum + (coupon.discountValue || 0);
        }, 0);

        return {
            // Revenue stats
            totalRevenue,
            paidRevenue,
            weeklyRevenue: payments.totalRevenue || 0,
            todayRevenue,
            weeklyTicketCount: payments.count || 0,

            // Ticket stats
            totalTickets: tickets.length,
            confirmedTickets: paidTickets.length,
            pendingTickets: pendingTickets.length,

            // User stats
            uniqueUsers,

            // Coupon stats
            totalCoupons: coupons.length,
            activeCoupons: activeCoupons.length,
            usedCoupons: usedCoupons.length,
            totalCouponDiscount,

            // Popularity (based on tickets if movie data is available)
            popularMovie: getPopularMovie(),

            // Conversion rate
            conversionRate: tickets.length > 0 ? (paidTickets.length / tickets.length) * 100 : 0
        };
    };

    const getPopularMovie = () => {
        // If you have movie titles in tickets, use that
        const movieTickets = tickets.filter(ticket => ticket.movieTitle);
        if (movieTickets.length > 0) {
            const movieCounts = movieTickets.reduce((acc, ticket) => {
                acc[ticket.movieTitle] = (acc[ticket.movieTitle] || 0) + 1;
                return acc;
            }, {});
            const popular = Object.entries(movieCounts).sort((a, b) => b[1] - a[1])[0];
            return popular ? `${popular[0]} (${popular[1]} tickets)` : 'No data';
        }
        return `${movies.length} movies available`;
    };

    const analytics = calculateAnalytics();

    if (loading) return <AdminLoading />;

    return (
        <div className="space-y-6 mt-6  p-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${analytics.totalRevenue.toLocaleString()}`}
                    subtitle={`$${analytics.paidRevenue.toLocaleString()} collected`}
                    icon={<FiDollarSign />}
                    color="from-purple-600/20 to-blue-600/20"
                />

                <StatCard
                    title="Total Tickets"
                    value={analytics.totalTickets.toLocaleString()}
                    subtitle={`${analytics.confirmedTickets} paid, ${analytics.pendingTickets} pending`}
                    icon={<FiShoppingCart />}
                    color="from-green-600/20 to-emerald-600/20"
                />

                <StatCard
                    title="Weekly Performance"
                    value={`$${analytics.weeklyRevenue.toLocaleString()}`}
                    subtitle={`${analytics.weeklyTicketCount} tickets this week`}
                    icon={<FiTrendingUp />}
                    color="from-blue-600/20 to-cyan-600/20"
                />

                <StatCard
                    title="Conversion Rate"
                    value={`${analytics.conversionRate.toFixed(1)}%`}
                    subtitle={`${analytics.uniqueUsers} unique users`}
                    icon={<FiUsers />}
                    color="from-orange-600/20 to-red-600/20"
                />
            </div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Summary */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-2xl border border-gray-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiBarChart2 className="text-blue-400" />
                        Revenue Overview
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Total Revenue</span>
                            <span className="text-white font-semibold">
                                ${analytics.totalRevenue.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Paid Revenue</span>
                            <span className="text-green-400 font-semibold">
                                ${analytics.paidRevenue.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Today's Revenue</span>
                            <span className="text-blue-400 font-semibold">
                                ${analytics.todayRevenue.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Weekly Revenue</span>
                            <span className="text-purple-400 font-semibold">
                                ${analytics.weeklyRevenue.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-2xl border border-gray-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiActivity className="text-green-400" />
                        Quick Stats
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total Movies</span>
                            <span className="text-white font-bold">{movies.length}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Active Coupons</span>
                            <span className="text-green-400 font-bold">{analytics.activeCoupons}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Unique Users</span>
                            <span className="text-blue-400 font-bold">{analytics.uniqueUsers}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Popular</span>
                            <span className="text-yellow-400 font-bold text-sm text-right">
                                {analytics.popularMovie}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Coupons & Additional Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  ">
                {/* Coupon Analytics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-2xl border border-gray-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiTag className="text-purple-400" />
                        Coupon Analytics
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total Coupons</span>
                            <span className="text-white font-bold">{analytics.totalCoupons}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Active Coupons</span>
                            <span className="text-green-400 font-bold">{analytics.activeCoupons}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Used Coupons</span>
                            <span className="text-blue-400 font-bold">{analytics.usedCoupons}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total Discount</span>
                            <span className="text-yellow-400 font-bold">
                                ${analytics.totalCouponDiscount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Ticket Status Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-2xl border border-gray-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiStar className="text-yellow-400" />
                        Ticket Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Paid Tickets</span>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-sm">{analytics.confirmedTickets} tickets</span>
                                <span className="text-green-400 font-bold">
                                    {((analytics.confirmedTickets / analytics.totalTickets) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Pending Tickets</span>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-sm">{analytics.pendingTickets} tickets</span>
                                <span className="text-orange-400 font-bold">
                                    {((analytics.pendingTickets / analytics.totalTickets) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total Processed</span>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-sm">{analytics.totalTickets} tickets</span>
                                <span className="text-blue-400 font-bold">100%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}