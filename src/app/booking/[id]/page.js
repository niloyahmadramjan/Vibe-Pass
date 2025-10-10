'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure'
import Image from 'next/image'
import { useAuth } from '@/app/context/AuthContext'
import LoadingSpinner from '@/app/hooks/LoadingSpiner'
import { socket } from './utils/socket'
import { useSearchParams } from 'next/navigation'

// Components
import { toast } from './components/Toast'
import {
  ArrowLeft,
  Calendar,
  Film,
  MapPin,
  Ticket,
  CreditCard,
} from './components/Icons'
import DateSelector from './components/DateSelector'
import Showtimes from './components/Showtimes'
import SeatSections from './components/SeatSections'
import BookingSummary from './components/BookingSummary'
import BookingModal from './components/BookingModal'
import SuccessModal from './components/SuccessModal'

// Utils
import { seatSections } from './utils/seatData'
import { showtimes } from './utils/showtimes'
import { getSeatSection, formatTime, getDateOptions } from './utils/helpers'

export default function MovieSeatBooking() {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  const { user } = useAuth()
  const searchParams = useSearchParams()
console.log(id)
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
  const [paymentTimer, setPaymentTimer] = useState(600)
  const [reservedSeatsState, setReservedSeatsState] = useState([])
  const [availableShowtimes, setAvailableShowtimes] = useState([])
  const [loadingShowtimes, setLoadingShowtimes] = useState(false)

  const theaterName = searchParams.get('cinema') || 'Default Theater'
  const IMG_URL = 'https://image.tmdb.org/t/p/w500'

  // Load movie data from TMDB API
  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);

        const res = await axiosSecure.get(`/api/movies/${id}`);

        if (res.status === 200) {
          setMovieData(res.data); 
        } else {
          throw new Error("Failed to fetch movie data");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error loading movie data. Redirecting...");
        setTimeout(() => router.push(`/movies/${id}`), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadMovieData();
  }, [id, router]);


  // ✅ Fetch reserved seats when showtime changes
  // ✅ CORRECT VERSION
  useEffect(() => {
    const fetchReservedSeats = async () => {
      if (!id || !selectedTime || !selectedDate) return

      try {
        const res = await axiosSecure.get('/api/ticket/reserved-seats', {
          params: {
            movieId: id,
            showTime: selectedTime.time, // ✅ Changed from 'showtime'
            showDate: selectedDate,
          },
        })
        setReservedSeatsState(res.data.reservedSeats || [])
      } catch (err) {
        console.error('Error fetching reserved seats:', err)
      }
    }

    fetchReservedSeats()
  }, [id, selectedTime, selectedDate])

  // ✅ Fetch real showtimes when date changes
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!id || !selectedDate) return

      try {
        setLoadingShowtimes(true)
        const res = await axiosSecure.get('/api/showtime', {
          params: { movieId: id, showDate: selectedDate },
        })

        setAvailableShowtimes(res.data.showtimes || [])
        setSelectedTime(null)
        setSelectedSeats([])
      } catch (err) {
        console.error(err)
        setAvailableShowtimes([])
      } finally {
        setLoadingShowtimes(false)
      }
    }

    fetchShowtimes()
  }, [id, selectedDate])

  // ✅ Socket.io Real-time Updates
  useEffect(() => {
    if (!id || !selectedTime) return

    const room = `${id}-${selectedDate}-${selectedTime.time}`

    // Join room for this movie + showtime
    socket.emit('joinRoom', {
      movieId: id,
      showtime: selectedTime.time,
      showDate: selectedDate,
    })
    // console.log(`🔵 Joined room: ${room}`)

    // Listen for seat updates
    socket.on('reservedSeatsUpdate', (data) => {
      // console.log('🔴 Reserved seats updated:', data.reservedSeats)
      setReservedSeatsState(data.reservedSeats)
    })

    return () => {
      socket.off('reservedSeatsUpdate')
    }
  }, [id, selectedTime, selectedDate])

  // ✅ Payment timer
  useEffect(() => {
    let interval
    if (bookingSuccess && paymentTimer > 0) {
      interval = setInterval(() => setPaymentTimer((prev) => prev - 1), 1000)
    }
    return () => clearInterval(interval)
  }, [bookingSuccess, paymentTimer])

  // Total price
  const totalPrice = selectedSeats.reduce((total, seat) => {
    const section = getSeatSection(seat)
    return total + (section ? section.price : 0)
  }, 0)

  // ✅ Handle seat click
  const handleSeatClick = (seat) => {
    if (reservedSeatsState.includes(seat)) {
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
      } else toast.error('Maximum 8 seats can be selected!')
    }
  }

  // ✅ Handle booking
  const handleBooking = () => {
    if (!selectedTime) return toast.error('Please select a showtime first!')
    if (selectedSeats.length === 0)
      return toast.error('Please select at least one seat!')
    setShowBookingConfirm(true)
  }

  // ✅ Confirm booking
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

      const response = await axiosSecure.post(
        '/api/ticket/booking',
        bookingPayload
      )
      setBookingData(response.data.booking)
      setBookingSuccess(true)
      toast.success('Booking confirmed successfully!')

      setTimeout(() => {
        setSelectedSeats([])
      }, 2000)
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(
        error.response?.data?.error || 'Server error while saving booking'
      )
    }
  }

  // ✅ Handle payment
  const handlePayment = (payNow = false) => {
    if (payNow && bookingData) router.push(`/payment/${bookingData._id}`)
    else {
      setBookingSuccess(false)
      setBookingData(null)
      setPaymentTimer(600)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!movieData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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

          {/* Live Booking Status */}
          <div className="mt-6 w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-6 border border-red-500/30 shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-bold text-red-500">
                Live Booking Status
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {/* Date */}
              <div
                className={`rounded-lg p-4 border transition-all ${
                  selectedDate
                    ? 'bg-red-500/10 border-red-500/50'
                    : 'bg-gray-800/50 border-gray-700/50'
                }`}
              >
                <Calendar
                  className={`w-6 h-6 mx-auto mb-2 ${
                    selectedDate ? 'text-red-400' : 'text-red-500'
                  }`}
                />
                <p className="text-xs text-gray-400 mb-1">Date</p>
                <p
                  className={`font-bold text-sm ${
                    selectedDate ? 'text-red-400' : 'text-white'
                  }`}
                >
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString('en-GB')
                    : 'Not Selected'}
                </p>
              </div>

              {/* Showtime */}
              <div
                className={`rounded-lg p-4 border transition-all ${
                  selectedTime
                    ? 'bg-red-500/10 border-red-500/50'
                    : 'bg-gray-800/50 border-gray-700/50'
                }`}
              >
                <Film
                  className={`w-6 h-6 mx-auto mb-2 ${
                    selectedTime ? 'text-red-400' : 'text-red-500'
                  }`}
                />
                <p className="text-xs text-gray-400 mb-1">Showtime</p>
                <p
                  className={`font-bold text-sm ${
                    selectedTime ? 'text-red-400' : 'text-white'
                  }`}
                >
                  {selectedTime ? selectedTime.time : 'Not Selected'}
                </p>
              </div>

              {/* Seats */}
              <div
                className={`rounded-lg p-4 border transition-all ${
                  selectedSeats.length > 0
                    ? 'bg-red-500/10 border-red-500/50'
                    : 'bg-gray-800/50 border-gray-700/50'
                }`}
              >
                <Ticket
                  className={`w-6 h-6 mx-auto mb-2 ${
                    selectedSeats.length > 0 ? 'text-red-400' : 'text-red-500'
                  }`}
                />
                <p className="text-xs text-gray-400 mb-1">Seats</p>
                <p
                  className={`font-bold text-sm ${
                    selectedSeats.length > 0 ? 'text-red-400' : 'text-white'
                  }`}
                >
                  {selectedSeats.length > 0
                    ? `${selectedSeats.length} Selected`
                    : 'No Seats'}
                </p>
              </div>

              {/* Price */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <CreditCard className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Total</p>
                <p className="font-bold text-green-400 text-lg">
                  ৳{totalPrice}
                </p>
              </div>
            </div>

            {/* Selected Seats */}
            {selectedSeats.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <p className="text-sm text-gray-400 mb-2 text-center">
                  Selected Seats:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold border border-red-500/40"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6 lg:max-h-[60rem] lg:overflow-y-auto">
            {/* Movie Card */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              {movieData.backdrop_path && (
                <div className="relative h-32 rounded-lg overflow-hidden mb-4">
                  <Image
                    width={500}
                    height={200}
                    src={
                      typeof movieData.poster_path === "string" && movieData.poster_path.startsWith("http")
                        ? movieData.poster_path // full URL (like i.ibb.co)
                        : IMG_URL + movieData.poster_path // TMDB partial path
                    }
                    alt={movieData.title || "Movie Backdrop"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <Film className="w-12 h-12 text-red-500" />
                <div>
                  <h3 className="font-bold text-2xl text-white">
                    {movieData.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {movieData.genres?.map((g) => g.name).join(', ')} |{' '}
                    {movieData.runtime}m | ⭐{' '}
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
            {/* <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
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
            </div> */}

            {/* Date & Showtimes */}
            <DateSelector
              dateOptions={getDateOptions()}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            <Showtimes
              showtimes={availableShowtimes} // ✅ Changed from static
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              selectedDate={selectedDate}
              loading={loadingShowtimes} // ✅ Added
              toast={toast}
            />

            {/* Legend */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
              <h3 className="font-bold mb-4 text-red-500 flex items-center gap-2">
                <Ticket className="w-5 h-5" /> Seat Types
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

          {/* Right Panel - Seat Layout */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700/50 shadow-xl">
              {/* Screen */}
              <div className="text-center mb-12">
                <div className="relative mx-auto max-w-2xl">
                  <div className="h-4 bg-gray-700 rounded-b-full shadow-[0_15px_30px_-5px_rgba(204,32,39,0.3)]"></div>
                </div>
                <p className="text-gray-400 text-sm mt-3 font-medium tracking-widest">
                  S C R E E N
                </p>
              </div>

              {/* Seats */}
              <SeatSections
                seatSections={seatSections}
                selectedSeats={selectedSeats}
                reservedSeats={reservedSeatsState}
                hoveredSeat={hoveredSeat}
                setHoveredSeat={setHoveredSeat}
                handleSeatClick={handleSeatClick}
                getSeatSection={getSeatSection}
              />

              {/* Summary */}
              <BookingSummary
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
              />

              {/* Book Now Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleBooking}
                  disabled={!selectedTime || selectedSeats.length === 0}
                  className={`w-full px-8 py-4 font-bold text-lg transition-all duration-300 transform flex items-center justify-center gap-2 rounded-xl ${
                    selectedTime && selectedSeats.length > 0
                      ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 shadow-lg hover:shadow-red-500/50 hover:scale-105'
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

        {/* Modals */}
        {showBookingConfirm && (
          <BookingModal
            movieData={movieData}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
            onClose={() => setShowBookingConfirm(false)}
            onConfirm={confirmBooking}
          />
        )}
        {bookingSuccess && bookingData && (
          <SuccessModal
            bookingData={bookingData}
            paymentTimer={paymentTimer}
            formatTime={formatTime}
            onPayNow={() => handlePayment(true)}
            onPayLater={() => handlePayment(false)}
          />
        )}
      </div>
    </div>
  )
}
