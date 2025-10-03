// 'use client';

// import React, { useState } from 'react';
// import { FaChair } from 'react-icons/fa6';
// import { FaTimes } from 'react-icons/fa';
// import { FaRegSnowflake } from 'react-icons/fa';

// const CinemaSeatLayout = () => {
//   const [selectedSeats, setSelectedSeats] = useState([]);

//   const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];

//   const leftSection = { rows: rows.slice(0, -1), seats: 6 };
//   const centerSection = { rows: rows.slice(0, -1), seats: 14 };
//   const rightSection = { rows: rows.slice(0, -1), seats: 6 };

//   const soldSeats = [
//     'D-7', 'E-7', 'E-9', 'F-1', 'F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8',
//     'F-9', 'F-10', 'F-11', 'F-12', 'F-13', 'F-14', 'G-2', 'G-3', 'G-4', 'G-5',
//     'G-6', 'G-7', 'G-8', 'G-9', 'G-11', 'G-12', 'G-13', 'G-14', 'H-5', 'H-6',
//     'H-1', 'H-2', 'H-3', 'H-4', 'H-7', 'H-8', 'H-9', 'H-10', 'H-11', 'H-12',
//     'H-13', 'H-14', 'J-1', 'J-2', 'J-3', 'J-4', 'J-5', 'J-6', 'J-7', 'J-8',
//     'J-9', 'J-10', 'J-12', 'J-13', 'J-14', 'K-1', 'K-2', 'K-3', 'K-4', 'K-6',
//     'K-7', 'K-8', 'K-9', 'K-11', 'K-12', 'K-13', 'K-14', 'L-1', 'L-2', 'L-4',
//     'L-5', 'L-7', 'L-8', 'L-9', 'L-11', 'L-12', 'L-13'
//   ];

//   const blockedSeats = ['M-1', 'M-2', 'M-3', 'M-4', 'M-5', 'M-6'];

//   const handleSeatClick = (seatId) => {
//     if (soldSeats.includes(seatId) || blockedSeats.includes(seatId)) return;

//     setSelectedSeats(prev => 
//       prev.includes(seatId) 
//         ? prev.filter(id => id !== seatId) 
//         : [...prev, seatId]
//     );
//   };

//   const getSeatStatus = (seatId) => {
//     if (blockedSeats.includes(seatId)) return 'blocked';
//     if (soldSeats.includes(seatId)) return 'sold';
//     if (selectedSeats.includes(seatId)) return 'selected';
//     return 'available';
//   };

//   const renderSeat = (row, seatNum) => {
//     const seatId = `${row}-${seatNum}`;
//     const status = getSeatStatus(seatId);

//     return (
//       <button
//         key={seatId}
//         onClick={() => handleSeatClick(seatId)}
//         disabled={status === 'sold' || status === 'blocked'}
//         className={`w-8 h-8 flex items-center justify-center transition-all duration-200 ${
//           status === 'available' ? 'text-cyan-400 hover:text-cyan-300 cursor-pointer hover:scale-110' :
//           status === 'selected' ? 'text-yellow-500 scale-110' :
//           status === 'sold' ? 'text-white cursor-not-allowed' :
//           'text-red-600 cursor-not-allowed'
//         }`}
//       >
//         {status === 'blocked' ? (
//           <FaTimes className="w-5 h-5" />
//         ) : status === 'sold' ? (
//           <FaRegSnowflake className="w-5 h-5" />
//         ) : (
//           <FaChair className="w-5 h-5" />
//         )}
//       </button>
//     );
//   };

//   const renderSection = (config) => {
//     return (
//       <div className="flex flex-col gap-1">
//         {config.rows.map(row => (
//           <div key={row} className="flex gap-1 items-center justify-center">
//             {Array.from({ length: config.seats }, (_, i) => renderSeat(row, i + 1))}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold mb-2">Chainsaw Man - The Movie: Reze Arc</h1>
//           <p className="text-gray-400">BUKIT TINGGI | Cinema 1 | 28 Sep 2025, 12:50 AM</p>
//         </div>

