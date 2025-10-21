'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axiosPublic from '@/app/api/axiosHook/useAxiosPublic'
import {
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaTicketAlt,
  FaArrowLeft,
  FaHome,
  FaSpinner,
} from 'react-icons/fa'

export default function VerifyQRTokenPage() {
  const params = useParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [result, setResult] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (bookingId) => {
    setIsDownloading(true)
    try {
      const response = await axiosPublic.post(
        '/api/generate-ticket-pdf',
        { bookingId },
        { responseType: 'blob' }
      )

      // Create blob URL and trigger direct download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      // Create invisible download link
      const link = document.createElement('a')
      link.href = url
      link.download = `VibePass-Ticket-${bookingId}.pdf`
      document.body.appendChild(link)

      // Trigger download
      link.click()

      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to download ticket PDF.')
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = params.token
        if (token) {
          const response = await fetch('/api/verify-qr', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ qrSignature: token }),
          })

          const verificationResult = await response.json()
          setResult(verificationResult)
        }
      } catch (error) {
        setResult({
          success: false,
          message: 'Verification failed',
        })
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [params.token])

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CC2027] mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Verifying QR Code...</p>
          <p className="text-gray-400 text-sm mt-2">
            Please wait while we validate your ticket
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            VibePass Ticket Verification
          </h1>
          <p className="text-gray-400">Digital Ticket Management System</p>
        </div>

        {result?.success ? (
          <div className="space-y-6">
            {/* Success Card */}
            <div className="bg-green-900/20 border border-green-800 rounded-2xl p-6 text-center">
              <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Ticket Verified Successfully!
              </h2>
              <p className="text-green-400 text-lg">{result.message}</p>
            </div>

            {/* Ticket Details Card */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Column - Movie Info */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
                      Movie Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">
                          Movie Title
                        </label>
                        <p className="text-white font-semibold text-lg">
                          {result.data.booking.movieTitle}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Theater</label>
                        <p className="text-white">
                          {result.data.booking.theaterName}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Screen</label>
                        <p className="text-white">
                          {result.data.booking.screen}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
                      Show Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">
                          Show Date
                        </label>
                        <p className="text-white">
                          {new Date(
                            result.data.booking.showDate
                          ).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">
                          Show Time
                        </label>
                        <p className="text-white">
                          {result.data.booking.showTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Booking & Customer Info */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
                      Booking Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">
                          Booking ID
                        </label>
                        <p className="text-white font-mono text-sm">
                          {result.data.booking._id}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">
                          Transaction ID
                        </label>
                        <p className="text-white font-mono text-sm">
                          {result.data.verification.transactionId}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">
                          Total Amount
                        </label>
                        <p className="text-[#CC2027] font-bold text-xl">
                          ৳{result.data.booking.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-gray-700">
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">
                          Customer Name
                        </label>
                        <p className="text-white font-semibold">
                          {result.data.booking.userName}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Email</label>
                        <p className="text-white">
                          {result.data.booking.userEmail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seats Information */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">
                  Seats Information
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.data.booking.selectedSeats.map((seat, index) => (
                    <span
                      key={index}
                      className="bg-[#CC2027] text-white px-3 py-2 rounded-lg font-semibold"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  Total Seats: {result.data.booking.selectedSeats.length}
                </p>
              </div>

              {/* Status Badges */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex flex-wrap gap-4">
                  <span className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2">
                    <FaCheckCircle className="text-sm" />
                    CONFIRMED
                  </span>
                  <span className="bg-green-700 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2">
                    <FaCheckCircle className="text-sm" />
                    PAID
                  </span>
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2">
                    <FaTicketAlt className="text-sm" />
                    E-TICKET
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleDownload(result.data.booking._id)}
                disabled={isDownloading}
                className="bg-[#CC2027] text-white px-8 py-4 rounded-xl hover:bg-[#e02a32] disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl min-w-[200px]"
              >
                {isDownloading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <FaDownload />
                    Download Ticket PDF
                  </>
                )}
              </button>

              <button
                onClick={() => router.push('/verify-qr')}
                className="bg-gray-700 text-white px-8 py-4 rounded-xl hover:bg-gray-600 transition-all duration-300 font-semibold text-lg border border-gray-600 flex items-center justify-center gap-3 min-w-[200px]"
              >
                <FaArrowLeft />
                Verify Another Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Error Card */}
            <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 text-center">
              <FaTimesCircle className="text-6xl text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Verification Failed
              </h2>
              <p className="text-red-400 text-lg">{result?.message}</p>
            </div>

            {/* Action Buttons for Error */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/verify-qr')}
                className="bg-[#CC2027] text-white px-8 py-4 rounded-xl hover:bg-[#e02a32] transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-3 min-w-[200px]"
              >
                <FaArrowLeft />
                Try Again
              </button>

              <button
                onClick={() => router.push('/')}
                className="bg-gray-700 text-white px-8 py-4 rounded-xl hover:bg-gray-600 transition-all duration-300 font-semibold text-lg border border-gray-600 flex items-center justify-center gap-3 min-w-[200px]"
              >
                <FaHome />
                Go to Homepage
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-6 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            Need help? Contact support@vibepass.com
          </p>
          <p className="text-gray-600 text-xs mt-2">
            &copy; {new Date().getFullYear()} VibePass. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
