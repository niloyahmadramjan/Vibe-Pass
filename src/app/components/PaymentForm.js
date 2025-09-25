'use client'
import { useEffect, useState, useContext } from 'react'
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js'
import Swal from 'sweetalert2'
import {
  FaShieldAlt,
  FaCreditCard,
  FaLock,
  FaCheckCircle,
  FaSpinner,
  FaCalendarAlt,
  FaStar,
  FaBolt,
} from 'react-icons/fa'
import { MdOutlinePassword } from 'react-icons/md'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function PaymentForm({ session }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
    const {user} = useAuth() //  from AuthContext
  const [clientSecret, setClientSecret] = useState('')
  const [processing, setProcessing] = useState(false)
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  })
  const [cardBrand, setCardBrand] = useState('')

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
        else throw new Error(data.error || 'Failed to initialize payment')
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Payment Initialization Failed',
          text: err.message,
          background: '#1f2937',
          color: 'white',
        })
      })
  }, [session])

  // ✅ Handle card element changes with brand detection
  const handleCardChange = (field) => (event) => {
    setCardComplete((prev) => ({
      ...prev,
      [field]: event.complete,
    }))

    if (field === 'cardNumber' && event.brand) {
      setCardBrand(event.brand)
    }
  }

  // ✅ Handle Payment
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return

    if (
      !cardComplete.cardNumber ||
      !cardComplete.cardExpiry ||
      !cardComplete.cardCvc
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Card Details',
        text: 'Please fill in all card information correctly.',
        background: '#1f2937',
        color: 'white',
        confirmButtonColor: '#dc2626',
      })
      return
    }

    const result = await Swal.fire({
      title: `Confirm Payment - ৳${session.totalAmount}`,
      html: `
        <div class="text-left">
          <p class="mb-2">You're about to pay for:</p>
          <div class="bg-gray-100 p-3 rounded-lg mb-3">
            <strong class="text-gray-900">${session.movieTitle}</strong>
          </div>
          <p class="text-sm text-gray-300">This transaction is secure and encrypted.</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Pay ৳${session.totalAmount}`,
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      background: '#1f2937',
      color: 'white',
      reverseButtons: true,
    })

    if (!result.isConfirmed) return

    setProcessing(true)

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name: user?.name || 'Customer',
              email: user?.email || 'guest@example.com',
            },
          },
        }
      )

      if (error) throw error

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // ✅ Save payment to DB
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
              userEmail: user?.email,
            }),
          }
        )

        // ✅ Update booking status → paid
        await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${session._id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'paid' }),
          }
        )

        router.push(`/ticket-Details?tx=${paymentIntent.id}`)

        Swal.fire({
          icon: 'success',
          title: '🎉 Payment Successful!',
          html: `
            <div class="text-center">
              <div class="text-green-400 text-4xl mb-2">✓</div>
              <div class="text-lg font-semibold mb-1">৳${
                session.totalAmount
              } Paid</div>
              <div class="text-gray-300">${session.movieTitle}</div>
              <div class="mt-3 text-sm text-gray-400">Transaction ID: ${paymentIntent.id.slice(
                -8
              )}</div>
            </div>
          `,
          timer: 4000,
          showConfirmButton: false,
          background: '#1f2937',
          color: 'white',
        })
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.message,
        confirmButtonColor: '#dc2626',
        background: '#1f2937',
        color: 'white',
      })
    } finally {
      setProcessing(false)
    }
  }

  const isFormValid =
    cardComplete.cardNumber && cardComplete.cardExpiry && cardComplete.cardCvc

  const getCardBrandIcon = () => {
    const brands = {
      visa: 'VISA',
      mastercard: 'MC',
      amex: 'AMEX',
      discover: 'DISC',
      diners: 'DINERS',
      jcb: 'JCB',
      unionpay: 'UNION',
    }
    return brands[cardBrand] || 'CARD'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
            Secure Payment
          </h1>
          <p className="text-gray-400 text-lg">Complete your cinema booking</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Top */}
          <div className="bg-gradient-to-r from-gray-900 to-black px-6 py-5 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaCreditCard className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <FaCheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <div className="text-white font-bold text-lg">
                  Payment Details
                </div>
                <div className="text-gray-300 text-sm">
                  Step 2 of 2 • Almost there!
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Info */}
          <div className="p-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 mb-6 border border-red-200 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <FaStar className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-gray-900 text-lg">
                    {session.movieTitle}
                  </span>
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-red-600 border border-red-200">
                  TICKET
                </div>
              </div>
              <div className="text-center py-3">
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  ৳{session.totalAmount}
                </div>
                <div className="text-gray-600 text-sm">Total Amount</div>
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <FaLock className="h-3 w-3 text-green-500" />
                <span>Secure SSL Encrypted Transaction</span>
              </div>
            </div>

            {/* Card Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Card Number */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-gray-700">
                    Card Number
                  </label>
                  {cardBrand && (
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs font-mono font-bold text-gray-600">
                      {getCardBrandIcon()}
                    </div>
                  )}
                </div>
                <div
                  className={`relative border-2 rounded-xl p-4 ${
                    cardComplete.cardNumber
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <CardNumberElement
                    onChange={handleCardChange('cardNumber')}
                    options={{
                      style: {
                        base: { fontSize: '16px', color: '#1f2937' },
                        invalid: { color: '#dc2626' },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Expiry Date
                  </label>
                  <div
                    className={`relative border-2 rounded-xl p-4 ${
                      cardComplete.cardExpiry
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <CardExpiryElement
                      onChange={handleCardChange('cardExpiry')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    CVC
                  </label>
                  <div
                    className={`relative border-2 rounded-xl p-4 ${
                      cardComplete.cardCvc
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <CardCvcElement onChange={handleCardChange('cardCvc')} />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  !stripe || !clientSecret || processing || !isFormValid
                }
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg mt-6 flex items-center justify-center space-x-3 ${
                  processing
                    ? 'bg-gray-200'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                }`}
              >
                {processing ? (
                  <>
                    <FaSpinner className="animate-spin h-6 w-6" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <FaLock className="h-5 w-5" />
                    <span>Pay ৳{session.totalAmount} Now</span>
                    <FaBolt className="h-5 w-5 text-yellow-300" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
