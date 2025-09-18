'use client';

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar
} from 'recharts';

const revenueData = [
  { day: 'Mon', revenue: 1200 },
  { day: 'Tue', revenue: 2100 },
  { day: 'Wed', revenue: 800 },
  { day: 'Thu', revenue: 1600 },
  { day: 'Fri', revenue: 2400 },
  { day: 'Sat', revenue: 3100 },
  { day: 'Sun', revenue: 1800 },
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

export default function ModernDashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6 pt-15 md:pt-15 lg:pt-15">
      <h1 className="text-2xl font-bold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)] mb-6">
        📊 user Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow-lg rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)] mb-2">Revenue</h2>
          <p className="text-2xl font-bold text-[var(--color-primary)] mb-3">$12,450</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="day" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow-lg rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)] mb-2">Active Users</h2>
          <p className="text-2xl font-bold text-blue-500 mb-3">1,245</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="day" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#0088FE" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bookings Card */}
        <div className="bg-white dark:bg-[var(--color-bg-dark)] shadow-lg rounded-xl p-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)] mb-2">Bookings</h2>
          <p className="text-2xl font-bold text-green-500 mb-3">3,710</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="day" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#00C49F" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
