'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

   const [open, setOpen] = useState(false)
   const dropdownRef = useRef(null)

   // Close dropdown when clicked outside
   useEffect(() => {
     const handleClickOutside = (event) => {
       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
         setOpen(false)
       }
     }
     document.addEventListener('mousedown', handleClickOutside)
     return () => document.removeEventListener('mousedown', handleClickOutside)
   }, [])

  return (
    <div className="flex flex-col lg:flex-row h-screen text-[var(--color-text-dark)]">
      {/* Mobile Hamburger Button */}

      <nav className="fixed top-0 lg:hidden left-0 w-full z-50 bg-black/50 backdrop-blur-md shadow-md px-6 py-3 flex items-center justify-between">
        {/* Left: Logo / Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="focus:outline-none transition-colors duration-200 text-gray-300"
          >
            <FiMenu size={40} />
          </button>
          <span className=" text-red-500 font-bold text-xl">VIPE-PASS</span>
        </div>

        {/* Right: User */}
        <div className="relative" ref={dropdownRef}>
          <Image
            src="https://i.pravatar.cc/40"
            alt="User"
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
            onClick={() => setOpen(!open)}
          />

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-black rounded-lg shadow-lg overflow-hidden">
              <Link
                href="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-white/10 transition"
              >
                Profile
              </Link>
              <Link
                href="#change-password"
                className="block px-4 py-2 text-gray-800 hover:bg-white/10 transition"
              >
                Change Password
              </Link>
              <Link
                href="#logout"
                className="block px-4 py-2 text-gray-800 hover:bg-white/10 transition"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 top-0 left-0 w-64 h-screen bg-[var(--color-bg-dark)] text-[var(--color-text-light)] p-4
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
