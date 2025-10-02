'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import {
  FiX, FiHome, FiFilm, FiCalendar, FiClock, FiUsers,
  FiGift, FiBarChart2, FiCreditCard, FiMail, FiSettings, FiTag
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { RiCoupon2Fill } from 'react-icons/ri';
import { usePathname } from 'next/navigation';

export default function AdminSidebar({ toggleSidebar, isOpen }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
const pathname = usePathname()
  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <FiHome /> },
    { name: 'Movies', path: '/admin/add-movies', icon: <FiFilm /> },
    { name: 'Tickets', path: '/admin/tickets', icon: <FiTag /> },
    { name: 'Events', path: '/admin/events', icon: <FiCalendar /> },
    { name: 'Theaters', path: '/admin/theaters', icon: <FiFilm /> },
    { name: 'Showtimes', path: '/admin/add-showtimes', icon: <FiClock /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <FiTag /> },
    { name: 'Users', path: '/admin/users', icon: <FiUsers /> },
    // { name: 'Loyalty', path: '/admin/loyalty', icon: <FiGift /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <FiBarChart2 /> },
    { name: 'Payments', path: '/admin/payment', icon: <FiCreditCard /> },
    { name: 'Marketing', path: '/admin/marketing', icon: <FiMail /> },
    { name: 'Coupons', path: '/admin/coupons', icon: <RiCoupon2Fill/>},
    { name: 'Go Back Home', path: '/', icon: <FiHome /> },
  ];

  return (
    <div className="h-full flex flex-col bg-[#0d0e12] border-r border-[#1e1f26]">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0">
        {/* Mobile Header - Only shown on mobile */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#1e1f26]">
            {/* <div className="flex items-center gap-3"> */}
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="flex-shrink-0 flex items-center space-x-2 group"
                >
                  <div className="relative group">
                    <Image
                      src="/favicon.png"
                      width={50}
                      height={50}
                      alt="Picture of the author"
                    />
                  </div>
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    VibePass
                  </span>
                </Link>
              </div>
            {/* </div> */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#2a2c36]"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* User Info Section - Mobile Only */}
          <div className="border-b border-[#1e1f26] p-4">
            <div className="flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                <div
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#e4e6eb] overflow-hidden"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user?.name || 'User'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white font-bold">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                  )}
                </div>
                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-[#1b1e2b] rounded-lg shadow-lg overflow-hidden border border-[#1e1f26] z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 text-[#a1a1aa] hover:bg-[#2a2c36] hover:text-white"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/change-password"
                      className="block px-4 py-3 text-[#a1a1aa] hover:bg-[#2a2c36] hover:text-white"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Change Password
                    </Link>
                    <Link
                      href="/logout"
                      className="block px-4 py-3 text-[#a1a1aa] hover:bg-[#2a2c36] hover:text-white"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
              <div>
                <p className="text-white font-medium">{user?.name || 'Admin User'}</p>
                <p className="text-gray-400 text-sm">Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header - Always visible on desktop */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-center px-6 py-3.5 border-b border-[#1e1f26]">
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex-shrink-0 flex items-center space-x-2 group"
              >
                <div className="relative group">
                  <Image
                    src="/favicon.png"
                    width={50}
                    height={50}
                    alt="Picture of the author"
                  />
                </div>
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                  VibePass
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items - Full height with scrollbar hidden on mobile */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map(({ item, path,icon,name}) => (
              <li key={path}>
                <Link
                  href={path}
                  onClick={() => {
                    // Close sidebar on mobile when menu item is clicked
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex  items-center gap-3 px-4 py-3 rounded-lg  font-semibold
                    hover:bg-[#2a2c36] hover:text-white transition-colors duration-200  ${
                    pathname === path
                    ? ' bg-[#2a2c36] !text-red-400  font-bold'
                      : '!text-gray-300 hover:text-blue-400'
                }`}
                     
                >
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <span className="text-base whitespace-nowrap">{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer Section - Fixed */}
      <div className="flex-shrink-0 border-t border-[#1e1f26] p-4">
        <div className="text-center text-gray-500 text-sm">
          <p>VibePass Admin</p>
          <p className="text-xs mt-1">v1.0.0</p>
        </div>
      </div>

      {/* Custom scrollbar styles - Hidden on mobile */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }

        /* Show custom scrollbar only on desktop */
        @media (min-width: 1024px) {
          .no-scrollbar::-webkit-scrollbar {
            display: block;
            width: 6px;
          }
          .no-scrollbar::-webkit-scrollbar-track {
            background: #1b1e2b;
            border-radius: 3px;
          }
          .no-scrollbar::-webkit-scrollbar-thumb {
            background: #4b5563;
            border-radius: 3px;
          }
          .no-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        }
      `}</style>
    </div>
  );
}