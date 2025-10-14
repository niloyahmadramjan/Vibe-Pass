'use client';

import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiUsers, FiGift, FiFilm, FiCalendar, FiTrendingUp, FiBarChart2, FiEye, FiTag, FiCreditCard } from 'react-icons/fi';
import axiosSecure from '../api/axiosHook/useAxiosSecure';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';
import StarCardtDeshbord from './components/StartCardDeshbord';
import Image from 'next/image';
const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00C49F", "#0088FE", "#FFBB28", "#FF8042",
  "#A28DFF", "#FF69B4", "#7FDBFF", "#3D9970", "#B10DC9", "#39CCCC", "#FFDC00",
  "#FF851B", "#85144b", "#F012BE", "#0074D9", "#2ECC40", "#01FF70", "#AAAAAA"
];
// const COLORS = ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#3730A3'];

const genreOptions = [
  { id: 16, name: "Animation" },
  { id: 28, name: "Action" },
  { id: 14, name: "Fantasy" },
  { id: 53, name: "Thriller" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" }
];

export default function AdminHomePage() {
  const [revenueData, setRevenueData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [moviesData, setMoviesData] = useState([]);
  const [couponsData, setCouponsData] = useState([]);
  const [paymentsData, setPaymentsData] = useState([]);

  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalMovies: 0,
    totalCoupons: 0,
    activePayments: 0
  });
  const router = useRouter();

  const handleCouponsClick = () => {
    router.push("/admin/coupons");
  };

  const handleMovieClick = () => {
    router.push('/admin/add-movies');
  };

  const handleEventsClick = () => {
    router.push('/admin/events');
  };

  const handleReportsClick = () => {
    router.push('/admin/analytics');
  };

  const handleManualBooking = () => {
    router.push("/admin/bookings")
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 🧩 USERS — fixed to handle single user object or array
        const usersRes = await axiosSecure.get("/api/auth");
        const usersArray = Array.isArray(usersRes.data) ? usersRes.data : [usersRes.data];
        setUsersData(usersArray);
        setSummary(prev => ({ ...prev, totalUsers: usersArray.length }));

        // 💰 REVENUE — fixed for array response
        const revenueRes = await axiosSecure.get("/api/payments/weekly-revenue");
        const revenueArray = Array.isArray(revenueRes.data) ? revenueRes.data : [];

        // If no data returned, fallback to empty week
        setRevenueData(
          revenueArray.length > 0
            ? revenueArray
            : [
              { name: "Mon", revenue: 0 },
              { name: "Tue", revenue: 0 },
              { name: "Wed", revenue: 0 },
              { name: "Thu", revenue: 0 },
              { name: "Fri", revenue: 0 },
              { name: "Sat", revenue: 0 },
              { name: "Sun", revenue: 0 },
            ]
        );

        const totalRevenue = revenueArray.reduce(
          (sum, item) => sum + (item.revenue || 0),
          0
        );
        setSummary(prev => ({ ...prev, totalRevenue }));

        // 🎟️ BOOKINGS — converts backend object into chart-friendly array
        const bookingsRes = await axiosSecure.get("/api/ticket/weekly-bookings");
        const bookingsData = bookingsRes.data || {};
        const bookingsArray = Object.entries(bookingsData).map(([day, count]) => ({
          day,
          bookings: parseInt(count, 10) || 0,
        }));
        setBookingsData(bookingsArray);

        const totalBookings = bookingsArray.reduce(
          (sum, b) => sum + b.bookings,
          0
        );
        setSummary(prev => ({ ...prev, totalBookings }));

        // 🎬 MOVIES — safely load and count
        const moviesRes = await axiosSecure.get("/api/movies");
        const moviesArray = Array.isArray(moviesRes.data) ? moviesRes.data : [];
        setMoviesData(moviesArray);
        setSummary(prev => ({ ...prev, totalMovies: moviesArray.length }));

        // 🏷️ COUPONS — safely handle missing API
        try {
          const couponsRes = await axiosSecure.get("/api/coupons");
          const couponsArray = Array.isArray(couponsRes.data)
            ? couponsRes.data
            : [];
          setCouponsData(couponsArray);
          setSummary(prev => ({ ...prev, totalCoupons: couponsArray.length }));
        } catch (error) {
          console.log("⚠️ Coupons API not available");
        }

        // 💳 PAYMENTS — safely handle missing API
        try {
          const paymentsRes = await axiosSecure.get("/api/payments");
          const paymentsArray = Array.isArray(paymentsRes.data)
            ? paymentsRes.data
            : [];
          setPaymentsData(paymentsArray);
          setSummary(prev => ({ ...prev, activePayments: paymentsArray.length }));
        } catch (error) {
          console.log("⚠️ Payments API not available");
        }

      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);


  // Prepare genre data for pie chart using genre_ids
  const genreData = moviesData.reduce((acc, movie) => {
    if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
      movie.genre_ids.forEach(genreId => {
        const genreInfo = genreOptions.find(g => g.id === genreId);
        const genreName = genreInfo ? genreInfo.name : `Genre ${genreId}`;

        const existing = acc.find(item => item.name === genreName);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: genreName, value: 1 });
        }
      });
    }
    return acc;
  }, []);

  // Prepare user growth data from actual users data
  const userGrowthData = usersData.length > 0 ? [
    { day: 'Mon', users: Math.floor(usersData.length * 0.8) },
    { day: 'Tue', users: Math.floor(usersData.length * 0.85) },
    { day: 'Wed', users: Math.floor(usersData.length * 0.9) },
    { day: 'Thu', users: Math.floor(usersData.length * 0.95) },
    { day: 'Fri', users: usersData.length },
    { day: 'Sat', users: Math.floor(usersData.length * 1.1) },
    { day: 'Sun', users: Math.floor(usersData.length * 1.05) },
  ] : [
    { day: 'Mon', users: 45 },
    { day: 'Tue', users: 52 },
    { day: 'Wed', users: 48 },
    { day: 'Thu', users: 60 },
    { day: 'Fri', users: 75 },
    { day: 'Sat', users: 85 },
    { day: 'Sun', users: 65 },
  ];

  // Calculate coupon statistics
  const couponStats = {
    active: couponsData.filter(c => c.active).length,
    expired: couponsData.filter(c => new Date(c.expiryDate) < new Date()).length,
    used: couponsData.filter(c => c.usedCount > 0).length,
    totalDiscount: couponsData.reduce((sum, c) => sum + (c.usedCount * c.discountValue), 0)
  };

  // Calculate payment statistics
  const paymentStats = {
    completed: paymentsData.filter(p => p.status === 'completed').length,
    pending: paymentsData.filter(p => p.status === 'pending').length,
    failed: paymentsData.filter(p => p.status === 'failed').length,
    totalAmount: paymentsData.reduce((sum, p) => sum + (p.amount || 0), 0)
  };

  return (
    <div className="p-6 space-y-6 w-full mx-auto bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233]">
      {/* Header  */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">
          Welcome back, Admin!
        </h1>
        <p className="text-gray-400 text-lg">
          Here whats happening with VibePass today
        </p>
      </motion.div>

      {/* Top Stats Cards  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StarCardtDeshbord
          title="Total Revenue"
          value={`$${summary.totalRevenue.toLocaleString()}`}
          subtitle="Weekly revenue"
          icon={<FiDollarSign />}
          delay={0.1}
        />
        <StarCardtDeshbord
          title="Tickets Sold"
          value={summary.totalBookings.toLocaleString()}
          subtitle="Weekly bookings"
          icon={<FiFilm />}
          delay={0.2}
        />
        <StarCardtDeshbord
          title="Active Users"
          value={summary.totalUsers.toLocaleString()}
          subtitle="Registered users"
          icon={<FiUsers />}
          delay={0.3}
        />
        <StarCardtDeshbord
          title="Active Coupons"
          value={summary.totalCoupons.toLocaleString()}
          subtitle="Discount codes"
          icon={<FiTag />}
          delay={0.4}
        />
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coupons Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-[#1b1e2b] to-[#151724] p-6 rounded-2xl border border-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Coupons & Discounts</h2>
              <p className="text-gray-400 text-sm">
                {couponStats.active} active • {couponStats.used} used
              </p>
            </div>
            <button
              onClick={handleCouponsClick}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-2 transition-colors bg-purple-500/10 px-3 py-1 rounded-lg"
            >
              Manage
              <FiTag className="text-sm" />
            </button>
          </div>

          {/* Coupon Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{couponStats.active}</div>
              <div className="text-xs text-green-300">Active</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">${couponStats.totalDiscount}</div>
              <div className="text-xs text-blue-300">Total Saved</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{couponStats.used}</div>
              <div className="text-xs text-yellow-300">Times Used</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{couponStats.expired}</div>
              <div className="text-xs text-red-300">Expired</div>
            </div>
          </div>

        </motion.div>

        {/* Users & Payments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-[#1b1e2b] to-[#151724] p-6 rounded-2xl border border-gray-800 shadow-2xl"
        >


          {/* Quick Actions  */}
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <ActionButton
              onClick={handleMovieClick}
              title="Add Movie"
              description="Add new movie"
              icon={<FiFilm />}
              gradient={true}
            />
            <ActionButton
              onClick={handleManualBooking}
              title="Manual Booking"
              description="Create booking"
              icon={<FiCalendar />}
              gradient={true}
            />
            <ActionButton
              onClick={handleEventsClick}
              title="Create Event"
              description="Organize event"
              icon={<FiGift />}
              gradient={false}
            />
            <ActionButton
              onClick={handleReportsClick}
              title="View Reports"
              description="Analytics & insights"
              icon={<FiTrendingUp />}
              gradient={false}
            />
          </div>
        </motion.div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-[#1b1e2b] to-[#151724] p-6 rounded-2xl border border-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Weekly Revenue</h2>
              <p className="text-gray-400 text-sm">Last 7 days performance</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FiTrendingUp className="text-purple-400 text-xl" />
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-[#1b1e2b] to-[#151724] p-6 rounded-2xl border border-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">User Growth</h2>
              <p className="text-gray-400 text-sm">Daily active users</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FiUsers className="text-purple-400 text-xl" />
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                <XAxis
                  dataKey="day"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="url(#userGradient)"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#8B5CF6' }}
                />
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bookings Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-[#1b1e2b] to-[#151724] p-6 rounded-2xl border border-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Weekly Bookings</h2>
              <p className="text-gray-400 text-sm">Ticket booking trends</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FiBarChart2 className="text-purple-400 text-xl" />
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.3} />
                <XAxis
                  dataKey="day"
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="url(#bookingStroke)"
                  fill="url(#bookingFill)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="bookingStroke" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.5} />
                  </linearGradient>
                  <linearGradient id="bookingFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Movies  */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-[#1b1e2b] to-[#151724] p-6 rounded-2xl border border-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Movies by Genre</h2>
              <p className="text-gray-400 text-sm">Content distribution</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <FiEye className="text-purple-400 text-xl" />
            </div>
          </div>
          <div className="h-72">
            {genreData && genreData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {genreData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]} // automatically picks next color
                        stroke="#0f0f1a"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "gray",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  {/* <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ color: "#ccc", fontSize: "12px" }}
                  /> */}
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FiFilm className="mx-auto text-4xl mb-2 opacity-50" />
                  <p>No genre data available</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ActionButton Component - UNCHANGED
function ActionButton({ onClick, title, description, icon, gradient }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        ${gradient
          ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/30 hover:from-purple-600/40 hover:to-purple-600/50 transform text-white'
          : 'bg-gray-800 border border-gray-700 hover:border-gray-600 hover:bg-gray-750 text-white'
        } 
        p-4 rounded-xl transition-all duration-300 group cursor-pointer w-full
      `}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`
          ${gradient ? 'text-white' : 'text-gray-400 group-hover:text-white'}
          text-xl transition-colors
        `}>
          {icon}
        </div>
        <div>
          <div className="font-bold text-sm">{title}</div>
          <div className={`text-xs mt-1 ${gradient ? 'text-white/80' : 'text-gray-400'}`}>
            {description}
          </div>
        </div>
      </div>
    </motion.button>
  );
}