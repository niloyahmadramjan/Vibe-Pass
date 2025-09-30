'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FiMenu, FiX, FiHome, FiInfo, FiCalendar, FiUser } from 'react-icons/fi'
import { GiTheater } from 'react-icons/gi'
import { RiMovie2Fill } from 'react-icons/ri'
import Image from 'next/image'

// NextAuth + custom auth
import { useSession, signOut } from 'next-auth/react'
import { useAuth } from '@/app/context/AuthContext'
import toast from 'react-hot-toast'
import { FaFilm } from 'react-icons/fa'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const { data: session, status } = useSession()
  const { user, logout } = useAuth()

  const [openDrop, setOpenDrop] = useState(false)
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
    if (session) {
      await signOut({ redirect: false })
    }
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

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
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
                        : '!text-gray-300 hover:text-blue-400'
                    }`}
                >
                  {icon} {label}
                </Link>
              ))}
            </div>

            {/* Right - Auth (desktop) */}
            <div className="hidden lg:flex items-center">
              {status === 'loading' ? (
                <div className="animate-spin h-6 w-6 rounded-full border-2 border-red-500 border-t-transparent"></div>
              ) : session || user ? (
                <div className="flex items-center gap-3 relative">
                  <span className="text-red-400 font-medium">
                    {session?.user?.name || user?.name}
                  </span>
                  {(session?.user?.image || user?.image) && (
                    <button
                      onClick={() => setOpenDrop((prev) => !prev)}
                      className="focus:outline-none"
                    >
                      <Image
                        src={session?.user?.image || user?.image}
                        alt={session?.user?.name || user?.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </button>
                  )}

                  {openDrop && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-12 right-0 w-48 bg-gray-900 !text-white rounded-lg shadow-lg overflow-hidden z-50"
                    >
                      <Link
                        href="/profile"
                        className="block !text-white px-4 py-2 hover:bg-gray-800 transition"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/my-tickets"
                        className="block !text-white px-4 py-2 hover:bg-gray-800 transition"
                      >
                        My Tickets
                      </Link>
                      <Link
                        href="/transactions"
                        className="block px-4 !text-white py-2 hover:bg-gray-800 transition"
                      >
                        Transactions
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-600 transition"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex btn btn-primary items-center rounded-md font-medium bg-red-600 hover:bg-red-700 px-4 py-2 transition-colors duration-200 text-white"
                >
                  <FiUser className="mr-2" /> Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden  flex items-center">
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
          className={`fixed top-0 right-0 h-full w-64 bg-gray-900 transform ${
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

          {/* Links */}
          <div className="flex-1 flex flex-col space-y-4 p-4">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center font-bold transition-colors duration-200 ${
                  pathname === href
                    ? 'border-b-4 border-blue-400 !text-blue-400'
                    : '!text-gray-300 hover:text-blue-400'
                }`}
              >
                {icon} {label}
              </Link>
            ))}
          </div>

          {/* Auth Section (mobile bottom) */}
          <div className="mt-auto p-4 border-t border-gray-800">
            {session || user ? (
              <div className="flex items-center gap-3">
                <span className="!text-white font-medium">
                  {session?.user?.name || user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-auto bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full btn btn-primary flex items-center justify-center px-4 py-2 rounded-md font-bold bg-red-600 hover:bg-red-700 text-white"
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
