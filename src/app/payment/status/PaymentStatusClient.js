'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function PaymentStatusClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const status = searchParams.get('status')
    const paymentId = searchParams.get('paymentId')

    if (!status) return

    // ✅ SUCCESS
    if (status === 'success' && paymentId) {
      toast.success('✅ Payment Successful! Redirecting to your ticket...')
      setTimeout(() => {
        router.push(`/ticket-Details/${paymentId}`)
      }, 2000)
    }
    // ❌ FAIL
    else if (status === 'fail') {
      toast.error('❌ Payment Failed! Please try again.')
      setTimeout(() => {
        router.push('/my-booking')
      }, 2000)
    }
    // ⚠️ CANCEL
    else if (status === 'cancel') {
      toast('⚠️ Payment Cancelled by user.', { icon: '⚠️' })
      setTimeout(() => {
        router.push('/my-booking')
      }, 2000)
    }
    // ⚠️ INVALID or ERROR
    else {
      toast.error('⚠️ Invalid Payment Response.')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  }, [searchParams, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">
        Processing Payment...
      </h1>
      <p className="text-gray-500">
        Please wait while we verify your transaction.
      </p>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
    </div>
  )
}
