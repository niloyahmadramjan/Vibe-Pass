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
  const [error, setError] = useState('')
  const [current, setCurrent] = useState(0)

  const { data: session, status } = useSession()
  const router = useRouter()
  const { login, user, loading, setLoading } = useAuth() //  from AuthContext

  // Auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mockSlides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true) //  start loading when login begins

    try {
      const res = await axiosSecure.post('api/auth/login', {
        email,
        password,
      })

      // save user + token in context/localStorage
      login(res.data)

      // SweetAlert success popup
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back to VibePass ',
        timer: 2000,
        showConfirmButton: false,
      })

      // redirect after login
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')

      Swal.fire({
        icon: 'error',
        title: 'Login Failed!',
        text: err.response?.data?.message || 'Something went wrong',
        timer: 2500,
        showConfirmButton: false,
      })
    } finally {
      setLoading(false) //  always stop loading
    }
  }

  // redirect if already logged in (NextAuth social or JWT user)
  useEffect(() => {
    if (status === 'authenticated' || user) {
      router.push('/')
    }
  }, [status, user, router])

  //  Watch session change
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: `Welcome back, ${session.user.name || 'User'}`,
        timer: 2000,
        showConfirmButton: false,
      })
    }
  }, [status, session])

  // 🔹 global loading states
  if (loading || status === 'loading') {
    return <LoadingSpinner />
  }

  // 🔹 if user already logged in, redirect (prevent flicker)
  if (user || status === 'authenticated') {
    return <LoadingSpinner />
  }

  // 🔹 Login Page (only if no user)
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
      <div className="w-full md:w-4/12 flex flex-col justify-center px-10 relative">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-[var(--color-primary)] text-3xl font-bold mb-5 text-center">
            Welcome Back to VibePass
          </h1>
          <h2 className="text-gray-400 text-md font-bold mb-10 text-center">
            Log in to book your favorite movies in seconds.
          </h2>

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
            <Link href="/forgot-password" className="hover:underline">
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
        <button
          onClick={() => router.back()}
          className="flex  absolute top-4 left-4 z-10 items-center gap-2 px-3 py-2 rounded-lg  hover:!bg-red-500 transition"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>
    </div>
  )
}
