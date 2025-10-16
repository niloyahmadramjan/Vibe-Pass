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

const mockSlides = [
  {
    id: 1,
    img: 'https://i.ibb.co/gLvq12yd/photo-1517604931442-7e0c8ed2963c-q-80-w-1170-auto-format-fit-crop-ixlib-rb-4-1.jpg',
    title: 'Join Our Movie Community',
    description: 'Be part of thousands enjoying premium cinema experiences',
  },
  {
    id: 2,
    img: 'https://i.ibb.co/rRg5pd69/photo-1608170825938-a8ea0305d46c-q-80-w-1025-auto-format-fit-crop-ixlib-rb-4-1.jpg',
    title: 'Perfect Movie Nights',
    description: 'Create unforgettable cinematic moments with your loved ones',
  },
  {
    id: 3,
    img: 'https://i.ibb.co/chWQ58NS/pexels-photo-7991269.jpg',
    title: 'Premium Cinema Access',
    description: 'Exclusive bookings, best seats, and special offers',
  },
  {
    id: 4,
    img: 'https://i.ibb.co/fVYg2W8L/VT0.jpg',
    title: 'Family Entertainment',
    description: 'Movies that bring joy and laughter to every family',
  },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [current, setCurrent] = useState(0)
  const [emailData, setEmailData] = useState(null)
  const otpRefs = useRef([])
  const { login } = useAuth()
  const router = useRouter()

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
      Swal.fire({
        title: 'OTP Sent! ',
        text: 'Check your email for the verification code',
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        background: '#1E1E1E',
        color: '#FFFFFF',
        iconColor: '#4CAF50',
      })
      setStep(2)
    },
    onError: () => {
      Swal.fire({
        title: 'Error',
        text: 'Failed to send OTP. Please try again.',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
        background: '#1E1E1E',
        color: '#FFFFFF',
        iconColor: '#D32F2F',
      })
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post('api/auth/verify-otp', data)
      return res.data
    },
    onSuccess: () => {
      Swal.fire({
        title: 'Success! ',
        text: 'Email verified successfully',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: '#1E1E1E',
        color: '#FFFFFF',
        iconColor: '#4CAF50',
      })
      setStep(3)
    },
    onError: () => {
      Swal.fire({
        title: 'Invalid OTP',
        text: 'Please check the code and try again',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
        background: '#1E1E1E',
        color: '#FFFFFF',
        iconColor: '#D32F2F',
      })
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
        title: 'Welcome to VibePass!',
        text: 'Your account has been created successfully',
        timer: 2000,
        showConfirmButton: false,
        background: '#1E1E1E',
        color: '#FFFFFF',
        iconColor: '#4CAF50',
      }).then(() => {
        window.location.href = '/profile'
      })
    },
    onError: () => {
      Swal.fire({
        title: 'Registration Failed',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
        background: '#1E1E1E',
        color: '#FFFFFF',
        iconColor: '#D32F2F',
      })
    },
  })

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mockSlides.length)
    }, 4000)
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
    <div className="flex min-h-screen ">
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

      {/* Right Form */}
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
              Join VibePass
            </h1>
            <h2 className="text-gray-400 text-lg">
              Create your account in 3 simple steps
            </h2>
          </div>

          {/* Step indicator */}
          <div className="flex justify-between mb-8 px-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step === stepNumber
                      ? 'bg-[var(--color-primary)] text-white scale-110'
                      : step > stepNumber
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {step > stepNumber ? '✓' : stepNumber}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    step === stepNumber
                      ? 'text-[var(--color-primary)] font-semibold'
                      : 'text-gray-400'
                  }`}
                >
                  {stepNumber === 1
                    ? 'Details'
                    : stepNumber === 2
                    ? 'Verify'
                    : 'Password'}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1 - Personal Information */}
          {step === 1 && (
            <form className="space-y-6" onSubmit={handleSubmit(onStep1Submit)}>
              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Full Name
                </label>
                <input
                  {...register('name', { required: 'Full name is required' })}
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full bg-[var(--color-bg-card)] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-gray-500"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-[var(--color-bg-card)] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-gray-500"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-3">
                  Phone Number
                </label>
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: 'Invalid phone number',
                    },
                  })}
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full bg-[var(--color-bg-card)] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-gray-500"
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={sendOtpMutation.isPending}
                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:from-[var(--color-primary-hover)] hover:to-[var(--color-primary)] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl shadow-red-500/25"
              >
                {sendOtpMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </span>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          )}

          {/* Step 2 - OTP Verification */}
          {step === 2 && (
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-white text-xl font-bold mb-2">
                  Verify Your Email
                </h3>
                <p className="text-gray-400 text-sm">
                  We sent a 6-digit code to
                  <br />
                  <span className="text-[var(--color-primary)] font-medium">
                    {getValues('email')}
                  </span>
                </p>
              </div>

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
                    className="w-12 h-12 text-center bg-[var(--color-bg-card)] border border-[#333] text-white rounded-lg focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 text-xl transition-all"
                  />
                ))}
              </div>

              <button
                type="button"
                disabled={
                  verifyOtpMutation.isPending || otp.join('').length !== 6
                }
                onClick={handleVerifyOtp}
                className="w-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] hover:from-[var(--color-primary-hover)] hover:to-[var(--color-primary)] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl shadow-red-500/25"
              >
                {verifyOtpMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying...
                  </span>
                ) : (
                  'Verify Code'
                )}
              </button>

              <p className="text-gray-400 text-sm mt-4">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={() => sendOtpMutation.mutate(getValues())}
                  className="text-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          )}

          {/* Step 3 - Password Setup */}
          {step === 3 && (
            <form className="space-y-6" onSubmit={handleSubmit(onStep3Submit)}>
              <div>
                <h3 className="text-white text-xl font-bold mb-6 text-center">
                  Create Your Password
                </h3>
                <label className="block text-white text-sm font-medium mb-3">
                  Password
                </label>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full bg-[var(--color-bg-card)] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all placeholder:text-gray-500"
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl shadow-green-500/25"
              >
                {registerMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </span>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>
          )}

          {/* Footer Links */}
          <div className="flex justify-between mt-8 text-sm">
            <Link
              href="/login"
              className="text-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors"
            >
              Already have an account?
            </Link>
            <Link
              href="/forgot-password"
              className="text-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              © 2024 VibePass Cinema. All rights reserved.
              <br />
              Your journey to amazing movie experiences starts here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
