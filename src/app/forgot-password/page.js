'use client'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { FaUser, FaLock, FaEnvelope, FaKey, FaArrowLeft } from 'react-icons/fa'
import { CgSpinner } from 'react-icons/cg'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const steps = [
    { id: 1, name: 'Enter Email' },
    { id: 2, name: 'Verify OTP' },
    { id: 3, name: 'Reset Password' },
  ]

  // 🔹 Step 1: Send OTP
  const sendOtp = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success(data.message)
      setStep(2)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Step 2: Verify OTP
  const verifyOtp = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success('OTP verified')
      setStep(3)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Step 3: Reset Password
  const resetPassword = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, password }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success('Password reset successful ')

      setStep(1)
      setEmail('')
      setOtp('')
      setPassword('')
      router.push('/login')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full text-gray-800 dark:text-gray-200">
      <div className="w-full max-w-xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2">Forgot Password</h2>
        <p className="text-center text-sm mb-8 text-gray-500 dark:text-gray-400">
          Reset your password in three simple steps.
        </p>

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0 transform -translate-y-1/2">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
          </div>
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex flex-col items-center z-10 transition-transform duration-300 ${
                s.id === step ? 'scale-110' : 'scale-100'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white transition-colors duration-500 ${
                  s.id <= step ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                {s.id}
              </div>
              <span
                className={`text-sm mt-2 transition-colors duration-500 ${
                  s.id === step
                    ? 'font-bold text-blue-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {s.name}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="space-y-6">
          {/* Back button */}
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center text-gray-500 hover:text-blue-500 transition-colors duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <div className="relative">
              <FaEnvelope className="absolute top-6 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full btn-primary p-3 mt-4 flex items-center justify-center font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400 dark:disabled:bg-blue-800"
              >
                {loading ? (
                  <CgSpinner className="animate-spin text-xl" />
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="relative">
              <FaKey className="absolute top-6 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full btn-primary p-3 mt-4 flex items-center justify-center font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400 dark:disabled:bg-blue-800"
              >
                {loading ? (
                  <CgSpinner className="animate-spin text-xl" />
                ) : (
                  'Verify OTP'
                )}
              </button>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <div className="relative">
              <FaLock className="absolute top-6 left-3  transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full border p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full btn-primary p-3 mt-4 flex items-center justify-center font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400 dark:disabled:bg-blue-800"
              >
                {loading ? (
                  <CgSpinner className="animate-spin text-xl" />
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
