'use client';

import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

// Revenue data for last 6 months
const revenueTrend = [
  { month: 'May', revenue: 120000 },
  { month: 'Jun', revenue: 150000 },
  { month: 'Jul', revenue: 180000 },
  { month: 'Aug', revenue: 140000 },
  { month: 'Sep', revenue: 200000 },
  { month: 'Oct', revenue: 250000 },
];

// Dummy detailed reports
const reportsData = [
  { type: 'Monthly Sales', value: '৳ 2,50,000' },
  { type: 'Top Movie', value: 'Interstellar' },
  { type: 'Coupon Usage', value: '75%' },
  { type: 'New Users', value: '150' },
  { type: 'Refunds', value: '12' },
];

export default function ReportsPage() {
  return (
    <div className="pt-15 md:pt-15 lg:pt-15 min-h-screen p-6 bg-[var(--color-bg-dark)] text-[var(--color-text-light)]">
      <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-8">📊 Reports Dashboard</h1>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {reportsData.map((report, idx) => (
          <div
            key={idx}
            className="bg-gray-800 dark:bg-[var(--color-bg-dark)] shadow-lg rounded-xl p-5 flex flex-col justify-between hover:scale-105 transition-transform"
          >
            <h2 className="text-sm text-gray-400">{report.type}</h2>
            <p className="text-2xl font-bold text-[var(--color-primary)] mt-2">{report.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-gray-800 dark:bg-[var(--color-bg-dark)] shadow-lg rounded-xl p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">Revenue Trend (Last 6 Months)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="var(--color-text-light)" />
              <YAxis stroke="var(--color-text-light)" />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--color-bg-dark)', borderRadius: '8px', border: 'none', color: 'var(--color-text-light)' }}
                itemStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="url(#gradient)"
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--color-primary)' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#CC2027" />
                  <stop offset="100%" stopColor="#E53935" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
