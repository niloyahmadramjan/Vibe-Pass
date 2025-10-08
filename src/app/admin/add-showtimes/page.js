// "use client";
// import { useEffect, useState } from "react";
// import axiosSecure from "@/app/api/axiosHook/useAxiosSecure";
// import { HiDotsHorizontal } from "react-icons/hi";
// import { FiEdit2, FiTrash2, FiCalendar, FiClock, FiDollarSign, FiMapPin, FiPlus } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import toast from "react-hot-toast";
// import AdminLoading from "../components/AdminLoading";
// import Image from "next/image";
// import AddShowtimeModal from "../components/AddShowtimeModal";

// export default function ShowtimesPage() {
//   const [showtimes, setShowtimes] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isAddModalOpen, setAddModalOpen] = useState(false); // Add this state
//   const [editData, setEditData] = useState({
//     date: "",
//     time: "",
//     price: "",
//     hall: "",
//   });
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Load Showtimes
//   useEffect(() => {
//     fetchShowtimes();
//   }, []);

//   const fetchShowtimes = async () => {
//     try {
//       setLoading(true);
//       const res = await axiosSecure.get("/api/showtime/all");
//       setShowtimes(res.data);
//     } catch (error) {
//       toast.error("Failed to load showtimes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Open update modal
//   const openUpdate = (item) => {
//     setSelected(item);
//     setEditData({
//       date: item.date,
//       time: item.time,
//       price: item.price,
//       hall: item.hall,
//     });
//     setModalOpen(true);
//     setOpenMenuId(null);
//   };

//   //  Update Showtime
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await axiosSecure.put(`/api/showtime/${selected._id}`, editData);
//       setModalOpen(false);
//       fetchShowtimes();
//       toast.success(" Showtime updated successfully!");
//     } catch (error) {
//       toast.error(" Failed to update showtime!");
//     }
//   };

//   //  Delete Showtime
//   const handleDelete = async (id) => {
//     if (!confirm("Are you sure you want to delete this showtime?")) return;

//     try {
//       await axiosSecure.delete(`/api/showtime/${id}`);
//       fetchShowtimes();
//       toast.success(" Showtime deleted successfully!");
//     } catch (error) {
//       toast.error("Failed to delete showtime!");
//     }
//   };

//   // Handle Add Showtime Success
//   const handleAddSuccess = () => {
//     fetchShowtimes(); // Refresh the list
//   };

//   // Format date to readable format
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return <AdminLoading />
//   }

//   return (
//     <div className="p-6 w-full mx-auto bg-gradient-to-br from-[#0c0c14] via-[#0f1018] to-[#1e1233]">
//       {/* Header with Add Button */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
//         <div className="mb-4 lg:mb-0">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4">Showtimes Management</h1>
//           <p className="text-gray-400">Manage all movie showtimes and schedules</p>
//         </div>
//         <button
//           onClick={() => setAddModalOpen(true)}
//           className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25"
//         >
//           <FiPlus size={20} />
//           Add Showtime
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//         <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-4 rounded-xl border border-purple-500/20">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Total Showtimes</p>
//               <p className="text-2xl font-bold text-white">{showtimes.length}</p>
//             </div>
//             <div className="p-3 bg-purple-600/20 rounded-lg">
//               <FiCalendar className="text-purple-400 text-xl" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 p-4 rounded-xl border border-blue-500/20">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Active Today</p>
//               <p className="text-2xl font-bold text-white">
//                 {showtimes.filter(st => new Date(st.date).toDateString() === new Date().toDateString()).length}
//               </p>
//             </div>
//             <div className="p-3 bg-blue-600/20 rounded-lg">
//               <FiClock className="text-blue-400 text-xl" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 p-4 rounded-xl border border-green-500/20">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Halls Used</p>
//               <p className="text-2xl font-bold text-white">
//                 {[...new Set(showtimes.map(st => st.hall))].length}
//               </p>
//             </div>
//             <div className="p-3 bg-green-600/20 rounded-lg">
//               <FiMapPin className="text-green-400 text-xl" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 p-4 rounded-xl border border-orange-500/20">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-400 text-sm">Avg Price</p>
//               <p className="text-2xl font-bold text-white">
//                 ${(showtimes.reduce((acc, st) => acc + parseFloat(st.price), 0) / showtimes.length || 0).toFixed(2)}
//               </p>
//             </div>
//             <div className="p-3 bg-orange-600/20 rounded-lg">
//               <FiDollarSign className="text-orange-400 text-xl" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="bg-[#12131a] rounded-2xl border border-gray-800 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-900/50">
//               <tr>
//                 <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Movie</th>
//                 <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Date & Time</th>
//                 <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Hall</th>
//                 <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Price</th>
//                 <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-800">
//               {showtimes.map((st) => (
//                 <motion.tr
//                   key={st._id}
//                   className="hover:bg-gray-800/30 transition-colors duration-200"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   {/* Movie Info */}
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-4">
//                       <Image
//                         src={st.movieId.poster_path}
//                         alt={st.movieId.title}
//                         width={48}
//                         height={48}
//                         className="rounded-lg object-cover shadow-lg"
//                       />
//                       <div>
//                         <p className="text-white font-medium">{st.movieId.title}</p>
//                         <p className="text-gray-400 text-sm">Movie</p>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Date & Time */}
//                   <td className="py-4 px-6">
//                     <div className="space-y-1">
//                       <div className="flex items-center space-x-2">
//                         <FiCalendar className="text-purple-400 text-sm" />
//                         <span className="text-white font-medium">{formatDate(st.date)}</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <FiClock className="text-blue-400 text-sm" />
//                         <span className="text-gray-400 text-sm">{st.time}</span>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Hall */}
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-2">
//                       <FiMapPin className="text-green-400" />
//                       <span className="text-white font-medium">{st.hall}</span>
//                     </div>
//                   </td>

