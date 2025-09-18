'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[var(--color-bg-dark)] text-[var(--color-text-dark)]">
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-[60] p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800
                    focus:outline-none transition-colors duration-200 ${
                      isOpen ? 'hidden' : 'lg:hidden'
                    }`}
      >
        <FiMenu size={26} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 top-0 left-0 w-64 h-screen bg-[var(--color-bg-dark)] text-[var(--color-text-light)] p-4
                    transform transition-transform duration-300 ease-in-out
                    lg:translate-x-0 ${
                      isOpen ? 'translate-x-0' : '-translate-x-full'
                    }
                    lg:flex-shrink-0 lg:shadow-xl`}
      >
        {/* Close Button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800
                     focus:outline-none transition-colors duration-200 lg:hidden"
        >
          <FiX size={26} />
        </button>

        <h2 className="text-2xl font-bold mb-8 text-center border-b border-[var(--color-primary)] pb-4">
          Admin Panel
        </h2>

        <ul className="space-y-4">
          {[
            { name: 'Dashboard', path: '/admin' },
            { name: 'Add-Movies', path: '/admin/add-movies' },
            { name: 'Add-showtime', path: '/admin/add-showtimes' },
            { name: 'Showtimes', path: '/admin/showtimes' },
            { name: 'Cupons', path: '/admin/coupons' },

            { name: 'Bookings', path: '/admin/bookings' },
            { name: 'Users', path: '/admin/users' },
            { name: 'Reports', path: '/admin/reports' },
            { name: 'Go Back Home', path: '/' },
          ].map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                onClick={toggleSidebar}
                className="block p-3 rounded-lg hover:bg-[var(--color-primary-hover)] hover:!text-black transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
