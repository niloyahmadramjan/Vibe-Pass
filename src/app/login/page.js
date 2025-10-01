'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import LoadingSpinner from '../hooks/LoadingSpiner'
import { useAuth } from '../context/AuthContext'
import axiosSecure from '../api/axiosHook/useAxiosSecure'
import { FaArrowLeft } from 'react-icons/fa'

const mockSlides = [
  {
    id: 1,
    img: 'https://i.ibb.co/gLvq12yd/photo-1517604931442-7e0c8ed2963c-q-80-w-1170-auto-format-fit-crop-ixlib-rb-4-1.jpg',
    title: 'Experience Movies Together',
    description:
      'Join thousands of movie lovers enjoying premium cinema experiences',
  },
  {
    id: 2,
    img: 'https://i.ibb.co/rRg5pd69/photo-1608170825938-a0ea0305d46c-q-80-w-1025-auto-format-fit-crop-ixlib-rb-4-1.jpg',
    title: 'Perfect Date Nights',
    description: 'Create unforgettable moments with your loved ones',
  },
  {
    id: 3,
    img: 'https://i.ibb.co/chWQ58NS/pexels-photo-7991269.jpg',
    title: 'Premium Cinema Experience',
    description: 'Luxury seating, crystal-clear sound, and stunning visuals',
  },
  {
    id: 4,
    img: 'https://i.ibb.co/fVYg2W8L/VT0.jpg',
    title: 'Family Entertainment',
    description: 'Movies that bring families together for magical moments',
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [current, setCurrent] = useState(0)

  const { data: session, status } = useSession()
  const router = useRouter()
  const { login, user, loading, setLoading } = useAuth()

  // Auto slide every 4s (increased for better reading)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mockSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axiosSecure.post('api/auth/login', {
        email,
        password,
      })

      // Save user + token in context/localStorage
      login(res.data)

      // Enhanced SweetAlert success popup
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back! 🎬',
        text: 'Login successful! Redirecting to your dashboard...',
        timer: 2000,
        showConfirmButton: false,
        background: '#1E1E1E',
        color: '#FFFFFF',
        iconColor: '#4CAF50',
      })

      // Redirect after login
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Login failed. Please check your credentials.'
      setError(errorMessage)

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        timer: 3000,
        showConfirmButton: false,
        background: '#1E1E1E',
        color: '#FFFFFF',
        iconColor: '#D32F2F',
      })
    } finally {
      setLoading(false)
    }
  }

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' || user) {
      router.push('/')
    }
  }, [status, user, router])

  // Watch session change for social logins
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      Swal.fire({
        icon: 'success',
        title: 'Welcome! 🎉',
        text: `Successfully logged in as ${
          session.user.name || session.user.email
        }`,
        timer: 2000,
        showConfirmButton: false,
        background: '#1E1E1E',
        color: '#FFFFFF',
        iconColor: '#4CAF50',
      })

      // Redirect after social login success
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  }, [status, session, router])

  // Global loading states
  if (loading || status === 'loading') {
    return <LoadingSpinner />
  }

  // If user already logged in, redirect (prevent flicker)
  if (user || status === 'authenticated') {
    return <LoadingSpinner />
  }

  // Login Page (only if no user)
  return (
    <div className="flex min-h-screen ">
      {/* Left Slider (hidden on mobile) */}
      <div className="hidden md:flex w-8/12 bg-black items-center justify-center relative overflow-hidden">
        {mockSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.img}
              alt={slide.title}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay with text */}
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-8 text-white max-w-2xl">
                <h3 className="text-3xl font-bold mb-3 text-[var(--color-secondary)]">
                  {slide.title}
                </h3>
                <p className="text-lg opacity-90">{slide.description}</p>
                {/* Slide indicators */}
                <div className="flex gap-2 mt-6">
                  {mockSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrent(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === current
                          ? 'bg-[var(--color-primary)] w-8'
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-4/12 flex flex-col justify-center px-6 sm:px-10 relative">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex absolute top-6 left-6 items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-bg-card)] hover:bg-[var(--color-primary)] text-white transition-all duration-300 group"
        >
          <FaArrowLeft className="group-hover:translate-x-[-2px] transition-transform" />
          <span>Back</span>
        </button>

        <div className="max-w-sm mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">VP</span>
            </div>
            <h1 className="text-[var(--color-primary)] text-3xl font-bold mb-3">
              Welcome Back
            </h1>
            <h2 className="text-gray-400 text-lg">
              Sign in to continue your cinematic journey
            </h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[var(--color-bg-card)] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-3">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[var(--color-bg-card)] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:from-[var(--color-primary-hover)] hover:to-[var(--color-primary)] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl shadow-red-500/25"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </span>
              ) : (
                'Sign In to VibePass'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">Or continue with</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Social Logins */}
          <div className="space-y-3">
            <button
              onClick={() => signIn('google')}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 shadow-sm"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Continue with Google
            </button>
            <button
              onClick={() => signIn('github')}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 border border-gray-700 hover:border-gray-600 shadow-sm"
            >
              <Image
                src="https://www.svgrepo.com/show/475654/github-color.svg"
                alt="GitHub"
                width={20}
                height={20}
                className="filter invert"
              />
              Continue with GitHub
            </button>
          </div>

          {/* Links */}
          <div className="flex justify-between mt-8 text-sm">
            <Link
              href="/forgot-password"
              className="text-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors"
            >
              Forgot Password?
            </Link>
            <Link
              href="/register"
              className="text-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors"
            >
              Create Account
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              © 2024 VibePass Cinema. All rights reserved.
              <br />
              Your ticket to unforgettable movie experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