//                   {/* Price */}
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-2">
//                       <FiDollarSign className="text-yellow-400" />
//                       <span className="text-white font-bold">${st.price}</span>
//                     </div>
//                   </td>

//                   {/* Actions */}
//                   <td className="py-4 px-6 relative">
//                     <button
//                       className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
//                       onClick={() => setOpenMenuId(openMenuId === st._id ? null : st._id)}
//                     >
//                       <HiDotsHorizontal size={20} className="text-gray-400" />
//                     </button>

//                     <AnimatePresence>
//                       {openMenuId === st._id && (
//                         <motion.div
//                           initial={{ opacity: 0, scale: 0.95, y: -10 }}
//                           animate={{ opacity: 1, scale: 1, y: 0 }}
//                           exit={{ opacity: 0, scale: 0.95, y: -10 }}
//                           className="absolute right-6 top-14 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 w-48 overflow-hidden"
//                         >
//                           <button
//                             onClick={() => openUpdate(st)}
//                             className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-200"
//                           >
//                             <FiEdit2 className="text-blue-400" />
//                             <span>Edit Showtime</span>
//                           </button>
//                           <button
//                             onClick={() => handleDelete(st._id)}
//                             className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-200"
//                           >
//                             <FiTrash2 className="text-red-400" />
//                             <span>Delete</span>
//                           </button>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {showtimes.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-500 text-lg">No showtimes found</div>
//             <div className="text-gray-400 text-sm mt-2">Add your first showtime to get started</div>
//           </div>
//         )}
//       </div>

//       {/* Add Showtime Modal */}
//       <AddShowtimeModal
//         isOpen={isAddModalOpen}
//         onClose={() => setAddModalOpen(false)}
//         onSuccess={handleAddSuccess}
//       />

//       {/* Update Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//             onClick={() => setModalOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0, y: 20 }}
//               animate={{ scale: 1, opacity: 1, y: 0 }}
//               exit={{ scale: 0.9, opacity: 0, y: 20 }}
//               className="bg-gradient-to-br from-[#1a1c2b] to-[#151724] rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6">
//                 <h2 className="text-xl font-bold text-white mb-2">Edit Showtime</h2>
//                 <p className="text-gray-400 mb-6">Update the showtime details</p>

//                 <form onSubmit={handleUpdate} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
//                     <input
//                       type="date"
//                       value={editData.date}
//                       onChange={(e) => setEditData({ ...editData, date: e.target.value })}
//                       className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-2">Time</label>
//                     <input
//                       type="time"
//                       value={editData.time}
//                       onChange={(e) => setEditData({ ...editData, time: e.target.value })}
//                       className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-2">Hall</label>
//                     <input
//                       type="text"
//                       placeholder="Enter hall name"
//                       value={editData.hall}
//                       onChange={(e) => setEditData({ ...editData, hall: e.target.value })}
//                       className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-400 mb-2">Price ($)</label>
//                     <input
//                       type="number"
//                       placeholder="Enter price"
//                       value={editData.price}
//                       onChange={(e) => setEditData({ ...editData, price: e.target.value })}
//                       className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div className="flex justify-end space-x-3 pt-4">
//                     <button
//                       type="button"
//                       onClick={() => setModalOpen(false)}
//                       className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-colors duration-200"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl text-white font-medium transition-all duration-200 shadow-lg shadow-purple-600/25"
//                     >
//                       Update Showtime
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }