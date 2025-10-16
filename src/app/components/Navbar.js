'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiCalendar,
  FiUser,
  FiSettings,
} from 'react-icons/fi'
import { GiTheater } from 'react-icons/gi'
import { RiMovie2Fill } from 'react-icons/ri'
import Image from 'next/image'

// Custom auth only
import { useAuth } from '@/app/context/AuthContext'
import toast from 'react-hot-toast'
import { FaFilm } from 'react-icons/fa'


export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const { user, logout, loading, setLoading } = useAuth()

  const [openDrop, setOpenDrop] = useState(false)
  const [groupHover, setGroupHover] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDrop(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Detect scroll to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    if (user) {
      await logout({ redirect: false })
      toast.success('Logged out successfully!')
    }
    router.refresh()
  }

  const navLinks = [
    { href: '/', label: 'Home', icon: <FiHome className="mr-1" /> },
    {
      href: '/movies',
      label: 'Movies',
      icon: <RiMovie2Fill className="mr-1" />,
    },
    {
      href: '/upcoming',
      label: 'Upcoming',
      icon: <FiCalendar className="mr-1" />,
    },
    {
      href: '/bangla-movies',
      label: 'BanglaFlix',
      icon: <FaFilm className="mr-1" />,
    },
    {
      href: '/location',
      label: 'Theaters',
      icon: <GiTheater className="mr-1" />,
    },
    { href: '/about', label: 'About', icon: <FiInfo className="mr-1" /> },
  ]

  // Check if user is admin

  const isAdmin = user?.role === 'admin'
  console.log(user)

  return (
    <>
      <nav
        className={`fixed w-full z-999 transition-all duration-300 ${
          scrolled
            ? 'bg-gray-950 !text-white shadow-lg border-b border-stone-700'
            : 'bg-transparent !text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="flex-shrink-0 flex items-center space-x-2 group"
              >
                <Image src="/favicon.png" width={50} height={40} alt="Logo" />
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                  VibePass
                </span>
              </Link>
            </div>

            {/* Middle - Links (desktop) */}
            <div className="hidden lg:flex space-x-8 justify-center items-center">
              {navLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center font-bold transition-all duration-300 ease-in-out   
                    ${
                      pathname === href
                        ? 'border-b-4 border-blue-400 !text-blue-400'
                        : '!text-gray-300 hover:text-blue-400 hover:border-b-4 hover:border-blue-400'
                    }`}
                >
                  {icon} {label}
                </Link>
              ))}
            </div>

            {/* Right - Auth (desktop) */}
            <div className="hidden lg:flex items-center">
              {loading ? (
                <div className="animate-spin h-6 w-6 rounded-full border-2 border-red-500 border-t-transparent"></div>
              ) : user ? (
                <div className="flex items-center gap-3 relative group">
                  {/* User Info with Dropdown Trigger */}
                  <button
                    onClick={() => setOpenDrop((prev) => !prev)}
                    className="flex items-center gap-2 focus:outline-none hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-white font-semibold text-sm leading-tight max-w-[120px] truncate">
                        {user?.name}
                      </span>
                      <span className="text-red-400 text-xs font-medium">
                        HI.MOVIECLUB U...
                      </span>
                    </div>

                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        openDrop ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                 

                  {/* Dropdown Menu */}
                  {(openDrop || groupHover) && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-14 right-0 w-64 bg-gray-900 border border-gray-700 text-white rounded-lg shadow-xl overflow-hidden z-50"
                      onMouseEnter={() => setGroupHover(true)}
                      onMouseLeave={() => setGroupHover(false)}
                    >
                      {/* Header Section */}
                      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                          {user?.image ? (
                            <Image
                              src={user?.image}
                              alt={user?.name || 'User'}
                              width={40}
                              height={40}
                              className="rounded-full border-2 border-red-500"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold border-2 border-red-500">
                              {(user?.name?.[0] || 'U').toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {user?.name}
                            </p>
                            <p className="text-red-400 text-xs">
                              Hi.MOVIECLUB U...
                            </p>
                            {isAdmin && (
                              <span className="inline-block mt-1 px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-bold">
                                ADMIN
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {/* Admin Dashboard - Dropdown */}
                        {isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-purple-900/50 transition-colors text-white border-l-2 border-purple-500"
                            onClick={() => setOpenDrop(false)}
                          >
                            <FiSettings className="w-5 h-5 text-purple-400" />
                            <span className="font-medium">ADMIN DASHBOARD</span>
                          </Link>
                        )}

                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-white"
                          onClick={() => setOpenDrop(false)}
                        >
                          <FiUser className="w-5 h-5 text-gray-400" />
                          <span className="font-medium">MY PROFILE</span>
                        </Link>

                        <Link
                          href="/my-orders"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-white"
                          onClick={() => setOpenDrop(false)}
                        >
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                            />
                          </svg>
                          <span className="font-medium">MY ORDERS</span>
                        </Link>

                        {/* booking */}
                        <Link
                          href="/my-booking"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-white"
                          onClick={() => setOpenDrop(false)}
                        >
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zm7-5l2 2 4-4"
                            />
                          </svg>
                          <span className="font-medium">My Booking</span>
                        </Link>

                        <Link
                          href="/my-rewards"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-white"
                          onClick={() => setOpenDrop(false)}
                        >
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                            />
                          </svg>
                          <span className="font-medium">MY REWARDS</span>
                        </Link>

                        <Link
                          href="/my-wallet"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-white"
                          onClick={() => setOpenDrop(false)}
                        >
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <span className="font-medium">MY WALLET</span>
                        </Link>

                        {/* Divider */}
                        <div className="border-t border-gray-700 my-2"></div>

                        {/* Sign Out */}
                        <button
                          onClick={() => {
                            handleLogout()
                            setOpenDrop(false)
                          }}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-600 transition-colors text-white text-left"
                        >
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="font-medium">SIGN OUT</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 px-4 py-2 transition-colors duration-200 !text-white"
                >
                  <FiUser className="w-5 h-5" />
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors duration-200"
              >
                {open ? <FiX size={26} /> : <FiMenu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 sm:w-72 bg-gray-900 transform ${
            open ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out z-40 shadow-xl flex flex-col`}
        >
          {/* Close Button & Logo */}
          <div className="flex justify-between items-center p-5 border-b border-gray-800">
            <Link
              href="/"
              className="flex items-center space-x-2 group"
              onClick={() => setOpen(false)}
            >
              <Image src="/favicon.png" width={35} height={40} alt="Logo" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                VibePass
              </span>
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-200"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {/* Main Navigation Links */}
            <div className="space-y-4 mb-6">
              {navLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center font-bold transition-colors duration-200 py-2 px-3 rounded-lg ${
                    pathname === href
                      ? 'bg-blue-900/30 border-l-4 border-blue-400 !text-blue-400'
                      : '!text-gray-300 hover:text-blue-400 hover:bg-gray-800 hover:border-l-4 hover:border-blue-400'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span
                    className={`mr-3 ${
                      pathname === href ? 'text-blue-400' : 'text-gray-400'
                    }`}
                  >
                    {icon}
                  </span>
                  {label}
                </Link>
              ))}

              {/* Admin Dashboard Link - Mobile */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`flex items-center font-bold transition-colors duration-200 py-2 px-3 rounded-lg ${
                    pathname === '/admin'
                      ? 'bg-purple-900/30 border-l-4 border-purple-400 !text-purple-400'
                      : '!text-gray-300 hover:text-purple-400 hover:bg-gray-800 hover:border-l-4 hover:border-purple-400'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span
                    className={`mr-3 ${
                      pathname === '/admin'
                        ? 'text-purple-400'
                        : 'text-gray-400'
                    }`}
                  >
                    <FiSettings />
                  </span>
                  Dashboard
                </Link>
              )}
            </div>

            {/* User Menu Links - Only show when logged in */}
            {user && (
              <div className="border-t border-gray-700 pt-6 space-y-3">
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 px-3">
                  My Account
                </h3>
                {[
                  { href: '/profile', label: 'MY PROFILE' },
                  { href: '/my-orders', label: 'MY ORDERS' },
                  { href: '/my-booking', label: 'MY BOOKING' },
                  { href: '/my-rewards', label: 'MY REWARDS' },
                  { href: '/my-wallet', label: 'MY WALLET' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-3 rounded-lg text-white hover:bg-gray-800 transition-colors font-medium"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Auth Section (mobile bottom) */}
          <div className="p-4 border-t border-gray-800 bg-gray-950">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="!text-white font-medium">{user?.name}</span>
                  {isAdmin && (
                    <span className="inline-block px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-bold">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-white text-sm font-bold transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full flex items-center justify-center px-4 py-2 rounded-md font-bold bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
                onClick={() => setOpen(false)}
              >
                <FiUser className="mr-2" /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
