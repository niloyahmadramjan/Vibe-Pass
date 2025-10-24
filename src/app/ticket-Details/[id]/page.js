'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { QRCodeCanvas } from 'qrcode.react'
import axiosPublic from '@/app/api/axiosHook/useAxiosPublic'

export default function TicketDetailsPage() {
  const { id } = useParams() // bookingId from URL
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // ✅ Fetch booking data by ID
 useEffect(() => {
   if (!id) return

   const fetchBooking = async () => {
     try {
       const response = await axiosPublic.get(`/api/ticket/bookings/${id}`)
       setBooking(response.data)
     } catch (err) {
       console.error('❌ Error fetching booking:', err)
     } finally {
       setLoading(false)
     }
   }

   fetchBooking()
 }, [id])


  // ✅ Download PDF Ticket
  const handleDownloadPDF = async (bookingId) => {
    try {
      setDownloading(true)

      const response = await axiosPublic.post(
        '/api/generate-ticket-pdf',
        { bookingId },
        { responseType: 'blob' }
      )

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `VibePass-Ticket-${bookingId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setDownloading(false)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to download ticket PDF.')
      setDownloading(false)
    }
  }

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CC2027] mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">
            Loading your ticket details...
          </p>
        </div>
      </div>
    )
  }

  // ✅ Booking not found
  if (!booking?._id) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 bg-red-50 rounded-xl max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Ticket Not Found
          </h2>
          <p className="text-gray-600">
            The requested ticket could not be found or may have been cancelled.
          </p>
        </div>
      </div>
    )
  }

  // ✅ Fallback if booking has no payment info
  const paymentStatus = booking?.paymentStatus || 'unknown'
  const transactionId = booking?.transactionId || 'N/A'
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 pt-20 pb-15">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Ticket</h1>
          <p className="text-lg text-gray-300">
            Present this ticket at the theater entrance
          </p>
        </div>

        {/* Main Ticket Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] p-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{booking.movieTitle}</h2>
                <p className="opacity-90">
                  {booking.theaterName} • Screen {booking.screen}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  paymentStatus === 'paid'
                    ? 'bg-green-200 text-green-900'
                    : 'bg-yellow-200 text-yellow-900'
                }`}
              >
                {paymentStatus.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 p-8">
            {/* QR Code Section */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="bg-gray-200 p-6 rounded-xl shadow-inner mb-4">
                <QRCodeCanvas
                  value={`${baseUrl}/verify-qr/${booking.qrSignature}`}
                  size={180}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="H"
                  includeMargin={true}
                  className="rounded-lg"
                />
              </div>
              <p className="text-sm text-gray-600 text-center mb-6">
                Scan QR code at entrance
              </p>

              <button
                onClick={() => handleDownloadPDF(booking._id)}
                disabled={downloading}
                className="w-full bg-gradient-to-r from-[#CC2027] to-[#E53935] text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating PDF...
                  </span>
                ) : (
                  'Download PDF Ticket'
                )}
              </button>
            </div>

            {/* Ticket Details */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Show Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Show Information
                  </h3>
                  <DetailItem label="Movie" value={booking.movieTitle} />
                  <DetailItem label="Theater" value={booking.theaterName} />
                  <DetailItem
                    label="Seat Number"
                    value={booking.selectedSeats?.[0] || 'N/A'}
                  />
                  <DetailItem
                    label="Screen"
                    value={`Screen ${booking.screen}`}
                  />
                  <DetailItem
                    label="Date & Time"
                    value={`${new Date(booking.showDate).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )} at ${booking.showTime}`}
                  />
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Booking Details
                  </h3>
                  <DetailItem
                    label="Transaction ID"
                    value={transactionId}
                    mono
                  />
                  <DetailItem
                    label="Seats"
                    value={booking.selectedSeats?.join(', ') || 'N/A'}
                  />
                  <DetailItem
                    label="Total Amount"
                    value={`৳${booking.totalAmount}`}
                    highlight
                  />
                  <DetailItem
                    label="Payment Status"
                    value={paymentStatus.toUpperCase()}
                  />
                </div>

                {/* Customer Information */}
                <div className="md:col-span-2 space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Name" value={booking.userName} />
                    <DetailItem label="Email" value={booking.userEmail} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="bg-gray-50 px-8 py-4 border-t">
            <div className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Please arrive at least 30 minutes before the showtime. Bring a
              valid ID matching the booking name.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Reusable Detail Item Component
function DetailItem({ label, value, mono = false, highlight = false }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-sm font-medium text-gray-500">{label}:</span>
      <span
        className={`text-sm text-right ${mono ? 'font-mono' : ''} ${
          highlight ? 'font-bold text-[#CC2027]' : 'text-gray-900'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