//         <div className="flex justify-center gap-8 mb-8 flex-wrap">
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 flex items-center justify-center text-yellow-500">
//               <FaChair className="w-6 h-6" />
//             </div>
//             <span className="text-sm">SELECTED</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 flex items-center justify-center text-white">
//               <FaRegSnowflake className="w-5 h-5" />
//             </div>
//             <span className="text-sm">SOLD</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 flex items-center justify-center text-cyan-400">
//               <FaChair className="w-6 h-6" />
//             </div>
//             <span className="text-sm">SINGLE</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 flex items-center justify-center text-cyan-400">
//               <FaChair className="w-6 h-6" />
//             </div>
//             <span className="text-sm">TWIN</span>
//           </div>
//         </div>

//         <div className="mb-12">
//           <div className="relative h-20 flex items-center justify-center">
//             <div className="absolute w-full max-w-4xl">
//               <div className="h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"></div>
//               <div className="text-center mt-2 text-sm text-gray-400">SCREEN</div>
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-center gap-8 mb-8">
//           <div className="flex flex-col gap-1 justify-start pt-0">
//             {rows.slice(0, -1).map(row => (
//               <div key={`left-label-${row}`} className="h-8 flex items-center justify-center w-8 text-sm font-bold">
//                 {row}
//               </div>
//             ))}
//           </div>


//           {/* {renderSection(leftSection)} */}

//           {renderSection(centerSection)}

//           {/* {renderSection(rightSection)} */}

//           <div className="flex flex-col gap-1 justify-start pt-0">
//             {rows.slice(0, -1).map(row => (
//               <div key={`right-label-${row}`} className="h-8 flex items-center justify-center w-8 text-sm font-bold">
//                 {row}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-center gap-2 mb-8">
//           <div className="w-8 h-8 flex items-center justify-center text-sm font-bold">M</div>
//           {Array.from({ length: 6 }, (_, i) => renderSeat('M', i + 1))}
//           <div className="w-8"></div>
//           {renderSeat('M', 7)}
//           <div className="w-8 h-8 flex items-center justify-center text-sm font-bold">M</div>
//         </div>

//         {selectedSeats.length > 0 && (
//           <div className="bg-gray-800 rounded-lg p-4 text-center">
//             <p className="text-lg">
//               Selected Seats: <span className="text-yellow-500 font-bold">{selectedSeats.join(', ')}</span>
//             </p>
//             <p className="text-sm text-gray-400 mt-2">Total: {selectedSeats.length} seat(s)</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CinemaSeatLayout;









































































// 'use client';

// import React, { useState } from 'react';
// import { FaChair, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
// import { FaTimes } from 'react-icons/fa';
// import { FaRegSnowflake } from 'react-icons/fa';

// const CinemaSeatLayout = () => {
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [selectedDate, setSelectedDate] = useState('28 Sep 2025');
//   const [selectedTime, setSelectedTime] = useState('12:50 AM');
//   const [selectedLocation, setSelectedLocation] = useState('BUKIT TINGGI');

//   const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];

//   const leftSection = { rows: rows.slice(0, -1), seats: 6 };
//   const centerSection = { rows: rows.slice(0, -1), seats: 14 };
//   const rightSection = { rows: rows.slice(0, -1), seats: 6 };

//   const soldSeats = [
//     'D-7', 'E-7', 'E-9', 'F-1', 'F-2', 'F-3', 'F-4', 'F-5', 'F-6', 'F-7', 'F-8',
//     'F-9', 'F-10', 'F-11', 'F-12', 'F-13', 'F-14', 'G-2', 'G-3', 'G-4', 'G-5',
//     'G-6', 'G-7', 'G-8', 'G-9', 'G-11', 'G-12', 'G-13', 'G-14', 'H-5', 'H-6',
//     'H-1', 'H-2', 'H-3', 'H-4', 'H-7', 'H-8', 'H-9', 'H-10', 'H-11', 'H-12',
//     'H-13', 'H-14', 'J-1', 'J-2', 'J-3', 'J-4', 'J-5', 'J-6', 'J-7', 'J-8',
//     'J-9', 'J-10', 'J-12', 'J-13', 'J-14', 'K-1', 'K-2', 'K-3', 'K-4', 'K-6',
//     'K-7', 'K-8', 'K-9', 'K-11', 'K-12', 'K-13', 'K-14', 'L-1', 'L-2', 'L-4',
//     'L-5', 'L-7', 'L-8', 'L-9', 'L-11', 'L-12', 'L-13'
//   ];

