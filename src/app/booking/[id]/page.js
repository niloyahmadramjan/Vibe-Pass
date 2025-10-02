'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure'
import Image from 'next/image'
import { useAuth } from '@/app/context/AuthContext'
import LoadingSpinner from '@/app/hooks/LoadingSpiner'

// Toast notification system
const toast = {
  success: (message) => {
    const toastEl = document.createElement('div')
    toastEl.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #22C55E, #16A34A);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
      ">
         ${message}
      </div>
    `
    document.body.appendChild(toastEl)
    setTimeout(() => {
      toastEl.style.animation = 'slideOut 0.3s ease-in'
      setTimeout(() => {
        if (document.body.contains(toastEl)) {
          document.body.removeChild(toastEl)
        }
      }, 300)
    }, 3000)
  },
  error: (message) => {
    const toastEl = document.createElement('div')
    toastEl.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #EF4444, #DC2626);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
      ">
         ${message}
      </div>
    `
    document.body.appendChild(toastEl)
    setTimeout(() => {
      toastEl.style.animation = 'slideOut 0.3s ease-in'
      setTimeout(() => {
        if (document.body.contains(toastEl)) {
          document.body.removeChild(toastEl)
        }
      }, 300)
    }, 3000)
  },
}

// CSS styles injection (only once)
if (
  typeof window !== 'undefined' &&
  !document.getElementById('seat-booking-styles')
) {
  const style = document.createElement('style')
  style.id = 'seat-booking-styles'
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #CC2027, #E53935);
      color: white;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      border-radius: 9999px;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #E53935, #B71C1C);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(204, 32, 39, 0.3);
    }
    
    .btn-primary:disabled {
      background: #4a5568;
      color: #a0aec0;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    
    :root {
      --color-primary: #CC2027;
      --color-primary-hover: #E53935;
      --color-bg-dark: #1A1A1A;
      --color-bg-light: #F5F5F5;
      --color-white: #FFFFFF;
      --color-text-dark: #1A1A1A;
      --color-text-light: #FFFFFF;
    }
    
    .seat-btn {
      transition: all 0.2s ease;
    }
    
    .seat-btn:hover:not(:disabled) {
      transform: scale(1.1);
    }
    
    .modal-backdrop {
      backdrop-filter: blur(8px);
    }
  `
  document.head.appendChild(style)
}

// SVG Icons
const Clock = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const CreditCard = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const Calendar = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const MapPin = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 21.75l-7.75-7.75a8.25 8.25 0 1 1 15.5 0L12 21.75z" />
    <circle cx="12" cy="10.25" r="3.25" />
  </svg>
)

const Ticket = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const Film = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
)

const ArrowLeft = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

// Showtime data
const showtimes = [
  { id: 'showtime-1', time: '03:00 PM', price: 150, available: 45 },
  { id: 'showtime-2', time: '06:00 PM', price: 200, available: 23 },
  { id: 'showtime-3', time: '09:00 PM', price: 180, available: 31 },
]

// Seat layout with pricing tiers
const seatSections = [
  {
    id: 'platinum',
    name: 'Platinum',
    price: 300,
    color: 'from-red-600 to-red-800',
    rows: [
      { row: 'A', seats: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'] },
      { row: 'B', seats: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'] },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 250,
    color: 'from-rose-600 to-rose-800',
    rows: [
      {
        row: 'C',
        seats: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'],
      },
      {
        row: 'D',
        seats: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'],
      },
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 200,
    color: 'from-zinc-600 to-zinc-800',
    rows: [
      {
        row: 'E',
        seats: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'],
      },
      {
        row: 'F',
        seats: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'],
      },
      {
        row: 'G',
        seats: ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'],
      },
    ],
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 150,
    color: 'from-gray-600 to-gray-800',
    rows: [
      {
        row: 'H',
        seats: [
          'H1',
          'H2',
          'H3',
          'H4',
          'H5',
          'H6',
          'H7',
          'H8',
          'H9',
          'H10',
          'H11',
          'H12',
        ],
      },
      {
        row: 'I',
        seats: [
          'I1',
          'I2',
          'I3',
          'I4',
          'I5',
          'I6',
          'I7',
          'I8',
          'I9',
          'I10',
          'I11',
          'I12',
        ],
      },
      {
        row: 'J',
        seats: [
          'J1',
          'J2',
          'J3',
          'J4',
          'J5',
          'J6',
          'J7',
          'J8',
          'J9',
          'J10',
          'J11',
          'J12',
        ],
      },
    ],
  },
]

// Pre-booked seats
const reservedSeats = [
  'A3',
  'B5',
  'C8',
  'D1',
  'E4',
  'F7',
  'G3',
  'H5',
  'I2',
  'J8',
  'C4',
  'D9',
]

export default function MovieSeatBooking() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id
  const { user } = useAuth()

  // States
  const [movieData, setMovieData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [selectedSeats, setSelectedSeats] = useState([])
  const [hoveredSeat, setHoveredSeat] = useState(null)
  const [showBookingConfirm, setShowBookingConfirm] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [paymentTimer, setPaymentTimer] = useState(600) // 10 minutes in seconds

  const theaterName = searchParams.get("cinema") || "Default Theater";



  // Load movie data from TMDB API
  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true)

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos`
        )

        if (res.ok) {
          const movie = await res.json()
          setMovieData(movie)
        } else {
          throw new Error('Failed to fetch movie data')
        }
      } catch (error) {
        console.error('Error loading movie data:', error)
        toast.error('Error loading movie data. Redirecting...')
        setTimeout(() => {
          router.push(`/movies/${id}`)
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadMovieData()
    }
  }, [id, router])

  // Payment timer countdown
  useEffect(() => {
    let interval
    if (bookingSuccess && paymentTimer > 0) {
      interval = setInterval(() => {
        setPaymentTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [bookingSuccess, paymentTimer])

  // Format timer display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  // Helper function to find seat section
  const getSeatSection = (seat) => {
    for (const section of seatSections) {
      for (const row of section.rows) {
        if (row.seats.includes(seat)) {
          return section
        }
      }
    }
    return null
  }

  // Calculate total price
  const totalPrice = selectedSeats.reduce((total, seat) => {
    const section = getSeatSection(seat)
    return total + (section ? section.price : 0)
  }, 0)

  // Handle seat selection
  const handleSeatClick = (seat) => {
    try {
      if (reservedSeats.includes(seat)) {
        toast.error('This seat is already booked!')
        return
      }

      if (selectedSeats.includes(seat)) {
        setSelectedSeats(selectedSeats.filter((s) => s !== seat))
        toast.success(`Seat ${seat} deselected`)
      } else {
        if (selectedSeats.length < 8) {
          setSelectedSeats([...selectedSeats, seat])
          toast.success(`Seat ${seat} selected`)
        } else {
          toast.error('Maximum 8 seats can be selected!')
        }
      }
    } catch (error) {
      console.error('Error selecting seat:', error)
      toast.error('Error selecting seat. Please try again.')
    }
  }

  // Handle booking
  const handleBooking = () => {
    try {
      if (!selectedTime) {
        toast.error('Please select a showtime first!')
        return
      }
      if (selectedSeats.length === 0) {
        toast.error('Please select at least one seat!')
        return
      }
      setShowBookingConfirm(true)
    } catch (error) {
      console.error('Error during booking:', error)
      toast.error('Error processing booking. Please try again.')
    }
  }

  // Confirm booking
  const confirmBooking = async () => {
    try {
      setShowBookingConfirm(false)

      const bookingPayload = {
        movieId: id,
        movieTitle: movieData.title,
         theaterName: theaterName, 
        showId: selectedTime?.id,
        showDate: selectedDate,
        showTime: selectedTime?.time,
        screen: 'Screen 1',
        selectedSeats,
        totalAmount: totalPrice,
        userId: user?.id,
        userName: user?.name || 'User',
        userEmail: user?.email,
      }
      console.log(bookingPayload)
      console.log(user)

      const response = await axiosSecure.post(
        '/api/ticket/booking',
        bookingPayload
      )

      setBookingData(response.data.booking)
      setBookingSuccess(true)
      toast.success('Booking confirmed successfully!')

      // Reset selections
      setTimeout(() => {
        setSelectedSeats([])
        setSelectedTime(null)
      }, 2000)
    } catch (error) {
      console.error('Booking error:', error)
      if (error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Server error while saving booking')
      }
    }
  }

  // Handle payment
  const handlePayment = (payNow = false) => {
    if (payNow && bookingData) {
      router.push(`/payment/${bookingData._id}`)
    } else {
      setBookingSuccess(false)
      setBookingData(null)
      setPaymentTimer(600)
    }
  }

  // Generate date options (next 7 days)
  const getDateOptions = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(today.getDate() + i)
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      })
    }
    return dates
  }

  // Loading state
  if (loading) {
    return <LoadingSpinner/>
  }

  // If no movie data, show error
  if (!movieData) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            ❌ Movie data not found!
          </div>
          <button
            onClick={() => router.push('/movies')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back to Movies
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white p-4 font-sans pt-16">
      <div className="max-w-7xl mx-auto py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/movies/${id}`)}
          className="mb-6 px-4 py-2 bg-gray-700/80 text-white rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Movie Details
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-red-500 mb-2">
            BOOK YOUR SEATS
          </h1>
          <p className="text-gray-300 text-lg">
            Choose your perfect seats for {movieData.title}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Movie Info & Showtimes */}
          <div className="lg:col-span-1 space-y-6">
            {/* Movie Card */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              {movieData.backdrop_path && (
                <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                  <Image
                    width={500}
                    height={200}
                    src={`https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`}
                    alt={movieData.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50"></div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <Film className="w-12 h-12 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-white">
                    {movieData.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {movieData.genres?.map((g) => g.name).join(', ')} |
                    {movieData.runtime && ` ${movieData.runtime}m`} | ⭐{' '}
                    {movieData.vote_average?.toFixed(1)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-red-500" />
                 <span>{theaterName}</span>

                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span>Today, {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">
                <Calendar className="w-5 h-5" />
                Select Date
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {getDateOptions().map((date) => (
                  <button
                    key={date.value}
                    onClick={() => setSelectedDate(date.value)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      selectedDate === date.value
                        ? 'bg-red-600 border-red-500'
                        : 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50'
                    } border-2`}
                  >
                    <div className="font-semibold">
                      {date.label.split(' ')[0]}
                    </div>
                    <div className="text-sm">
                      {date.label.split(' ').slice(1).join(' ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Showtimes */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">
                <Clock className="w-5 h-5" />
                Showtimes
              </h3>
              <div className="space-y-3">
                {showtimes.map((show) => (
                  <button
                    key={show.id}
                    onClick={() => {
                      setSelectedTime(show)
                      toast.success(`Selected ${show.time} showtime`)
                    }}
                    className={`w-full p-4 rounded-xl transition-all duration-300 border-2 ${
                      selectedTime?.id === show.id
                        ? 'bg-red-600 border-red-500 shadow-lg'
                        : 'bg-gray-700/50 border-gray-600/50 hover:bg-gray-600/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        <div className="font-bold text-lg">{show.time}</div>
                        <div className="text-sm text-gray-300">
                          ৳{show.price}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-300">
                          {show.available} seats
                        </div>
                        <div className="text-xs text-gray-400">available</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <h3 className="font-bold mb-4 text-red-500 flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                Seat Types
              </h3>
              <div className="space-y-3">
                {seatSections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full bg-gradient-to-r ${section.color}`}
                      ></div>
                      <span className="text-sm">{section.name}</span>
                    </div>
                    <span className="text-sm font-bold">৳{section.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse"></div>
                  <span className="text-sm">Booked</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                  <span className="text-sm">Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Seat Selection */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700/50 shadow-xl">
              {/* Screen */}
              <div className="text-center mb-12">
                <div className="relative mx-auto max-w-2xl">
                  <div className="h-4 bg-gray-700 rounded-b-full shadow-[0_15px_30px_-5px_rgba(204,32,39,0.3)]"></div>
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gray-900 rounded-b-full"></div>
                </div>
                <p className="text-gray-400 text-sm mt-3 font-medium tracking-widest">
                  S C R E E N
                </p>
              </div>

              {/* Seat Layout */}
              <div className="space-y-4 md:space-y-6">
                {seatSections.map((section) => (
                  <div key={section.id} className="text-center">
                    <h4
                      className={`text-lg font-bold mb-4 bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}
                    >
                      {section.name} - ৳{section.price}
                    </h4>

                    <div className="space-y-2">
                      {section.rows.map((row) => (
                        <div
                          key={row.row}
                          className="flex justify-center items-center gap-2"
                        >
                          <span className="text-gray-400 font-bold w-6 text-right mr-2">
                            {row.row}
                          </span>

                          <div className="flex gap-1 flex-wrap justify-center">
                            {row.seats.map((seat) => {
                              const isSelected = selectedSeats.includes(seat)
                              const isReserved = reservedSeats.includes(seat)
                              const isHovered = hoveredSeat === seat
                              const seatSection = getSeatSection(seat)

                              return (
                                <button
                                  key={seat}
                                  onClick={() => handleSeatClick(seat)}
                                  onMouseEnter={() => setHoveredSeat(seat)}
                                  onMouseLeave={() => setHoveredSeat(null)}
                                  disabled={isReserved}
                                  className={`relative w-8 h-8 md:w-10 md:h-10 rounded-lg font-bold text-xs seat-btn border-2
                                    ${
                                      isReserved
                                        ? 'bg-red-800 border-red-700 cursor-not-allowed text-red-300'
                                        : isSelected
                                        ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-500/30 scale-110'
                                        : isHovered
                                        ? `bg-gradient-to-r ${seatSection.color} border-white/50 text-white scale-105 shadow-lg`
                                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                  {seat.slice(1)}

                                  {/* Tooltip */}
                                  {isHovered && !isReserved && seatSection && (
                                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 border border-gray-700 shadow-md">
                                      {seatSection.name} - ৳{seatSection.price}
                                    </div>
                                  )}
                                </button>
                              )
                            })}
                          </div>

                          <span className="text-gray-400 font-bold w-6 text-left ml-2">
                            {row.row}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Selection Summary */}
              {selectedSeats.length > 0 && (
                <div className="mt-12 p-6 bg-gray-700 rounded-2xl border border-gray-600 shadow-lg">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <h4 className="font-bold text-lg mb-1 text-red-500">
                        Selected Seats
                      </h4>
                      <p className="text-white">
                        {selectedSeats.join(', ')} ({selectedSeats.length} seat
                        {selectedSeats.length > 1 ? 's' : ''})
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">
                        ৳{totalPrice}
                      </div>
                      <div className="text-sm text-gray-300">Total Amount</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleBooking}
                  disabled={!selectedTime || selectedSeats.length === 0}
                  className={`w-full px-8 py-4 font-bold text-lg transition-all duration-300 transform flex items-center justify-center gap-2 ${
                    selectedTime && selectedSeats.length > 0
                      ? 'btn-primary hover:scale-105'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Book Now - ৳{totalPrice}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Confirmation Modal */}
        {showBookingConfirm && (
          <div className="fixed inset-0 bg-black/80 modal-backdrop flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md w-full shadow-2xl">
              <h3 className="text-3xl font-bold mb-4 text-center text-red-500">
                Confirm Booking
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Movie:</span>
                  <span className="font-bold text-lg text-white">
                    {movieData.title}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-bold text-lg text-white">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Time:</span>
                  <span className="font-bold text-lg text-white">
                    {selectedTime?.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Seats:</span>
                  <span className="font-bold text-lg text-white">
                    {selectedSeats.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between text-2xl items-center mt-4 pt-4 border-t border-gray-700">
                  <span className="font-semibold text-red-500">Total:</span>
                  <span className="font-bold text-green-400">
                    ৳{totalPrice}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowBookingConfirm(false)
                    toast.error('Booking cancelled')
                  }}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors font-semibold text-white"
                >
                  Cancel Booking
                </button>

                <button
                  onClick={confirmBooking}
                  className="flex-1 py-3 btn-primary font-semibold"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Success Modal */}
        {bookingSuccess && bookingData && (
          <div className="fixed inset-0 bg-black/80 modal-backdrop flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-green-500 mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-300">
                  Your seats have been reserved successfully
                </p>
              </div>

              <div className="space-y-3 mb-6 p-4 bg-gray-700/50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking ID:</span>
                  <span className="font-mono text-white">
                    {bookingData._id?.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Movie:</span>
                  <span className="text-white">{bookingData.movieTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date & Time:</span>
                  <span className="text-white">
                    {new Date(bookingData.showDate).toLocaleDateString()}{' '}
                    {bookingData.showTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Seats:</span>
                  <span className="text-white">
                    {bookingData.selectedSeats.join(', ')}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-600">
                  <span className="text-red-500">Total:</span>
                  <span className="text-green-400">
                    ৳{bookingData.totalAmount}
                  </span>
                </div>
              </div>

              <div className="mb-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-center justify-center gap-2 text-yellow-400 font-semibold">
                  <Clock className="w-4 h-4" />
                  Complete payment within: {formatTime(paymentTimer)}
                </div>
                <p className="text-yellow-300 text-sm text-center mt-1">
                  Seats will be released if payment is not completed
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handlePayment(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors font-semibold text-white"
                >
                  Pay Later
                </button>

                <button
                  onClick={() => handlePayment(true)}
                  className="flex-1 py-3 btn-primary font-semibold"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}