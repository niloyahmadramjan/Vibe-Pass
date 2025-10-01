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