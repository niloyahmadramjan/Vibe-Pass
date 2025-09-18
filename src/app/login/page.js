'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

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

// Example function to fetch from backend (commented out)
// const fetchSlides = async () => {
//   const res = await fetch('/api/movies')
//   return res.json()
// }

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [current, setCurrent] = useState(0)

  // Auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mockSlides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('Login with', email, password)
    // Later connect with NextAuth signIn here
  }

  return (
    <div className="flex min-h-screen pt-16">
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
            {/* <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
              <h2 className="text-xl font-bold">{slide.title}</h2>
            </div> */}
          </div>
        ))}
      </div>

      {/* Right Login Form */}
      <div className="w-full md:w-4/12 bg-[var(--color-dark)] flex flex-col justify-center px-10">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <h1 className="text-[var(--color-white)] text-3xl font-bold mb-5">
            Welcome Back to VibePass
          </h1>
          <h2 className="text-[var(--color-white)] text-xl font-bold mb-10">
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

          {/* Links */}
          <div className="flex justify-between mt-6 text-sm text-[var(--color-white)]">
            <a href="#" className="hover:underline">
              Forgot Password?
            </a>
            <a href="/register" className="hover:underline">
              Register
            </a>
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
