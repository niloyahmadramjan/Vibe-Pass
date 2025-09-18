'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'

// Mock slider data (same design as login page)
const mockSlides = [
  {
    id: 1,
    img: 'https://w0.peakpx.com/wallpaper/15/57/HD-wallpaper-deadpool-hero-movie-sitting-super.jpg',
    title: 'Deadpool',
  },
  {
    id: 2,
    img: 'https://w0.peakpx.com/wallpaper/894/474/HD-wallpaper-kung-fu-panda-kicking-kung-fu-panda-kicking-animated-panda.jpg',
    title: 'Kung Fu Panda',
  },
  {
    id: 3,
    img: 'https://w0.peakpx.com/wallpaper/126/584/HD-wallpaper-kung-fu-panda-swimming-kung-fu-panda-swimming-panda-animated.jpg',
    title: 'Animation Movie',
  },
]

// Example backend functions (commented out)
// const sendOtp = async (email) => {
//   const res = await fetch('/api/send-otp', { method: 'POST', body: JSON.stringify({ email }) })
//   return res.json()
// }
// const verifyOtp = async (email, otp) => {
//   const res = await fetch('/api/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) })
//   return res.json()
// }
// const registerUser = async (data) => {
//   const res = await fetch('/api/register', { method: 'POST', body: JSON.stringify(data) })
//   return res.json()
// }

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const [generatedOtp, setGeneratedOtp] = useState(null)
  const [current, setCurrent] = useState(0)

  const otpRefs = useRef([])

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mockSlides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleNextStep = () => {
    if (step === 1) {
      // Step 1 → generate OTP
      const randomOtp = Math.floor(1000 + Math.random() * 9000).toString()
      setGeneratedOtp(randomOtp)
      Swal.fire('OTP Sent!', `Your OTP is: ${randomOtp}`, 'success')
      setStep(2)
    } else if (step === 2) {
      // Step 2 → check OTP
      const enteredOtp = otp.join('')
      if (enteredOtp === generatedOtp) {
        Swal.fire('Success!', 'OTP Verified', 'success')
        setStep(3)
      } else {
        Swal.fire('Error', 'Invalid OTP', 'error')
      }
    } else if (step === 3) {
      // Step 3 → Register user
      console.log({ email, phone, password })
      // Later integrate NextAuth + backend
      Swal.fire('Registered!', 'Redirecting to Home...', 'success').then(() => {
        window.location.href = '/'
      })
    }
  }

  // Handle OTP input
  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 3) {
        otpRefs.current[index + 1].focus()
      }
    }
  }

  return (
    <div className="flex min-h-screen pt-16 max-w-7xl mx-auto">
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

      {/* Right Register Form */}
      <div className="w-full md:w-4/12 bg-[var(--color-bg-dark)] flex flex-col justify-center px-10">
        <div className="max-w-sm mx-auto w-full">
          {/* Logo */}
          <h1 className="text-[var(--color-white)] text-3xl font-bold mb-5">
            Join VibePass Today!
          </h1>
          <p className="text-[var(--color-white)] text-xl font-bold mb-10">{`Create your account and enjoy a seamless movie
booking experience.`}</p>

          {/* Step Indicator */}
          <div className="flex justify-between mb-6 text-sm text-[var(--color-white)]">
            <span className={step === 1 ? 'font-bold' : 'opacity-50'}>
              INFORMATION
            </span>
            <span className={step === 2 ? 'font-bold' : 'opacity-50'}>
              E-mail OTP
            </span>
            <span className={step === 3 ? 'font-bold' : 'opacity-50'}>
              PASSWORD
            </span>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form className="space-y-6">
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full border-b border-[var(--color-white)] bg-transparent text-[var(--color-white)] focus:outline-none py-2 placeholder:text-white/70"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-[var(--color-primary-hover)] hover:bg-red-700 transition rounded-lg py-3 font-semibold text-[var(--color-white)]"
              >
                Next
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <p className="text-[var(--color-white)] mb-4">
                Enter the 4-digit OTP sent to your email
              </p>
              <div className="flex justify-between space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="w-12 h-12 text-center border-b border-[var(--color-white)] bg-transparent text-[var(--color-white)] focus:outline-none text-xl"
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-[var(--color-primary-hover)] hover:bg-red-700 transition rounded-lg py-3 font-semibold text-[var(--color-white)]"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <form className="space-y-6">
              <div>
                <label className="block text-[var(--color-white)] text-sm mb-2">
                  Set Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full border-b border-[var(--color-white)] bg-transparent text-[var(--color-white)] focus:outline-none py-2 placeholder:text-white/70"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-[var(--color-primary-hover)] hover:bg-red-700 transition rounded-lg py-3 font-semibold text-[var(--color-white)]"
              >
                Register
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="mt-8 text-xs text-[var(--color-white)]/70 text-center">
            VibePass v1.0.0 <br /> All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
