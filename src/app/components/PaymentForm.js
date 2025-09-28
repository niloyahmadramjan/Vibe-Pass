'use client'

import { useEffect, useState } from 'react'
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { FaCreditCard, FaUser, FaCalendarAlt, FaLock } from 'react-icons/fa'

export default function PaymentForm({ session }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [clientSecret, setClientSecret] = useState('')
  const [processing, setProcessing] = useState(false)

  const elementOptions = {
    style: {
      base: {
        color: '#ffffff', // 🔥 makes text white
        fontSize: '16px',
        fontFamily: 'Inter, sans-serif',
        '::placeholder': {
          color: '#9ca3af', // placeholder gray
        },
      },
      invalid: {
        color: '#ff4d4f', // error text red
      },
    },
  }

  // ✅ Create PaymentIntent on load
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: session.totalAmount * 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret)
      })
      .catch((err) => Swal.fire('Error', err.message, 'error'))
  }, [session])

  // ✅ Handle Stripe payment
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return

    setProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: session.userName,
              email: session.userEmail,
            },
          },
        }
      )

      if (error) throw error

      if (paymentIntent?.status === 'succeeded') {
        // Save payment
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/confirm-payment`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionId: paymentIntent.id,
              amount: paymentIntent.amount,
              status: paymentIntent.status,
              sessionId: session._id,
              sessionTitle: session.movieTitle,
              userEmail: session.userEmail,
            }),
          }
        )

        // Update booking
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${session._id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'paid' }),
          }
        )
        Swal.fire({
          icon: 'success',
          title: 'Payment Successful 🎉',
          text: 'Redirecting you to your tickets...',
          timer: 2000,
          showConfirmButton: false,
        })
         setTimeout(() => router.push(`/my-bookings/${paymentIntent.id}`), 2000)
        
      }
    } catch (err) {
     Swal.fire({
       icon: 'error',
       title: 'Payment Failed',
       text: err.message,
     })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 md:pt-0 font-[Inter]  p-6 flex items-center justify-center text-white">
      <div className="w-full max-w-4xl">
        <div className="rounded-3xl shadow-2xl overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-90 border border-gray-700">
          <div className="flex flex-col md:flex-row p-6 gap-8">
            {/* Card Visualization */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4">
              <div className="relative mb-8 w-full">
                <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] rounded-2xl p-6 text-white shadow-lg select-none">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-8 bg-yellow-400 rounded-md"></div>
                    <div className="text-right text-lg font-bold">CARD</div>
                  </div>

                  <div className="mb-6">
                    <div className="text-xl font-mono tracking-wider select-none">
                      **** **** **** 4242
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs opacity-70 mb-1">CARDHOLDER</div>
                      <div className="font-semibold">{session.userName}</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-70 mb-1">VALID THRU</div>
                      <div className="font-semibold">MM/YY</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-center mb-6">
                Payment Details
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Card Number */}
                <div className="relative">
                  <FaCreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                  <div className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg bg-[var(--color-bg-dark)]">
                    <CardNumberElement options={elementOptions} />
                  </div>
                </div>

                {/* Expiry & CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                    <div className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg bg-[var(--color-bg-dark)]">
                      <CardExpiryElement options={elementOptions} />
                    </div>
                  </div>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                    <div className="w-full pl-12 pr-4 py-3 border border-gray-600 rounded-lg bg-[var(--color-bg-dark)]">
                      <CardCvcElement options={elementOptions} />
                    </div>
                  </div>
                </div>

                {/* Payment Amount */}
                <div className="mt-8 text-center">
                  <div className="mb-2 font-medium">Payment Amount:</div>
                  <div className="text-3xl font-bold text-[var(--color-primary)]">
                    ৳{session.totalAmount}
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={!stripe || !clientSecret || processing}
                  className="w-full mt-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg focus:ring-4 focus:ring-[var(--color-primary)] transition-all duration-200 transform hover:-translate-y-1"
                >
                  {processing ? 'Processing...' : `PAY ৳${session.totalAmount}`}
                </button>

                {/* Security Note */}
                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <FaLock className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-white">Secured by SSL encryption</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
