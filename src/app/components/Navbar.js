'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiCalendar,
  FiBook,
  FiUser,
} from 'react-icons/fi'
import { BiCameraMovie, BiSolidCameraMovie } from 'react-icons/bi'
import { RiMovie2AiLine, RiMovie2Fill } from 'react-icons/ri'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // detect scroll to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    { href: '/about', label: 'About', icon: <FiInfo className="mr-1" /> },
    { href: '/blog', label: 'Blog', icon: <FiBook className="mr-1" /> },
  ]

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-gray-950 text-white shadow-lg border-b border-stone-700'
            : 'bg-transparent text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - Logo */}
            <Link
              href="/"
              className="flex-shrink-0 flex items-center space-x-2 group"
            >
              <RiMovie2AiLine className="text-red-600 text-4xl" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                VibePass
              </span>
            </Link>

            {/* Middle - Links (desktop) */}
            <div className="hidden md:flex space-x-8 justify-center items-center">
              {navLinks.map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center font-bold transition-colors duration-200 ${
                    pathname === href
                      ? 'text-red-400'
                      : 'hover:text-red-900 text-blue-500'
                  }`}
                >
                  {icon} {label}
                  {/* underline animation */}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 ${
                      pathname === href
                        ? 'w-full left-0'
                        : 'group-hover:w-full group-hover:left-0'
                    }`}
                  ></span>
                </Link>
              ))}
            </div>

            {/* Right - Auth (desktop) */}
            <div className="hidden md:flex items-center">
              <Link
                href="/login"
                className="flex items-center rounded-md font-bold hover:!text-black transition-colors duration-200 btn-primary"
              >
                <FiUser className="mr-2" /> Login
              </Link>
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

        {/* Mobile Slide Menu (Right side now) */}
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
              <div className="relative h-10 w-10">
                <BiSolidCameraMovie className="text-red-600 text-4xl absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <BiCameraMovie className="text-red-500 text-4xl group-hover:opacity-0 transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                VibePass
              </span>
            </Link>

            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-200"
              aria-label="Close menu"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col space-y-2 p-4">
            {navLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center font-semibold px-4 py-3 rounded-md transition-all duration-200 ${
                  pathname === href
                    ? '!bg-black !text-white'
                    : '!text-gray-300 !hover:bg-gray-800 !hover:text-red-400'
                }`}
              >
                {icon} {label}
              </Link>
            ))}
          </div>

          {/* Auth Section (mobile bottom) */}
          <div className="mt-auto p-4 border-t border-gray-800">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2 rounded-md font-bold transition-colors duration-200"
            >
              <FiUser className="mr-2" /> Login
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
