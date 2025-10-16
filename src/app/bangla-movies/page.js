// 'use client'

// import Image from 'next/image'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
// import LoadingSpinner from '../hooks/LoadingSpiner'
// import BookingLocationModal from '../components/BookingLocationModal'
// import axiosPublic from '../api/axiosHook/useAxiosPublic'

// export default function BanglaMoviesPage() {
//   const [movies, setMovies] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [allMovies, setAllMovies] = useState([])
//   const [visiblePageNumbers, setVisiblePageNumbers] = useState([])
  
//   const [trailerKey, setTrailerKey] = useState(null)
//   const [trailerUrl, setTrailerUrl] = useState("")
//   const [trailerLoading, setTrailerLoading] = useState(null)

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [selectedMovie, setSelectedMovie] = useState(null)
//   const [selectionMode, setSelectionMode] = useState('auto')
//   const [selectedCinema, setSelectedCinema] = useState(null)

//   const router = useRouter()
//   const IMG_URL = 'https://image.tmdb.org/t/p/w500'

//   // Load all Bangla movies on component mount
//   useEffect(() => {
//     const fetchAllBanglaMovies = async () => {
//       try {
//         setLoading(true)
//         const res = await axiosPublic.get(`/api/movies/category/banglaFilm`)

//         const allMoviesData = res.data || []
//         setAllMovies(allMoviesData)

//         const totalMovies = allMoviesData.length
//         const calculatedTotalPages = Math.ceil(totalMovies / 12)
//         setTotalPages(calculatedTotalPages)

//       } catch (error) {
//         console.error("Failed to fetch Bangla movies", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchAllBanglaMovies()
//   }, [])

//   // Update movies when page changes
//   useEffect(() => {
//     if (allMovies.length > 0) {
//       const startIndex = (page - 1) * 12
//       const endIndex = startIndex + 12
//       const currentPageMovies = allMovies.slice(startIndex, endIndex)
//       setMovies(currentPageMovies)
//     }
//   }, [page, allMovies])

//   // Update visible page numbers when page changes
//   useEffect(() => {
//     const updateVisiblePages = () => {
//       const maxVisiblePages = 5
//       let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
//       let endPage = startPage + maxVisiblePages - 1

//       if (endPage > totalPages) {
//         endPage = totalPages
//         startPage = Math.max(1, endPage - maxVisiblePages + 1)
//       }

//       const pages = []
//       for (let i = startPage; i <= endPage; i++) {
//         pages.push(i)
//       }
//       setVisiblePageNumbers(pages)
//     }

//     updateVisiblePages()
//   }, [page, totalPages])

//   const handleBookNow = (movie) => {
//     setSelectedMovie(movie)
//     setSelectedCinema(null)
//     setSelectionMode('auto')
//     setIsModalOpen(true)
//   }

//   const handleViewDetails = (movie) => {
//     router.push(`/movies/${movie.id}`)
//   }

//   const fetchTrailer = async (movie) => {
//     setTrailerLoading(movie.id)
//     try {
//       console.log("🎥 Fetching trailer for TMDB ID:", movie.id);

//       // ✅ Call your backend API - same as MoviesPage
//       const res = await axiosPublic.get(`/api/movies/${movie.id}/videos`);

//       if (res.status === 200) {
//         const results = res.data.results;

//         const trailer = results.find(
//           (v) => v.type === "Trailer" && v.site === "YouTube"
//         );

//         if (trailer) {
//           setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
//           setTrailerKey(true);
//         } else {
//           alert("Trailer not available!");
//         }
//       } else {
//         console.error("Failed to fetch trailer: Status", res.status);
//         // Fallback to YouTube search like before
//         const searchQuery = `${movie.title} official trailer bangla`
//         const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
//         window.open(youtubeUrl, '_blank')
//       }
//     } catch (error) {
//       console.error("🎬 Failed to fetch trailer:", error);
//       // Fallback to YouTube search
//       const searchQuery = `${movie.title} official trailer bangla`
//       const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
//       window.open(youtubeUrl, '_blank')
//     } finally {
//       setTrailerLoading(null)
//     }
//   }

//   const handleNextPages = () => {
//     const currentLastPage = visiblePageNumbers[visiblePageNumbers.length - 1]
//     if (currentLastPage < totalPages) {
//       setPage(currentLastPage + 1)
//     }
//   }

