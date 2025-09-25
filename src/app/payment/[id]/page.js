'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from '@/app/components/PaymentForm'
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function PaymentPage() {
  const { id } = useParams() // movie ticket id ধরবে
  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const res = await axiosSecure.get(`/api/ticket/booking/${id}`)
        setSession(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch booking')
      }
    }
    fetchData()
  }, [id, axiosSecure])

  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!session) return <p className="text-center">Loading...</p>

  return (
    <Elements stripe={stripePromise}>
      <div className="pb-10">
        <PaymentForm session={session} />
      </div>
    </Elements>
  )
}
