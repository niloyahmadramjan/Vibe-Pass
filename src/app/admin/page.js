'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';

const revenueData = [
  { name: 'Mon', revenue: 1200 },
  { name: 'Tue', revenue: 2100 },
  { name: 'Wed', revenue: 800 },
  { name: 'Thu', revenue: 1600 },
  { name: 'Fri', revenue: 2400 },
  { name: 'Sat', revenue: 3100 },
  { name: 'Sun', revenue: 1800 },
];

const usersData = [
  { day: 'Mon', users: 200 },
  { day: 'Tue', users: 450 },
  { day: 'Wed', users: 300 },
  { day: 'Thu', users: 500 },
  { day: 'Fri', users: 700 },
  { day: 'Sat', users: 900 },
  { day: 'Sun', users: 650 },
];

const bookingsData = [
  { day: 'Mon', bookings: 80 },
  { day: 'Tue', bookings: 120 },
  { day: 'Wed', bookings: 60 },
  { day: 'Thu', bookings: 100 },
  { day: 'Fri', bookings: 150 },
  { day: 'Sat', bookings: 200 },
  { day: 'Sun', bookings: 130 },
];

const moviesData = [
  { name: 'Action', value: 40 },
  { name: 'Comedy', value: 25 },
  { name: 'Drama', value: 20 },
  { name: 'Horror', value: 15 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardOverviewPage() {
  return (
    <div className=" p-5 mt-16 md:mt-0 space-y-6 md:space-y-8">
      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
        Dashboard Overview
      </h1>

      {/* 🔹 Summary Widgets */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow p-3 md:p-4 rounded-lg text-center md:text-left">
          <h2 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Users</h2>
          <p className="text-lg md:text-2xl font-bold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">1,245</p>
        </div>
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow p-3 md:p-4 rounded-lg text-center md:text-left">
          <h2 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Bookings</h2>
          <p className="text-lg md:text-2xl font-bold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">3,710</p>
        </div>
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow p-3 md:p-4 rounded-lg text-center md:text-left">
          <h2 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Revenue</h2>
          <p className="text-lg md:text-2xl font-bold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">$12,450</p>
        </div>
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow p-3 md:p-4 rounded-lg text-center md:text-left">
          <h2 className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Movies</h2>
          <p className="text-lg md:text-2xl font-bold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">134</p>
        </div>
      </div>

      {/* 📊 Charts Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow p-4 rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">Weekly Revenue</h2>
          <div className="h-60 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Growth Chart */}
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow p-4 rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">Active Users</h2>
          <div className="h-60 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="day" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#0088FE" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Chart */}
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow p-4 rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">Weekly Bookings</h2>
          <div className="h-60 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="day" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#00C49F" fill="#00C49F" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Movies Distribution */}
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow p-4 rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-4 text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">Movies by Genre</h2>
          <div className="h-60 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moviesData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {moviesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}



// 📊 Summary widgets: Total Users, Bookings, Revenue, Movies, Screens

// 📅 Daily/Weekly/Monthly Revenue

// 🔥 Top booked movies or shows

// 🚨 Upcoming shows, low ticket alert


// 2. Movies Management

// Add / Edit / Delete movies

// Upload poster, trailer, description, genre, release date

// Assign to showtimes / screens

// Toggle visibility (Active/Inactive)


// ১. মূল ড্যাশবোর্ড
// এটি আপনার অ্যাডমিন প্যানেলের প্রধান পেইজ। এখানে এক নজরে সবকিছুর সারসংক্ষেপ দেখা যাবে। যেমন:

// সর্বমোট বুকিং সংখ্যা।

// সর্বশেষ বুকিংগুলোর তালিকা।

// আজকের শো-এর জন্য কত টিকিট বিক্রি হয়েছে।

// সাম্প্রতিক সময়ের নতুন ব্যবহারকারীদের সংখ্যা।

// 📊 Summary widgets: Total Users, Bookings, Revenue, Movies, Screens

// 📅 Daily/Weekly/Monthly Revenue

// 🔥 Top booked movies or shows

// 🚨 Upcoming shows, low ticket alert

//dashboard chart
//movie details-- total movie, tatal ticket, total user
//recent booking-- user name, movie name, seat number, date, time
//recent user-- user name, email, date
//recent movie-- movie name, genre, release date
//recent feedback-- user name, movie name, feedback, date
//recent transaction-- user name, movie name, amount, date

//