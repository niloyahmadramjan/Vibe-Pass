'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function VerifyQRTokenPage() {
  const params = useParams()
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [result, setResult] = useState(null)

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#CC2027] mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying QR Code...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-2xl p-8 border border-gray-700">
        {result?.success ? (
          <div className="text-center">
            <div className="text-6xl mb-4"></div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Ticket Verified!
            </h1>
            <p className="text-green-400 mb-6">{result.message}</p>
            <button
              onClick={() => router.push('/verify-qr')}
              className="bg-[#CC2027] text-white px-6 py-3 rounded-lg hover:bg-[#e02a32] transition-colors"
            >
              Verify Another Ticket
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verification Failed
            </h1>
            <p className="text-red-400 mb-6">{result?.message}</p>
            <button
              onClick={() => router.push('/verify-qr')}
              className="bg-[#CC2027] text-white px-6 py-3 rounded-lg hover:bg-[#e02a32] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
