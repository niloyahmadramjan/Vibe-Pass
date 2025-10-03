"use client";
import { useEffect, useState } from "react";
import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiDollarSign,
    FiUsers,
    FiShoppingCart,
    FiActivity,
    FiTrendingUp,
    FiFilm,
    FiCalendar,
    FiBarChart2,
    FiStar
} from "react-icons/fi";
import toast from "react-hot-toast";
import StatCard from "../components/StartCard";
import AdminLoading from "../components/AdminLoading";

export default function AnalyticsDashboard() {
    const [showtimes, setShowtimes] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [weeklyRevenue, setWeeklyRevenue] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [showtimesRes, bookingsRes, revenueRes] = await Promise.all([
                axiosSecure.get("/api/showtimes"),
                axiosSecure.get("/api/ticket"),
                axiosSecure.get("/api/payments/weekly-revenue")
            ]);

            setShowtimes(showtimesRes.data);
            setBookings(bookingsRes.data);
            setWeeklyRevenue(revenueRes.data);
        } catch (error) {
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    // Calculate analytics from your data
    const calculateAnalytics = () => {
        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
        const totalSeatsBooked = bookings.reduce((sum, booking) => sum + (booking.selectedSeats?.length || 0), 0);

        // Calculate occupancy rate from showtimes
        const totalSeatsCapacity = showtimes.reduce((sum, st) => sum + (st.totalSeats || 0), 0);
        const occupiedSeats = showtimes.reduce((sum, st) => sum + (st.totalSeats - st.availableSeats), 0);
        const occupancyRate = totalSeatsCapacity > 0 ? (occupiedSeats / totalSeatsCapacity) * 100 : 0;

        // Weekly revenue total
        const weeklyTotal = Object.values(weeklyRevenue).reduce((sum, revenue) => sum + revenue, 0);

        // Today's revenue
        const today = new Date().toDateString();
        const todayRevenue = bookings
            .filter(booking => new Date(booking.createdAt).toDateString() === today)
            .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

        // Popular movie from bookings
        const movieCounts = bookings.reduce((acc, booking) => {
            acc[booking.movieTitle] = (acc[booking.movieTitle] || 0) + 1;
            return acc;
        }, {});
        const popularMovie = Object.entries(movieCounts).sort((a, b) => b[1] - a[1])[0];

        return {
            totalRevenue,
            confirmedBookings,
            totalSeatsBooked,
            occupancyRate,
            weeklyTotal,
            todayRevenue,
            popularMovie: popularMovie ? `${popularMovie[0]} (${popularMovie[1]} bookings)` : 'No data',
            totalShows: showtimes.length,
            activeShows: showtimes.filter(st => st.status === "Active").length
        };
    };

    const analytics = calculateAnalytics();

    if (loading) return <AdminLoading/>

    return (
        <div className="space-y-6 mt-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${analytics.totalRevenue.toLocaleString()}`}
                    subtitle={`$${analytics.todayRevenue.toLocaleString()} today`}
                    icon={<FiDollarSign />}
                    color="from-purple-600/20 to-blue-600/20"
                />

                <StatCard
                    title="Total Bookings"
                    value={analytics.confirmedBookings.toLocaleString()}
                    subtitle={`${analytics.totalSeatsBooked} seats booked`}
                    icon={<FiShoppingCart />}
                    color="from-green-600/20 to-emerald-600/20"
                />

                <StatCard
                    title="Occupancy Rate"
                    value={`${analytics.occupancyRate.toFixed(1)}%`}
                    subtitle={`${analytics.activeShows} active shows`}
                    icon={<FiUsers />}
                    color="from-blue-600/20 to-cyan-600/20"
                />

                <StatCard
                    title="Weekly Revenue"
                    value={`$${analytics.weeklyTotal.toLocaleString()}`}
                    subtitle="Last 7 days"
                    icon={<FiTrendingUp />}
                    color="from-orange-600/20 to-red-600/20"
                />
            </div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Revenue Breakdown */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-2xl border border-gray-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiBarChart2 className="text-blue-400" />
                        Weekly Revenue Breakdown
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(weeklyRevenue).map(([day, revenue]) => (
                            <div key={day} className="flex items-center justify-between">
                                <span className="text-gray-300 capitalize">{day}</span>
                                <div className="flex items-center gap-4">
                                    <div className="w-32 bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                                            style={{
                                                width: `${(revenue / Math.max(...Object.values(weeklyRevenue))) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <span className="text-white font-semibold w-20 text-right">
                                        ${revenue.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
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
                            <span className="text-gray-300">Total Shows</span>
                            <span className="text-white font-bold">{analytics.totalShows}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Active Shows</span>
                            <span className="text-green-400 font-bold">{analytics.activeShows}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Seats Occupied</span>
                            <span className="text-blue-400 font-bold">{analytics.totalSeatsBooked}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Popular Movie</span>
                            <span className="text-yellow-400 font-bold text-sm text-right">
                                {analytics.popularMovie}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Hall & Format Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hall Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-2xl border border-gray-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiFilm className="text-purple-400" />
                        Hall Distribution
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(
                            showtimes.reduce((acc, st) => {
                                acc[st.hall] = (acc[st.hall] || 0) + 1;
                                return acc;
                            }, {})
                        )
                            .sort((a, b) => b[1] - a[1])
                            .map(([hall, count]) => (
                                <div key={hall} className="flex justify-between items-center">
                                    <span className="text-gray-300">{hall}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 text-sm">{count} shows</span>
                                        <span className="text-green-400 font-bold">
                                            {((count / showtimes.length) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>
                </motion.div>

                {/* Format Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-2xl border border-gray-700/50"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <FiStar className="text-yellow-400" />
                        Format Distribution
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(
                            showtimes.reduce((acc, st) => {
                                acc[st.format] = (acc[st.format] || 0) + 1;
                                return acc;
                            }, {})
                        ).map(([format, count]) => (
                            <div key={format} className="flex justify-between items-center">
                                <span className="text-gray-300">{format}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400 text-sm">{count} shows</span>
                                    <span className="text-purple-400 font-bold">
                                        {((count / showtimes.length) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}