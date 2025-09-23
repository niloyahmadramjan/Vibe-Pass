'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '../hooks/LoadingSpiner'
import { useAuth } from '@/app/context/AuthContext'
import axiosSecure from '../api/axiosHook/useAxiosSecure'

// Mock slider data
const mockSlides = [
  {
    id: 1,
    img: 'https://w0.peakpx.com/wallpaper/15/57/HD-wallpaper-deadpool-hero-movie-sitting-super.jpg',
    title: 'The Bad Guys 2',
  },
  {
    id: 2,
    img: 'https://w0.peakpx.com/wallpaper/894/474/HD-wallpaper-kung-fu-panda-kicking-kung-fu-panda-kicking-animated-panda.jpg',
    title: 'Inside Out 2',
  },
  {
    id: 3,
    img: 'https://w0.peakpx.com/wallpaper/126/584/HD-wallpaper-kung-fu-panda-swimming-kung-fu-panda-swimming-panda-animated.jpg',
    title: 'Kung Fu Panda 4',
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [current, setCurrent] = useState(0)
  const { status } = useSession()
  const router = useRouter()
  const { login } = useAuth() // custom AuthContext for JWT

  // Auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mockSlides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axiosSecure.post('/auth/login', {
        email,
        password,
      })

      // save user + token in context/localStorage
      login(res.data)

      // redirect after login
      router.push('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // redirect when authenticated (via social login)
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [status, router])

  // 🔹 show spinner if session is loading
  if (status === 'loading') {
    return <LoadingSpinner />
  }

  // 🔹 show spinner while redirecting (authenticated)
  if (status === 'authenticated') {
    return <LoadingSpinner />
  }

  return (
    <div className="flex min-h-screen">
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
          </div>
        ))}
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-4/12 flex flex-col justify-center px-10">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <h1 className="text-[var(--color-primary)] text-3xl font-bold mb-5 text-center">
            Welcome Back to VibePass
          </h1>
          <h2 className="text-gray-400 text-md font-bold mb-10 text-center">
            Log in to book your favorite movies in seconds.
          </h2>

          {/* Error */}
          {error && <p className="text-red-200 text-sm mb-3">{error}</p>}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[var(--color-white)] text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border-b border-[var(--color-white)] bg-transparent text-[var(--color-white)] focus:outline-none py-2 placeholder:text-white/70"
                required
              />
            </div>

            <div>
              <label className="block text-[var(--color-white)] text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border-b border-[var(--color-white)] bg-transparent text-[var(--color-white)] focus:outline-none py-2 placeholder:text-white/70"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--color-primary-hover)] hover:bg-red-700 transition rounded-lg py-3 font-semibold text-[var(--color-white)]"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Social Logins */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => signIn('google')}
              className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition rounded-lg py-3 font-semibold text-[var(--color-white)] shadow-md"
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
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 transition rounded-lg py-3 font-semibold text-white shadow-md"
            >
              <Image
                src="https://www.svgrepo.com/show/475654/github-color.svg"
                alt="GitHub"
                width={20}
                height={20}
              />
              Continue with GitHub
            </button>
          </div>

          {/* Links */}
          <div className="flex justify-between mt-6 text-sm text-[var(--color-white)]">
            <Link href="#" className="hover:underline">
              Forgot Password?
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </div>

          {/* Footer */}
          <p className="mt-8 text-xs text-[var(--color-white)]/70 text-center">
            VibePass v1.0.0 <br /> All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