//   const blockedSeats = ['M-1', 'M-2', 'M-3', 'M-4', 'M-5', 'M-6'];

//   // Sample data
//   const dates = ['27 Sep 2025', '28 Sep 2025', '29 Sep 2025', '30 Sep 2025'];
//   const showtimes = ['10:00 AM', '12:50 PM', '3:30 PM', '6:15 PM', '9:00 PM'];
//   const locations = ['BUKIT TINGGI', 'MID VALLEY', 'PAVILION', 'ONE UTAMA'];

//   const handleSeatClick = (seatId) => {
//     if (soldSeats.includes(seatId) || blockedSeats.includes(seatId)) return;

//     setSelectedSeats(prev => 
//       prev.includes(seatId) 
//         ? prev.filter(id => id !== seatId) 
//         : [...prev, seatId]
//     );
//   };

//   const getSeatStatus = (seatId) => {
//     if (blockedSeats.includes(seatId)) return 'blocked';
//     if (soldSeats.includes(seatId)) return 'sold';
//     if (selectedSeats.includes(seatId)) return 'selected';
//     return 'available';
//   };

//   const renderSeat = (row, seatNum) => {
//     const seatId = `${row}-${seatNum}`;
//     const status = getSeatStatus(seatId);

//     return (
//       <button
//         key={seatId}
//         onClick={() => handleSeatClick(seatId)}
//         disabled={status === 'sold' || status === 'blocked'}
//         className={`w-8 h-8 flex items-center justify-center transition-all duration-200 ${
//           status === 'available' ? 'text-cyan-400 hover:text-cyan-300 cursor-pointer hover:scale-110' :
//           status === 'selected' ? 'text-yellow-500 scale-110' :
//           status === 'sold' ? 'text-white cursor-not-allowed' :
//           'text-red-600 cursor-not-allowed'
//         }`}
//       >
//         {status === 'blocked' ? (
//           <FaTimes className="w-5 h-5" />
//         ) : status === 'sold' ? (
//           <FaRegSnowflake className="w-5 h-5" />
//         ) : (
//           <FaChair className="w-5 h-5" />
//         )}
//       </button>
//     );
//   };

