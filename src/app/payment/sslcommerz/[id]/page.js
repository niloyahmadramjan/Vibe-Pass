'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure'

export default function SSLCommerzPayment() {
  const router = useRouter()
  const { id } = useParams()

  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // ✅ 1. Fetch booking session info from backend
  useEffect(() => {
    if (!id) return

    const fetchSession = async () => {
      try {
        const res = await axiosSecure.get(`/api/ticket/booking/${id}`)
        setSession(res.data)
      } catch (err) {
        console.error('Error fetching booking:', err)
        setError(err.response?.data?.message || 'Failed to fetch booking')
      }
    }

    fetchSession()
  }, [id])

  // ✅ 2. Auto-initiate SSLCommerz payment when booking data is ready
  useEffect(() => {
    if (!session) return

    const initiateSSLPayment = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/sslcommerz/initiate`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionId: session._id, // temp until backend generates real one
              amount: session.totalAmount,
              status: 'INITIATED',
              bookingId: session._id,
              sessionTitle: session.movieTitle,
              userEmail: session.userEmail,
              userName: session.userName,
              theaterName: session.theaterName,
              showTime: session.showTime,
              selectedSeats: session.selectedSeats,
              screen: session.screen,
            }),
          }
        )

        const data = await res.json()
        console.log(data)

        if (data.url) {
          // ✅ Redirect to SSLCommerz payment page
          window.location.href = data.url
        } else {
          Swal.fire('Error', 'Payment session creation failed', 'error')
          // router.push('/tickets')
        }
      } catch (err) {
        console.error('SSLCommerz init error:', err)
        Swal.fire(
          'Error',
          err.message || 'Failed to initialize payment',
          'error'
        )
        // router.push('/tickets')
      } finally {
        setLoading(false)
      }
    }

    initiateSSLPayment()
  }, [session, router])

  // ✅ 3. UI during payment initialization
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white font-[Inter]">
      <div className="flex flex-col items-center">
        <p className="mt-4 text-lg font-semibold text-gray-300">
          Initializing SSLCommerz payment, please wait...
        </p>
        {session && (
          <p className="text-sm text-gray-400 mt-2">
            Booking for{' '}
            <span className="text-[var(--color-primary)]">
              {session.movieTitle}
            </span>{' '}
            — ৳{session.totalAmount}
          </p>
        )}
      </div>
    </div>
  )
}