//   const handlePrevPages = () => {
//     const currentFirstPage = visiblePageNumbers[0]
//     if (currentFirstPage > 1) {
//       setPage(currentFirstPage - 1)
//     }
//   }

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <LoadingSpinner />
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4 md:px-6 py-10 pt-25 max-w-7xl mx-auto">
//       {/* Header Section - Same as MoviesPage but with Bangla theme */}
//       <div className="text-center mb-12">
//         <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
//           বাংলা সিনেমা
//         </h1>
//         <p className="text-gray-400 text-lg max-w-2xl mx-auto">
//           Experience the magic of Bengali cinema. Book your tickets now for an unforgettable cinematic journey.
//         </p>
//       </div>

//       {movies.length === 0 ? (
//         <div className="text-center py-20">
//           <div className="text-gray-400 text-6xl mb-4">🎭</div>
//           <p className="text-xl text-gray-400 mb-2">No Bangla movies found!</p>
//           <p className="text-gray-600">Check back later for new Bengali releases.</p>
//         </div>
//       ) : (
//         <>
//           {/* Movie Grid - Same as MoviesPage */}
//           <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {movies.map((movie, index) => (
//               <div
//                 key={movie.id}
//                 className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl hover:shadow-yellow-500/20 border border-gray-700/50 hover:border-yellow-500/30 transition-all duration-500 hover:-translate-y-2 flex flex-col"
//               >
//                 {/* Poster Image with Hover Effect - Same as MoviesPage */}
//                 <div 
//                   className="relative w-full h-80 overflow-hidden cursor-pointer"
//                   onClick={() => handleViewDetails(movie)}
//                 >
//                   <Image
//                     src={
//                       typeof movie.poster_path === "string" && movie.poster_path.startsWith("http")
//                         ? movie.poster_path
//                         : IMG_URL + movie.poster_path
//                     }
//                     alt={movie.title || "Movie Poster"}
//                     fill
//                     className="object-cover group-hover:scale-110 transition-transform duration-500"
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
//                     priority={index < 4}
//                   />
                  
//                   {/* Gradient Overlay - Same as MoviesPage */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent"></div>
                  
//                   {/* Rating Badge - Same as MoviesPage */}
//                   <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border border-yellow-500/30">
//                     <span className="text-yellow-400 text-sm font-bold">⭐</span>
//                     <span className="text-white font-bold text-sm">
//                       {movie.vote_average?.toFixed(1) || '0'}
//                     </span>
//                   </div>

//                   {/* Hover Overlay - Same as MoviesPage */}
//                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                     <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
//                       <div className="text-3xl mb-2">👁️</div>
//                       <p className="text-lg font-semibold">View Details</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Movie Details - Same as MoviesPage */}
//                 <div className="p-6 flex flex-col flex-1">
//                   <div className="flex-1">
//                     <h2 
//                       className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors cursor-pointer"
//                       onClick={() => handleViewDetails(movie)}
//                     >
//                       {movie.title}
//                     </h2>
                    
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="text-gray-400 text-sm bg-gray-700/50 px-2 py-1 rounded">
//                         {movie.release_date || 'Coming Soon'}
//                       </span>
//                       <span className="text-gray-400 text-sm">
//                         {movie.vote_count} votes
//                       </span>
//                     </div>

//                     <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
//                       {movie.overview || 'No description available.'}
//                     </p>
//                   </div>

//                   {/* Action Buttons - Same as MoviesPage */}
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => fetchTrailer(movie)}
//                       disabled={trailerLoading === movie.id}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       {trailerLoading === movie.id ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           <span>Loading...</span>
//                         </>
//                       ) : (
//                         <>
//                           <span>Trailer</span>
//                           <span className="group-hover/btn:scale-110 transition-transform">🎬</span>
//                         </>
//                       )}
//                     </button>

//                     <button
//                       onClick={() => handleBookNow(movie)}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn"
//                     >
//                       <span>Book</span>
//                       <span className="group-hover/btn:translate-x-1 transition-transform">🎟️</span>
//                     </button>
//                   </div>