//   const renderSection = (config) => {
//     return (
//       <div className="flex flex-col gap-1">
//         {config.rows.map(row => (
//           <div key={row} className="flex gap-1 items-center justify-center">
//             {Array.from({ length: config.seats }, (_, i) => renderSeat(row, i + 1))}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Movie Info Banner */}
//         <div className="bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 rounded-2xl p-6 mb-8 shadow-2xl">
//           <div className="flex flex-col md:flex-row items-center justify-between">
//             <div className="flex-1">
//               <h1 className="text-3xl md:text-4xl font-bold mb-2">Chainsaw Man - The Movie: Reze Arc</h1>
//               <div className="flex flex-wrap items-center gap-3 text-gray-300">
//                 <span>Action</span>
//                 <span>•</span>
//                 <span>Animation</span>
//                 <span>•</span>
//                 <span>Comedy</span>
//                 <span>•</span>
//                 <span>1h 40m</span>
//                 <span>•</span>
//                 <span>Japanese</span>
//               </div>
//             </div>
//             <div className="mt-4 md:mt-0">
//               <div className="bg-black bg-opacity-50 rounded-lg px-4 py-2 text-center">
//                 <p className="text-sm text-gray-400">Now Showing</p>
//                 <p className="text-lg font-bold text-yellow-400">★ 4.8/5</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Selection Controls */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//           {/* Date Selection */}
//           <div className="bg-gray-800 rounded-xl p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <FaCalendarAlt className="text-yellow-500" />
//               <h3 className="font-bold text-lg">Select Date</h3>
//             </div>
//             <div className="flex gap-2 overflow-x-auto pb-2">
//               {dates.map(date => (
//                 <button
//                   key={date}
//                   onClick={() => setSelectedDate(date)}
//                   className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all ${
//                     selectedDate === date
//                       ? 'bg-yellow-500 text-black font-bold'
//                       : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                   }`}
//                 >
//                   {date}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Showtime Selection */}
//           <div className="bg-gray-800 rounded-xl p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <FaClock className="text-green-500" />
//               <h3 className="font-bold text-lg">Select Showtime</h3>
//             </div>
//             <div className="flex gap-2 flex-wrap">
//               {showtimes.map(time => (
//                 <button
//                   key={time}
//                   onClick={() => setSelectedTime(time)}
//                   className={`px-3 py-2 rounded-lg transition-all ${
//                     selectedTime === time
//                       ? 'bg-green-500 text-black font-bold'
//                       : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                   }`}
//                 >
//                   {time}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Location Selection */}
//           <div className="bg-gray-800 rounded-xl p-4">
//             <div className="flex items-center gap-2 mb-3">
//               <FaMapMarkerAlt className="text-red-500" />
//               <h3 className="font-bold text-lg">Select Location</h3>
//             </div>
//             <div className="flex gap-2 flex-wrap">
//               {locations.map(location => (
//                 <button
//                   key={location}
//                   onClick={() => setSelectedLocation(location)}
//                   className={`px-3 py-2 rounded-lg transition-all ${
//                     selectedLocation === location
//                       ? 'bg-red-500 text-black font-bold'
//                       : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                   }`}
//                 >
//                   {location}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Current Selection Summary */}
//         <div className="bg-gray-800 rounded-xl p-4 mb-8 text-center">
//           <div className="flex flex-wrap justify-center items-center gap-4 text-sm md:text-base">
//             <div className="flex items-center gap-2">
//               <FaMapMarkerAlt className="text-red-400" />
//               <span>{selectedLocation}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaCalendarAlt className="text-yellow-400" />
//               <span>{selectedDate}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaClock className="text-green-400" />
//               <span>{selectedTime}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="text-cyan-400">Cinema 1</span>
//             </div>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="flex justify-center gap-8 mb-8 flex-wrap">
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 flex items-center justify-center text-yellow-500">
//               <FaChair className="w-6 h-6" />
//             </div>
//             <span className="text-sm">SELECTED</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 flex items-center justify-center text-white">
//               <FaRegSnowflake className="w-5 h-5" />
//             </div>
//             <span className="text-sm">SOLD</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 flex items-center justify-center text-cyan-400">
//               <FaChair className="w-6 h-6" />
//             </div>
//             <span className="text-sm">AVAILABLE</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-6 h-6 flex items-center justify-center text-red-600">
//               <FaTimes className="w-5 h-5" />
//             </div>
//             <span className="text-sm">BLOCKED</span>
//           </div>
//         </div>

//         {/* Screen */}
//         <div className="mb-12">
//           <div className="relative h-20 flex items-center justify-center">
//             <div className="absolute w-full max-w-4xl">
//               <div className="h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full"></div>
//               <div className="text-center mt-2 text-sm text-gray-400">SCREEN</div>
//             </div>
//           </div>
//         </div>

//         {/* Seating Layout */}
//         <div className="flex justify-center gap-8 mb-8">
//           <div className="flex flex-col gap-1 justify-start pt-0">
//             {rows.slice(0, -1).map(row => (
//               <div key={`left-label-${row}`} className="h-8 flex items-center justify-center w-8 text-sm font-bold">
//                 {row}
//               </div>
//             ))}
//           </div>

//           {renderSection(centerSection)}

//           <div className="flex flex-col gap-1 justify-start pt-0">
//             {rows.slice(0, -1).map(row => (
//               <div key={`right-label-${row}`} className="h-8 flex items-center justify-center w-8 text-sm font-bold">
//                 {row}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Row M - Special Layout */}
//         <div className="flex justify-center gap-2 mb-8">
//           <div className="w-8 h-8 flex items-center justify-center text-sm font-bold">M</div>
//           {Array.from({ length: 6 }, (_, i) => renderSeat('M', i + 1))}
//           <div className="w-8"></div>
//           {renderSeat('M', 7)}
//           <div className="w-8 h-8 flex items-center justify-center text-sm font-bold">M</div>
//         </div>

//         {/* Selected Seats Info */}
//         {selectedSeats.length > 0 && (
//           <div className="bg-gray-800 rounded-lg p-6 text-center">
//             <p className="text-lg mb-2">
//               Selected Seats: <span className="text-yellow-500 font-bold">{selectedSeats.join(', ')}</span>
//             </p>
//             <p className="text-sm text-gray-400 mb-4">Total: {selectedSeats.length} seat(s)</p>
//             <button className="bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 transition-all">
//               Proceed to Payment - ${selectedSeats.length * 15}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CinemaSeatLayout;
















// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useParams, useSearchParams, useRouter } from 'next/navigation';
// import axiosSecure from '@/app/api/axiosHook/useAxiosSecure';
// import Image from 'next/image';
// import { useAuth } from '@/app/context/AuthContext';
// import LoadingSpinner from '@/app/hooks/LoadingSpiner';

// // Components
// import { toast } from './components/Toast';
// import { ArrowLeft, Calendar, Film, MapPin, Ticket, CreditCard } from './components/Icons';
// import DateSelector from './components/DateSelector';
// import Showtimes from './components/Showtimes';
// import SeatSections from './components/SeatSections';
// import BookingSummary from './components/BookingSummary';
// import BookingModal from './components/BookingModal';
// import SuccessModal from './components/SuccessModal';

// // Utils
// import { seatSections, reservedSeats } from './utils/seatData';
// import { showtimes } from './utils/showtimes';
// import { getSeatSection, formatTime, getDateOptions } from './utils/helpers';
// import { socket } from './utils/socket';

// export default function MovieSeatBooking() {
//   const params = useParams();
//   const router = useRouter();
//   const id = params.id;
//   const { user } = useAuth();

//   // States
//   const [movieData, setMovieData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const [hoveredSeat, setHoveredSeat] = useState(null);
//   const [showBookingConfirm, setShowBookingConfirm] = useState(false);
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [bookingData, setBookingData] = useState(null);
//   const [paymentTimer, setPaymentTimer] = useState(600); // 10 min
//   const [selectedDivision, setSelectedDivision] = useState('');
//   const [selectedDistrict, setSelectedDistrict] = useState('');
//   const [reservedSeatsState, setReservedSeatsState] = useState([]);





// // live seat update এর জন্য listener যোগ

//   useEffect(() => {
//   socket.on("seatBooked", (bookedSeats) => {
//     console.log("Seats booked:", bookedSeats);
//     // যদি reservedSeats update করতে চাও
//     // setReservedSeats(bookedSeats);
//   });

//   return () => {
//     socket.off("seatBooked");
//   };
// }, []);


//   // Load movie data
//   useEffect(() => {
//     const loadMovieData = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos`
//         );

//         if (res.ok) {
//           const movie = await res.json();
//           setMovieData(movie);
//         } else throw new Error('Failed to fetch movie data');
//       } catch (error) {
//         console.error(error);
//         toast.error('Error loading movie data. Redirecting...');
//         setTimeout(() => router.push(`/movies/${id}`), 2000);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) loadMovieData();
//   }, [id, router]);

//   // Payment timer countdown
//   useEffect(() => {
//     let interval;
//     if (bookingSuccess && paymentTimer > 0) {
//       interval = setInterval(() => setPaymentTimer((prev) => prev - 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [bookingSuccess, paymentTimer]);

//   // Total price
//   const totalPrice = selectedSeats.reduce((total, seat) => {
//     const section = getSeatSection(seat);
//     return total + (section ? section.price : 0);
//   }, 0);

//   // Handle seat click
//   const handleSeatClick = (seat) => {
//     if (reservedSeats.includes(seat)) {
//       toast.error('This seat is already booked!');
//       return;
//     }
//     if (selectedSeats.includes(seat)) {
//       setSelectedSeats(selectedSeats.filter((s) => s !== seat));
//       toast.success(`Seat ${seat} deselected`);
//     } else {
//       if (selectedSeats.length < 8) {
//         setSelectedSeats([...selectedSeats, seat]);
//         toast.success(`Seat ${seat} selected`);
//       } else toast.error('Maximum 8 seats can be selected!');
//     }
//   };


