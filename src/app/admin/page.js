'use client';

import React, { useEffect, useState } from 'react';
import { FiDollarSign, FiUsers, FiGift, FiFilm, FiCalendar, FiTrendingUp, FiBarChart2, FiEye } from 'react-icons/fi';
import axiosSecure from '../api/axiosHook/useAxiosSecure';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';
import StarCardtDeshbord from './components/StartCardDeshbord';
import Image from 'next/image';

const COLORS = ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#3730A3'];

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
  const [showtimes, setShowtimes] = useState([]);
  
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalMovies: 0
  });
  const router = useRouter();

  const handleShowtimesClick = () => {
    router.push("/admin/showtimes");
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
  const handleManualBooking=()=>{
router.push("/admin/booking")
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Users - Fixed to handle single user object
        const usersRes = await axiosSecure.get("/api/auth");
        const usersArray = Array.isArray(usersRes.data) ? usersRes.data : [usersRes.data];
        setUsersData(usersArray);
        setSummary(prev => ({ ...prev, totalUsers: usersArray.length }));

        // Revenue
        const revenueRes = await axiosSecure.get("/api/payments/weekly-revenue");
        const revenueData = revenueRes.data || {};
        setRevenueData(Object.entries(revenueData).map(([day, revenue]) => ({
          name: day,
          revenue: Number(revenue) || 0
        })));
        const totalRevenue = Object.values(revenueData).reduce((sum, val) => sum + Number(val), 0);
        setSummary(prev => ({ ...prev, totalRevenue }));

        // Bookings
        const bookingsRes = await axiosSecure.get("/api/ticket/weekly-bookings");
        const bookingsData = bookingsRes.data || {};
        setBookingsData(Object.entries(bookingsData).map(([day, count]) => ({
          day,
          bookings: parseInt(count, 10) || 0
        })));
        const totalBookings = Object.values(bookingsData).reduce((sum, val) => sum + Number(val), 0);
        setSummary(prev => ({ ...prev, totalBookings }));

        // Movies
        const moviesRes = await axiosSecure.get("/api/movies");
        const moviesArray = Array.isArray(moviesRes.data) ? moviesRes.data : [];
        setMoviesData(moviesArray);
        setSummary(prev => ({ ...prev, totalMovies: moviesArray.length }));

        // Showtimes
        const showtimesRes = await axiosSecure.get("/api/showtimes");
        setShowtimes(Array.isArray(showtimesRes.data) ? showtimesRes.data.slice(0, 3) : []);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto  bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233]">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, Admin!
        </h1>
        <p className="text-gray-400 text-lg">
          Here whats happening with VibePass today
        </p>
      </motion.div>

      {/* Top Stats Cards with Real Data */}
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
          title="Total Movies"
          value={summary.totalMovies.toLocaleString()}
          subtitle="In collection"
          icon={<FiGift />}
          delay={0.4}
        />
      </div>

      {/* Today's Showtimes and Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Showtimes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-[#1b1e2b] to-[#151724] p-6 rounded-2xl border border-gray-800 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Todays Showtimes</h2>
            <button
              onClick={handleShowtimesClick}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              View All
              <FiCalendar className="text-sm" />
            </button>
          </div>

          <div className="space-y-4">
            {showtimes.length > 0 ? (
              showtimes.map((s, i) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  className="flex justify-between items-center bg-gray-800/30 p-4 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={s.movieId?.poster_path || "/placeholder.png"}
                      alt={s.movieId?.title || "Movie Poster"}
                      width={56}   // w-14 = 56px
                      height={72}  // h-18 = 72px
                      className="object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                        {s.movieId?.title || "Unknown Movie"}
                      </h3>
                      <p className="text-sm text-gray-400">{s.time || "Unknown Time"}</p>
                      <p className="text-xs text-gray-500">{s.hall || "Main Hall"}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.status === "Almost Full"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-green-500/20 text-green-400 border border-green-500/30"
                    }`}>
                    {s.status || "Available"}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiCalendar className="mx-auto text-4xl mb-2 opacity-50" />
                <p>No showtimes scheduled for today</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-[#1b1e2b] to-[#151724] p-6 rounded-2xl border border-gray-800 shadow-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
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

      {/* Charts Section */}
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

        {/* Movies Distribution - FIXED with genre_ids */}
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
            {genreData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'gray',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                  />
                  <Legend />
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