'use client'

import { useState } from 'react'
import {
  FaTicketAlt,
  FaQrcode,
  FaCamera,
  FaUpload,
  FaCopy,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaFilm,
  FaTheaterMasks,
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaReceipt,
  FaPrint,
  FaEnvelope,
  FaRedo,
  FaLightbulb,
  FaLink,
  FaSpinner,
  FaDownload,
} from 'react-icons/fa'
import axiosPublic from '../api/axiosHook/useAxiosPublic'

export default function VerifyQRPage() {
  const [qrData, setQrData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [scanMode, setScanMode] = useState(false)

  // Handle manual QR data input
  const handleManualVerify = async (e) => {
    e.preventDefault()
    if (!qrData.trim()) return

    await verifyQRCode(qrData.trim())
  }

  // Handle QR scan from file upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        setQrData(text)
        verifyQRCode(text)
      }
      reader.readAsText(file)
    }
  }

  // Copy QR URL to clipboard
  const copyQRUrl = () => {
    const qrUrl = `${window.location.origin}/verify-qr/${qrData}`
    navigator.clipboard.writeText(qrUrl)
    // You can use a toast notification here instead of alert
    alert('QR URL copied to clipboard!')
  }


 const handleDownload = async (bookingId) => {
   try {
     const response = await axiosPublic.post(
       '/api/generate-ticket-pdf',
       { bookingId },
       { responseType: 'blob' } // important for binary PDF
     )

     // Create blob URL and trigger direct download
     const blob = new Blob([response.data], { type: 'application/pdf' })
     const url = window.URL.createObjectURL(blob)

     // Create invisible download link
     const link = document.createElement('a')
     link.href = url
     link.download = `VibePass-Ticket-${bookingId}.pdf` // Set filename
     document.body.appendChild(link)

     // Trigger download
     link.click()

     // Clean up
     document.body.removeChild(link)
     window.URL.revokeObjectURL(url)
   } catch (error) {
     console.error('Error generating PDF:', error)
     alert('Failed to download ticket PDF.')
   }
 }


  // Verify QR code with backend
  const verifyQRCode = async (qrSignature) => {
    setIsLoading(true)
    setVerificationResult(null)

    try {
      // Remove the base URL if present to get just the JWT token
      const cleanQrSignature = qrSignature.replace(
        `${window.location.origin}/verify-qr/`,
        ''
      )

      const response = await fetch('/api/verify-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qrSignature: cleanQrSignature }),
      })

      const result = await response.json()
      setVerificationResult(result)
    } catch (error) {
      setVerificationResult({
        success: false,
        message: 'Network error. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Format time for display
  const formatTime = (timeString) => {
    return timeString
  }

  return (
    <div className="min-h-screen  pt-20  pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-[#CC2027] rounded-2xl mb-6">
            <FaTicketAlt className="text-3xl text-white" />
          </div> */}
          <h1 className="text-4xl font-bold text-white mb-4">Verify Ticket</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Scan or enter QR code to verify ticket authenticity and access
            booking details
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Input Methods */}
          <div className="xl:col-span-2 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 sm:p-8">
            <div className="flex space-x-4 mb-6 border-b border-gray-700 pb-2">
              <button
                onClick={() => setScanMode(false)}
                className={`flex items-center pb-4 px-2 font-medium transition-colors ${
                  !scanMode
                    ? 'text-[#CC2027] border-b-2 border-[#CC2027]'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <FaQrcode className="mr-2" />
                Manual Entry
              </button>
              <button
                onClick={() => setScanMode(true)}
                className={`flex items-center pb-4 px-2 font-medium transition-colors ${
                  scanMode
                    ? 'text-[#CC2027] border-b-2 border-[#CC2027]'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <FaCamera className="mr-2" />
                Scan QR
              </button>
            </div>

            {!scanMode ? (
              // Manual Entry Form
              <form onSubmit={handleManualVerify} className="space-y-6">
                <div>
                  <label
                    htmlFor="qrData"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Enter QR Code Data or URL
                  </label>
                  <textarea
                    id="qrData"
                    value={qrData}
                    onChange={(e) => setQrData(e.target.value)}
                    placeholder="Paste QR code JWT token or full URL here... Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    rows={8}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-[#CC2027] focus:border-transparent resize-none text-white placeholder-gray-400 font-mono text-sm"
                    required
                  />
                </div>

                {qrData && (
                  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <p className="text-sm text-gray-300 mb-2">Quick Actions</p>
                    <button
                      type="button"
                      onClick={copyQRUrl}
                      className="flex items-center text-sm bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      <FaCopy className="mr-2" />
                      Copy Verify URL
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !qrData.trim()}
                  className="w-full bg-[#CC2027] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#e02a32] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-3" />
                      Verifying Ticket...
                    </>
                  ) : (
                    <>
                      <FaSearch className="mr-3" />
                      Verify Ticket
                    </>
                  )}
                </button>
              </form>
            ) : (
              // QR Scan Interface
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mx-auto w-72 h-72 bg-gray-700 rounded-2xl border-2 border-dashed border-gray-600 flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-2 border-2 border-[#CC2027] rounded-lg opacity-20"></div>
                    <div className="text-center z-10">
                      <FaCamera className="mx-auto text-4xl text-gray-400 mb-3" />
                      <p className="text-sm text-gray-400">
                        Camera scanner would appear here
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-6">
                    Point your camera at the QR code to scan automatically
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-4">- OR -</p>
                  <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <p className="text-gray-300 mb-4 flex items-center justify-center">
                      <FaUpload className="mr-2" />
                      Upload QR code image
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#CC2027] file:text-white hover:file:bg-[#e02a32] file:transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FaTicketAlt className="mr-3 text-[#CC2027]" />
              Verification Result
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <FaSpinner className="animate-spin text-4xl text-[#CC2027] mx-auto mb-4" />
                <p className="text-gray-400">
                  Verifying ticket authenticity...
                </p>
                <p className="text-sm text-gray-500 mt-2">Please wait</p>
              </div>
            ) : verificationResult ? (
              <div className="space-y-6">
                {/* Status Badge */}
                <div
                  className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${
                    verificationResult.success
                      ? 'bg-green-900/30 text-green-400 border border-green-800'
                      : 'bg-red-900/30 text-red-400 border border-red-800'
                  }`}
                >
                  {verificationResult.success ? (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Valid Ticket
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="mr-2" />
                      Invalid Ticket
                    </>
                  )}
                </div>

                {/* Message */}
                <p
                  className={`text-lg font-semibold ${
                    verificationResult.success
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {verificationResult.message}
                </p>

                {/* Booking Details */}
                {verificationResult.success && verificationResult.data && (
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <FaFilm className="mr-3 text-[#CC2027]" />
                      Booking Details
                    </h3>
                    <div className="space-y-4 bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                      <div className="flex justify-between items-center py-2 border-b border-gray-600">
                        <span className="text-gray-400 flex items-center">
                          <FaFilm className="mr-2" />
                          Movie:
                        </span>
                        <span className="font-medium text-white text-right">
                          {verificationResult.data.booking.movieTitle}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-600">
                        <span className="text-gray-400 flex items-center">
                          <FaTheaterMasks className="mr-2" />
                          Theater:
                        </span>
                        <span className="font-medium text-white text-right">
                          {verificationResult.data.booking.theaterName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-600">
                        <span className="text-gray-400 flex items-center">
                          <FaCalendarAlt className="mr-2" />
                          Date:
                        </span>
                        <span className="font-medium text-white text-right">
                          {formatDate(
                            verificationResult.data.verification.showDate
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-600">
                        <span className="text-gray-400 flex items-center">
                          <FaClock className="mr-2" />
                          Time:
                        </span>
                        <span className="font-medium text-white text-right">
                          {formatTime(
                            verificationResult.data.verification.showTime
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-600">
                        <span className="text-gray-400 flex items-center">
                          <FaChair className="mr-2" />
                          Seats:
                        </span>
                        <span className="font-medium text-white text-right">
                          {verificationResult.data.booking.selectedSeats?.join(
                            ', '
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-400 flex items-center">
                          <FaReceipt className="mr-2" />
                          Transaction ID:
                        </span>
                        <span className="font-medium text-[#CC2027] text-sm text-right">
                          {verificationResult.data.verification.transactionId}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-700">
                      <button
                        onClick={() =>
                          handleDownload(verificationResult.data.booking._id)
                        }
                        className="flex-1 bg-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors border border-gray-600 flex items-center justify-center"
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </button>
                      <button className="flex-1 bg-[#CC2027] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#e02a32] transition-colors flex items-center justify-center">
                        <FaEnvelope className="mr-2" />
                        Email
                      </button>
                    </div>
                  </div>
                )}

                {/* Try Again Button for Errors */}
                {!verificationResult.success && (
                  <button
                    onClick={() => setVerificationResult(null)}
                    className="w-full bg-gray-700 text-gray-300 py-4 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors border border-gray-600 flex items-center justify-center"
                  >
                    <FaRedo className="mr-2" />
                    Try Again
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FaSearch className="text-6xl mx-auto mb-4 text-gray-500" />
                <p className="text-lg mb-2">Ready to Verify</p>
                <p className="text-sm">
                  Enter or scan QR code to check ticket validity
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="font-semibold text-white mb-3 flex items-center">
            <FaLightbulb className="mr-3 text-[#CC2027]" />
            How to verify tickets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="text-[#CC2027] font-semibold mb-2 flex items-center">
                <FaQrcode className="mr-2" />
                Manual Entry
              </div>
              <p className="text-gray-400">
                Copy and paste the QR code JWT token from the ticket email or
                use the full verify URL
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="text-[#CC2027] font-semibold mb-2 flex items-center">
                <FaCamera className="mr-2" />
                QR Scan
              </div>
              <p className="text-gray-400">
                Use your device camera to scan the QR code image directly from
                the ticket
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
              <div className="text-[#CC2027] font-semibold mb-2 flex items-center">
                <FaUpload className="mr-2" />
                File Upload
              </div>
              <p className="text-gray-400">
                Upload a screenshot or image file containing the QR code for
                verification
              </p>
            </div>
          </div>
        </div>

        {/* QR URL Preview */}
        {qrData && (
          <div className="mt-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
            <h4 className="text-white font-semibold mb-2 flex items-center">
              <FaLink className="mr-2 text-[#CC2027]" />
              Quick Verify URL
            </h4>
            <div className="bg-gray-900 rounded-lg p-3 border border-gray-600">
              <code className="text-sm text-green-400 break-all font-mono">
                {`${
                  typeof window !== 'undefined' ? window.location.origin : ''
                }/verify-qr/${qrData}`}
              </code>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Share this URL for direct verification without manual entry
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