// //   const [reservedSeatsState, setReservedSeatsState] = useState(reservedSeats);
// // useEffect(() => {
// //   socket.on("seatBooked", (bookedSeats) => {
// //     setReservedSeatsState(bookedSeats);
// //   });
// //   return () => socket.off("seatBooked");
// // }, []);

// useEffect(() => {
//   const fetchReservedSeats = async () => {
//     if (!id || !selectedTime) return;
//     try {
//       const res = await axiosSecure.get('/api/ticket/reserved-seats', {
//         params: { movieId: id, showtime: selectedTime.time }
//       });
//       setReservedSeatsState(res.data.reservedSeats || []);
//     } catch (err) {
//       console.error('Error fetching reserved seats:', err);
//     }
//   };

//   fetchReservedSeats();
// }, [id, selectedTime]);

// // Socket.io listener update
// useEffect(() => {
//   socket.on("reservedSeatsUpdate", (data) => {
//     setReservedSeatsState(data.reservedSeats);
//   });
//   return () => socket.off("reservedSeatsUpdate");
// }, []);


//   // Handle booking
//   const handleBooking = () => {
//     if (!selectedTime) return toast.error('Please select a showtime first!');
//     if (selectedSeats.length === 0) return toast.error('Please select at least one seat!');
//     setShowBookingConfirm(true);
//   };

//   // Confirm booking
//   const confirmBooking = async () => {
//     try {
//       // socket.emit("bookSeats", selectedSeats);
//       setShowBookingConfirm(false);
//       const bookingPayload = {
//         movieId: id,
//         movieTitle: movieData.title,
//         theaterName: 'Star Cineplex',
//         showId: selectedTime?.id,
//         showDate: selectedDate,
//         showTime: selectedTime?.time,
//         screen: 'Screen 1',
//         selectedSeats,
//         totalAmount: totalPrice,
//         userId: user?.id,
//         userName: user?.name || 'User',
//         userEmail: user?.email,
//       };

//       const response = await axiosSecure.post('/api/ticket/booking', bookingPayload);
//       setBookingData(response.data.booking);
//       setBookingSuccess(true);
//       toast.success('Booking confirmed successfully!');
//       setTimeout(() => {
//         setSelectedSeats([]);
//         setSelectedTime(null);
//       }, 2000);
//     } catch (error) {
//       console.error('Booking error:', error);
//       toast.error(error.response?.data?.error || 'Server error while saving booking');
//     }
//   };

//   // Handle payment
//   const handlePayment = (payNow = false) => {
//     if (payNow && bookingData) router.push(`/payment/${bookingData._id}`);
//     else {
//       setBookingSuccess(false);
//       setBookingData(null);
//       setPaymentTimer(600);
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (!movieData)
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="text-center">
//           <div className="text-red-500 text-xl mb-4">❌ Movie data not found!</div>
//           <button
//             onClick={() => router.push('/movies')}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Go Back to Movies
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen text-white p-4 font-sans pt-16">
//       <div className="max-w-7xl mx-auto py-8">
//         {/* Back Button */}
//         <button
//           onClick={() => router.push(`/movies/${id}`)}
//           className="mb-6 px-4 py-2 bg-gray-700/80 text-white rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center gap-2"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Movie Details
//         </button>

//         {/* Header */}
//         <div className="text-center mb-10">
//           <h1 className="text-4xl md:text-6xl font-extrabold text-red-500 mb-2">
//             BOOK YOUR SEATS
//           </h1>
//           <p className="text-gray-300 text-lg">Choose your perfect seats for {movieData.title}</p>
          
//           {/* Live Booking Info Section */}
// {/* Live Booking Info Section */}
// {/* Live Booking Info Section */}
// <div className="mt-6 w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-2xl p-6 border border-red-500/30 shadow-2xl">
//   <div className="flex items-center justify-center gap-2 mb-4">
//     <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
//     <h3 className="text-xl font-bold text-red-500">Live Booking Status</h3>
//   </div>
  