//                   {/* Details Button - Same as MoviesPage */}
//                   <button
//                     onClick={() => handleViewDetails(movie)}
//                     className="w-full mt-3 px-4 py-2 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/details"
//                   >
//                     <span>View Details</span>
//                     <span className="group-hover/details:translate-x-1 transition-transform">→</span>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination - Same as MoviesPage */}
//           {totalPages > 1 && (
//             <div className="mt-16">
//               {/* Page Info */}
//               <div className="text-center text-gray-400 text-sm mb-6">
//                 Showing <span className="text-white font-semibold">{Math.min(12, movies.length)}</span> movies on page{' '}
//                 <span className="text-white font-semibold">{page}</span> of{' '}
//                 <span className="text-white font-semibold">{totalPages}</span>
//               </div>

//               {/* Pagination Controls */}
//               <div className="flex justify-center items-center gap-2 flex-wrap">
//                 {/* Previous Pages Button */}
//                 <button
//                   onClick={handlePrevPages}
//                   disabled={visiblePageNumbers[0] === 1}
//                   className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
//                     visiblePageNumbers[0] === 1
//                       ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
//                       : 'bg-gray-800 hover:bg-yellow-600 text-gray-300 hover:text-white shadow-lg hover:shadow-yellow-500/25'
//                   }`}
//                 >
//                   <span>←</span>
//                   <span className="hidden sm:inline">Previous</span>
//                 </button>

//                 {/* Show first page if not in current visible pages */}
//                 {visiblePageNumbers[0] > 1 && (
//                   <>
//                     <button
//                       onClick={() => setPage(1)}
//                       className="px-4 py-3 rounded-xl font-semibold transition-all duration-300 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
//                     >
//                       1
//                     </button>
//                     {visiblePageNumbers[0] > 2 && (
//                       <span className="px-3 text-gray-500 text-lg">...</span>
//                     )}
//                   </>
//                 )}

//                 {/* Visible Page Numbers */}
//                 {visiblePageNumbers.map((pageNum) => (
//                   <button
//                     key={pageNum}
//                     onClick={() => setPage(pageNum)}
//                     className={`px-4 py-3 min-w-[3rem] rounded-xl font-semibold transition-all duration-300 ${
//                       pageNum === page
//                         ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg shadow-yellow-500/25 scale-105'
//                         : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 ))}

//                 {/* Show last page if not in current visible pages */}
//                 {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages && (
//                   <>
//                     {visiblePageNumbers[visiblePageNumbers.length - 1] < totalPages - 1 && (
//                       <span className="px-3 text-gray-500 text-lg">...</span>
//                     )}
//                     <button
//                       onClick={() => setPage(totalPages)}
//                       className="px-4 py-3 rounded-xl font-semibold transition-all duration-300 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
//                     >
//                       {totalPages}
//                     </button>
//                   </>
//                 )}

//                 {/* Next Pages Button */}
//                 <button
//                   onClick={handleNextPages}
//                   disabled={visiblePageNumbers[visiblePageNumbers.length - 1] === totalPages}
//                   className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
//                     visiblePageNumbers[visiblePageNumbers.length - 1] === totalPages
//                       ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
//                       : 'bg-gray-800 hover:bg-yellow-600 text-gray-300 hover:text-white shadow-lg hover:shadow-yellow-500/25'
//                   }`}
//                 >
//                   <span className="hidden sm:inline">Next</span>
//                   <span>→</span>
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* Trailer Modal - Same as MoviesPage */}
//       {trailerKey && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
//           <div className="relative w-full max-w-3xl p-4 bg-black rounded-xl">
//             <button
//               onClick={() => setTrailerKey(false)}
//               className="absolute -top-12 right-0 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition z-10"
//             >
//               ✖ Close
//             </button>
//             <iframe
//               src={trailerUrl}
//               width="100%"
//               height="500"
//               title="Movie Trailer"
//               allow="autoplay; encrypted-media"
//               allowFullScreen
//               className="rounded-lg"
//             ></iframe>
//           </div>
//         </div>
//       )}

//       {/* Booking Modal */}
//       <BookingLocationModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         movie={selectedMovie}
//         selectionMode={selectionMode}
//         setSelectionMode={setSelectionMode}
//         selectedCinema={selectedCinema}
//         setSelectedCinema={setSelectedCinema}
//       />
//     </div>
//   )
// }