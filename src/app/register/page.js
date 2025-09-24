'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/app/context/AuthContext'
import axiosSecure from '../api/axiosHook/useAxiosSecure'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

// Mock slider data
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

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [current, setCurrent] = useState(0)
  const [emailData, setEmailData] = useState(null)
  const otpRefs = useRef([])
  const { login } = useAuth()
  const router = useRouter();

  // React Hook Form
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm()

  // --- React Query Mutations ---
  const sendOtpMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post('api/auth/send-otp', data)
      return res.data
    },
    onSuccess: () => {
      Swal.fire('OTP Sent!', 'Check your email for the code.', 'success')
      setStep(2)
    },
    onError: () => {
      Swal.fire('Error', 'Failed to send OTP', 'error')
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post('api/auth/verify-otp', data)
      return res.data
    },
    onSuccess: () => {
      Swal.fire('Success!', 'OTP Verified', 'success')
      setStep(3)
    },
    onError: () => {
      Swal.fire('Error', 'Invalid OTP', 'error')
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post('api/auth/register', data)
      return res.data
    },
    onSuccess: (data) => {
      login(data) // store token + user in context
      Swal.fire({
        icon: 'success',
        title: '🎉 Registration Successful!',
        text: 'Welcome to VibePass. Redirecting...',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = '/profile'
      })
    },
    onError: () => {
      Swal.fire('Error', 'Registration failed', 'error')
    },
  })

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mockSlides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Handle OTP input
  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      if (value && index < 5) otpRefs.current[index + 1].focus()
    }
  }

  // Allow paste (6 digits at once)
  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text')
    if (/^\d{6}$/.test(paste)) {
      setOtp(paste.split(''))
    }
  }

  // Step 1 → Send OTP
  const onStep1Submit = (data) => {
    setEmailData(data) // save info
    sendOtpMutation.mutate(data)
  }

  // Step 2 → Verify OTP
  const handleVerifyOtp = () => {
    verifyOtpMutation.mutate({
      email: getValues('email'),
      otp: otp.join(''),
    })
  }

  // Step 3 → Register
  const onStep3Submit = (data) => {
    registerMutation.mutate({
      ...emailData,
      password: data.password,
    })
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Slider */}
      <div className="hidden md:flex w-8/12 items-center justify-center relative overflow-hidden">
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

      {/* Right Form */}
      <div className="w-full md:w-4/12 flex flex-col justify-center px-10 relative">
        <button
          onClick={() => router.back()}
          className="flex  absolute top-4 left-4 z-10 items-center gap-2 px-3 py-2 rounded-lg  hover:!bg-red-500 transition"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-[var(--color-primary)] text-4xl text-center font-bold mb-5">
            Join VibePass Today!
          </h1>
          <p className="text-gray-400 text-md font-bold mb-10 text-center">
            Create your account and enjoy a seamless movie booking experience.
          </p>

          {/* Step indicator */}
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
            <form className="space-y-6" onSubmit={handleSubmit(onStep1Submit)}>
              <input
                {...register('name', { required: true })}
                type="text"
                placeholder="Enter your name"
                className="w-full border-b border-white bg-transparent text-white py-2 placeholder:text-white/70"
              />
              <input
                {...register('email', { required: true })}
                type="email"
                placeholder="Enter your email"
                className="w-full border-b border-white bg-transparent text-white py-2 placeholder:text-white/70"
              />
              <input
                {...register('phone', { required: true })}
                type="tel"
                placeholder="Enter your phone number"
                className="w-full border-b border-white bg-transparent text-white py-2 placeholder:text-white/70"
              />
              <button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3 font-semibold text-white flex items-center justify-center"
              >
                {sendOtpMutation.isPending ? (
                  <span className="loader border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
                ) : (
                  'Next'
                )}
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <p className="text-white mb-4">Enter the 6-digit OTP</p>
              <div className="flex justify-between space-x-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-12 text-center border-b border-white bg-transparent text-white focus:outline-none text-xl"
                  />
                ))}
              </div>
              <button
                type="button"
                disabled={verifyOtpMutation.isPending}
                onClick={handleVerifyOtp}
                className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3 font-semibold text-white flex items-center justify-center"
              >
                {verifyOtpMutation.isPending ? (
                  <span className="loader border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <form className="space-y-6" onSubmit={handleSubmit(onStep3Submit)}>
              <input
                {...register('password', { required: true })}
                type="password"
                placeholder="Create a password"
                className="w-full border-b border-white bg-transparent text-white py-2 placeholder:text-white/70"
              />
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3 font-semibold text-white flex items-center justify-center"
              >
                {registerMutation.isPending ? (
                  <span className="loader border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
                ) : (
                  'Register'
                )}
              </button>
            </form>
          )}

          <div className="flex justify-between mt-6 text-sm text-white">
            <Link href="/forgot-password" className="hover:underline">
              Forgot Password?
            </Link>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