//   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
//     {/* Date */}
//     <div className={`rounded-lg p-4 border transition-all duration-300 ${
//       selectedDate 
//         ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/20' 
//         : 'bg-gray-800/50 border-gray-700/50'
//     }`}>
//       <Calendar className={`w-6 h-6 mx-auto mb-2 ${selectedDate ? 'text-red-400' : 'text-red-500'}`} />
//       <p className="text-xs text-gray-400 mb-1">Date</p>
//       <p className={`font-bold text-sm ${selectedDate ? 'text-red-400' : 'text-white'}`}>
//         {selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not Selected'}
//       </p>
//     </div>
    
//     {/* Showtime */}
//     <div className={`rounded-lg p-4 border transition-all duration-300 ${
//       selectedTime 
//         ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/20' 
//         : 'bg-gray-800/50 border-gray-700/50'
//     }`}>
//       <Film className={`w-6 h-6 mx-auto mb-2 ${selectedTime ? 'text-red-400' : 'text-red-500'}`} />
//       <p className="text-xs text-gray-400 mb-1">Showtime</p>
//       <p className={`font-bold text-sm ${selectedTime ? 'text-red-400' : 'text-white'}`}>
//         {selectedTime ? selectedTime.time : 'Not Selected'}
//       </p>
//     </div>
    
//     {/* Seats Count */}
//     <div className={`rounded-lg p-4 border transition-all duration-300 ${
//       selectedSeats.length > 0 
//         ? 'bg-red-500/10 border-red-500/50 shadow-lg shadow-red-500/20' 
//         : 'bg-gray-800/50 border-gray-700/50'
//     }`}>
//       <Ticket className={`w-6 h-6 mx-auto mb-2 ${selectedSeats.length > 0 ? 'text-red-400' : 'text-red-500'}`} />
//       <p className="text-xs text-gray-400 mb-1">Seats</p>
//       <p className={`font-bold text-sm ${selectedSeats.length > 0 ? 'text-red-400' : 'text-white'}`}>
//         {selectedSeats.length > 0 ? `${selectedSeats.length} Selected` : 'No Seats'}
//       </p>
//     </div>
    
//     {/* Total Price */}
//     <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-green-500/50 transition-colors">
//       <CreditCard className="w-6 h-6 text-red-500 mx-auto mb-2" />
//       <p className="text-xs text-gray-400 mb-1">Total</p>
//       <p className="font-bold text-green-400 text-lg">
//         ৳{totalPrice}
//       </p>
//     </div>
//   </div>
  
//   {/* Selected Seats Display */}
//   {selectedSeats.length > 0 && (
//     <div className="mt-4 pt-4 border-t border-gray-700/50">
//       <p className="text-sm text-gray-400 mb-2 text-center">Selected Seats:</p>
//       <div className="flex flex-wrap gap-2 justify-center">
//         {selectedSeats.map((seat) => (
//           <span 
//             key={seat} 
//             className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-semibold border border-red-500/40 shadow-lg shadow-red-500/20"
//           >
//             {seat}
//           </span>
//         ))}
//       </div>
//     </div>
//   )}
// </div>
//         </div>



//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Left Panel */}
//           <div className="lg:col-span-1 space-y-6 lg:max-h-[60rem] lg:overflow-y-auto">
//             {/* Movie Card */}
//             <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
//               {movieData.backdrop_path && (
//                 <div className="relative h-32 rounded-lg overflow-hidden mb-4">
//                   <Image
//                     width={500}
//                     height={200}
//                     src={`https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`}
//                     alt={movieData.title}
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-black/50"></div>
//                 </div>
//               )}
//               <div className="flex items-center gap-4 mb-4">
//                 <Film className="w-12 h-12 text-red-500" />
//                 <div>
//                   <h3 className="font-bold text-2xl text-white">{movieData.title}</h3>
//                   <p className="text-sm text-gray-400">
//                     {movieData.genres?.map((g) => g.name).join(', ')} |{' '}
//                     {movieData.runtime && ` ${movieData.runtime}m`} | ⭐{' '}
//                     {movieData.vote_average?.toFixed(1)}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
//                 <div className="flex items-center gap-1">
//                   <MapPin className="w-4 h-4 text-red-500" />
//                   <span>Star Cineplex</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Calendar className="w-4 h-4 text-red-500" />
//                   <span>Today, {new Date().toLocaleDateString()}</span>
//                 </div>
//               </div>
//             </div>

