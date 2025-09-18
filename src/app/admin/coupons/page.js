'use client';

import React from 'react';

export default function CouponsPage() {
  // Sample coupons data
  const coupons = [
    { id: 1, code: 'WELCOME10', discount: '10%', validTill: '2025-12-31', status: 'Active' },
    { id: 2, code: 'SUMMER20', discount: '20%', validTill: '2025-09-30', status: 'Expired' },
    { id: 3, code: 'FESTIVE15', discount: '15%', validTill: '2025-11-15', status: 'Active' },
  ];

  // Summary metrics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === 'Active').length;
  const expiredCoupons = coupons.filter(c => c.status !== 'Active').length;

  return (
    <div className="pt-15 md:pt-15 lg:pt-15 min-h-screen p-4 md:p-6 bg-[var(--color-bg-dark)] text-[var(--color-text-light)]">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--color-primary)]">🎟️ Coupons</h1>

      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 shadow-lg rounded-xl p-5 flex flex-col justify-between hover:scale-105 transition-transform">
          <h2 className="text-sm text-gray-400">Total Coupons</h2>
          <p className="text-2xl font-bold text-[var(--color-primary)] mt-2">{totalCoupons}</p>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-xl p-5 flex flex-col justify-between hover:scale-105 transition-transform">
          <h2 className="text-sm text-gray-400">Active Coupons</h2>
          <p className="text-2xl font-bold text-green-400 mt-2">{activeCoupons}</p>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-xl p-5 flex flex-col justify-between hover:scale-105 transition-transform">
          <h2 className="text-sm text-gray-400">Expired Coupons</h2>
          <p className="text-2xl font-bold text-red-400 mt-2">{expiredCoupons}</p>
        </div>
      </div>

      {/* 🔹 Coupons Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 shadow rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-gray-400 uppercase text-sm">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Coupon Code</th>
              <th className="py-3 px-4 text-left">Discount</th>
              <th className="py-3 px-4 text-left">Valid Till</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="border-b border-gray-700 hover:bg-gray-800 transition-colors"
              >
                <td className="py-2 px-4">{coupon.id}</td>
                <td className="py-2 px-4 font-semibold">{coupon.code}</td>
                <td className="py-2 px-4">{coupon.discount}</td>
                <td className="py-2 px-4">{coupon.validTill}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      coupon.status === 'Active'
                        ? 'bg-green-600 text-white dark:bg-green-400 dark:text-black'
                        : 'bg-red-600 text-white dark:bg-red-400 dark:text-black'
                    }`}
                  >
                    {coupon.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Recent Coupons List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">Recent Coupons</h2>
        <ul className="space-y-3">
          {coupons.map((coupon) => (
            <li
              key={coupon.id}
              className="bg-gray-800 dark:bg-[var(--color-bg-dark)] p-4 rounded-lg shadow hover:scale-105 transition-transform flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{coupon.code} ({coupon.discount})</p>
                <p className="text-sm text-gray-400">Valid Till: {coupon.validTill}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  coupon.status === 'Active'
                    ? 'bg-green-600 text-white dark:bg-green-400 dark:text-black'
                    : 'bg-red-600 text-white dark:bg-red-400 dark:text-black'
                }`}
              >
                {coupon.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