//             {/* location selector
//             <LocationSelector
//   selectedDivision={selectedDivision}
//   setSelectedDivision={setSelectedDivision}
//   selectedDistrict={selectedDistrict}
//   setSelectedDistrict={setSelectedDistrict}
// /> */}


//             {/* Date & Showtimes */}
//             <DateSelector
//               dateOptions={getDateOptions()}
//               selectedDate={selectedDate}
//               setSelectedDate={setSelectedDate}
//             />
//             <Showtimes
//               showtimes={showtimes}
//               selectedTime={selectedTime}
//               setSelectedTime={setSelectedTime}
//               toast={toast}
//             />

//             {/* Legend */}
//             <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
//               <h3 className="font-bold mb-4 text-red-500 flex items-center gap-2">
//                 <Ticket className="w-5 h-5" /> Seat Types
//               </h3>
//               <div className="space-y-3">
//                 {seatSections.map((section) => (
//                   <div key={section.id} className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${section.color}`}></div>
//                       <span className="text-sm">{section.name}</span>
//                     </div>
//                     <span className="text-sm font-bold">৳{section.price}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse"></div>
//                   <span className="text-sm">Booked</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 rounded-full bg-green-500"></div>
//                   <span className="text-sm">Selected</span>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <div className="w-4 h-4 rounded-full bg-gray-600"></div>
//                   <span className="text-sm">Available</span>
//                 </div>
//               </div>
//             </div>
//           </div>


//           {/* Right Panel */}
//           <div className="lg:col-span-2">
//             <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700/50 shadow-xl">
//               {/* Screen */}
//               <div className="text-center mb-12">
//                 <div className="relative mx-auto max-w-2xl">
//                   <div className="h-4 bg-gray-700 rounded-b-full shadow-[0_15px_30px_-5px_rgba(204,32,39,0.3)]"></div>
//                   <div className="absolute inset-x-0 bottom-0 h-10 bg-gray-900 rounded-b-full"></div>
//                 </div>
//                 <p className="text-gray-400 text-sm mt-3 font-medium tracking-widest">S C R E E N</p>
//               </div>

//               {/* Seats */}
//               <SeatSections
//                 seatSections={seatSections}
//                 selectedSeats={selectedSeats}
//                 // reservedSeats={reservedSeats}
//                   reservedSeats={reservedSeatsState}
//                 hoveredSeat={hoveredSeat}
//                 setHoveredSeat={setHoveredSeat}
//                 handleSeatClick={handleSeatClick}
//                 getSeatSection={getSeatSection}
//               />

//               {/* Summary */}
//               <BookingSummary selectedSeats={selectedSeats} totalPrice={totalPrice} />

//               {/* Book Now */}
//               <div className="mt-8 text-center">
//                 <button
//                   onClick={handleBooking}
//                   disabled={!selectedTime || selectedSeats.length === 0}
//                   className={`w-full px-8 py-4 font-bold text-lg transition-all duration-300 transform flex items-center justify-center gap-2 ${
//                     selectedTime && selectedSeats.length > 0
//                       ? 'btn-primary hover:scale-105'
//                       : 'bg-gray-700 text-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   <CreditCard className="w-5 h-5" />
//                   Book Now - ৳{totalPrice}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Modals */}
//         {showBookingConfirm && (
//           <BookingModal
//             movieData={movieData}
//             selectedDate={selectedDate}
//             selectedTime={selectedTime}
//             selectedSeats={selectedSeats}
//             totalPrice={totalPrice}
//             onClose={() => setShowBookingConfirm(false)}
//             onConfirm={confirmBooking}
//           />
//         )}
//         {bookingSuccess && bookingData && (
//           <SuccessModal
//             bookingData={bookingData}
//             paymentTimer={paymentTimer}
//             formatTime={formatTime}
//             onPayNow={() => handlePayment(true)}
//             onPayLater={() => handlePayment(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
