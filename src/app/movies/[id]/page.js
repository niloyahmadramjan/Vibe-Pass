'use client'
import axiosPublic from '@/app/api/axiosHook/useAxiosPublic'
import TheatersNear from '@/app/components/NearbyTheaters'
import LoadingSpinner from '@/app/hooks/LoadingSpiner'
import AllTheatersLocation from '@/app/location/AllTheatersLocation'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MovieDetailsPage() {
  const params = useParams()
  const id = params.id
  // console.log(id)
  const [movie, setMovie] = useState(null)

  const [hallData, setHallData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nearbyTheaters, setNearbyTheaters] = useState([])
  const [selectedCinema, setSelectedCinema] = useState(null)
  const [selectionMode, setSelectionMode] = useState('auto')

  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const router = useRouter()
  const IMG_URL = "https://image.tmdb.org/t/p/w500";
  // Fetch Hall Data
// popularity...................convate 1k 1M 

  const formatPopularity = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toFixed(1);
  };

  useEffect(() => {
    const fetchHallData = async () => {
      try {
        const res = await axiosPublic.get('/api/hall-distribution')
        setHallData(res.data)
      } catch (err) {
        setError(err)
      }
    }
    fetchHallData()
  }, [])

  // Fetch TMDB Movie Details
  useEffect(() => {
    async function fetchMovie() {
      if (!id) return
      try {
        setLoading(true)
        const res = await axiosPublic.get(`/api/movies/${id}`)
        setMovie(res.data)
      } catch (err) {
        console.error("Error fetching movie details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  // Auto Detect nearby theater
  useEffect(() => {
    if (!hallData.length) return
    if (selectionMode === 'auto') {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          const foundDivision = hallData.find((div) =>
            div.districts.some((d) => d.lat && d.lng)
          )
          if (foundDivision) {
            const theaters = foundDivision.districts.flatMap(
              (d) => d.theaters || []
            )
            setNearbyTheaters(theaters)
            if (theaters.length > 0) {
              setSelectedCinema({
                name: theaters[0].name,
                city: theaters[0].city || '',
                district: theaters[0].district || '',
              })
            }
          }
        },
        (err) => console.error('Location error:', err)
      )
    }
  }, [hallData, selectionMode])

  // Reset selectedCinema when switching to manual
  useEffect(() => {
    if (selectionMode === 'manual') {
      setSelectedCinema(null)
    }
  }, [selectionMode])

  const trailer = movie?.videos?.results?.find(
    (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
  )



  const fetchTrailer = async (id) => {
    console.log("id", id)
    try {
      console.log("🎥 Fetching trailer for TMDB ID:", id);
      const res = await axiosPublic.get(`/api/movies/${id}/videos`);

      if (res.status === 200) {
        const results = res.data.results;
        const trailer = results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );

        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`);
          setShowTrailer(true);
        } else {
          alert("Trailer not available!");
        }
      } else {
        console.error("Failed to fetch trailer: Status", res.status);
      }
    } catch (error) {
      console.error("🎬 Failed to fetch trailer:", error);
    }
  };
  

  if (loading) return <LoadingSpinner />
  if (!movie)
    return (
      <div className="p-6 text-center text-red-500 bg-gray-900 min-h-screen">
        Movie not found!
      </div>
    )

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Enhanced Banner */}
      <div className="relative w-full h-96 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden">
        <Image
          fill
          src={
            typeof movie.poster_path === "string" && movie.poster_path.startsWith("http")
              ? movie.poster_path // full URL (like i.ibb.co)
              : IMG_URL + movie.poster_path // TMDB partial path
          }


          alt={movie.title}
          className="object-cover w-full h-full"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
        />

        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

        {/* Movie Info Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end pb-6 lg:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="space-y-3 sm:space-y-4">
            {/* Movie Title - Responsive */}
            <h1 className="text-2xl sm:text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight break-words">
              {movie.title}
            </h1>

            {/* Movie Details - Responsive Grid */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base">
              {/* Rating */}
              <div className="flex items-center gap-1 sm:gap-2 bg-[#1E1E1E]/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-xs font-bold">★</span>
                </div>
                <span className="font-semibold text-white whitespace-nowrap">
                  {movie.vote_average?.toFixed(1)}/10
                </span>
                <span className="text-gray-400 whitespace-nowrap">
                  ({movie.vote_count} votes)
                </span>
              </div>

              {/* Release Date */}
              <div className="flex items-center gap-1 sm:gap-2 bg-[#1E1E1E]/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-white font-medium whitespace-nowrap">
                  {new Date(movie.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Runtime */}
              {movie.runtime && (
                <div className="flex items-center gap-1 sm:gap-2 bg-[#1E1E1E]/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-white font-medium whitespace-nowrap">
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </span>
                </div>
              )}

              {/* Genres */}
              <div className="flex items-center gap-1 sm:gap-2 bg-[#1E1E1E]/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-full">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <div className="flex gap-1 flex-wrap">
                  {movie.genres?.slice(0, 2).map((genre, index) => (
                    <span
                      key={genre.id}
                      className="text-white font-medium whitespace-nowrap"
                    >
                      {genre.name}
                      {index < Math.min(movie.genres.length - 1, 1) ? ',' : ''}
                    </span>
                  ))}
                  {movie.genres?.length > 2 && (
                    <span className="text-gray-400">
                      +{movie.genres.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons - Responsive */}
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4">

              <button
                onClick={() => fetchTrailer(movie.id)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg text-sm sm:text-base whitespace-nowrap"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Trailer
              </button>


              {/* <button className="px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg text-sm sm:text-base whitespace-nowrap">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Watchlist
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Trailer Modal */}
        {showTrailer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative w-full max-w-3xl bg-black rounded-xl p-4 border border-gray-700">
              <button
                onClick={() => {
                  setShowTrailer(false);
                  setTrailerUrl("");
                }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition"
              >
                ✖ Close
              </button>

              <iframe
                src={trailerUrl}
                width="100%"
                height="500"
                title={`${movie.title} Trailer`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        )}



        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Overview Section */}
            <section className="bg-[#1E1E1E] rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-red-500 rounded-full flex-shrink-0"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Storyline
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                {movie.overview || 'No overview available for this movie.'}
              </p>
            </section>

            {/* Movie Details Section */}
            <section className="bg-[#1E1E1E] rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-blue-500 rounded-full flex-shrink-0"></div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Movie Details
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                      Language
                    </h3>
                    <p className="text-white font-medium text-base sm:text-lg uppercase">
                      {movie.original_language}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                    Orginal Language
                    </h3>
                    <p className="text-white font-medium text-base sm:text-lg">
                      {movie.original_title}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                      Vote
                    </h3>
                    <p className="text-white font-medium text-base sm:text-lg">
                      {movie.vote_count
                        ? `${movie.vote_count}`
                        : 'Not available'}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                      Popularity
                    </h3>
                    <p className="text-white font-medium text-base sm:text-lg">
                      {movie.popularity ? formatPopularity(movie.popularity) : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-red-400 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">
                      Vote Avarage
                    </h3>
                    <p className="text-white font-medium text-base sm:text-lg line-clamp-2">
                      {movie?.vote_average}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>





          {/* Sidebar - Booking Section or Release Info */}
          {movie?.category === "upcoming" ? (
            //  Show this if the movie is upcoming
            <div className="bg-[#1E1E1E] rounded-xl lg:rounded-2xl p-4 justify-center items-center flex flex-col sm:p-6 border border-gray-700 text-center h-70 ">
              <h2 className="text-2xl font-bold text-white mb-2"> Coming Soon</h2>
              <p className="text-gray-400">
                Release Date:{" "}
                <span className="text-green-500 font-semibold">
                  {new Date(movie?.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
          ) : (
            // ✅ Show booking section for all other categories
            <div className="space-y-6">
              <div className="bg-[#1E1E1E] rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-green-500 rounded-full flex-shrink-0"></div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Book Tickets
                  </h2>
                </div>

                {/* Selection Mode Toggle */}
                <div className="flex gap-2 sm:gap-2 mb-4 sm:mb-6 p-1 bg-gray-800 rounded-lg mx-2">
                  <button
                    onClick={() => setSelectionMode("auto")}
                    className={`flex-1 py-2 px-2 sm:px-3 rounded-md font-semibold transition-all text-xs sm:text-sm ${selectionMode === "auto"
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    Auto
                  </button>
                  <button
                    onClick={() => setSelectionMode("manual")}
                    className={`flex-1 py-2 px-2 sm:px-3 rounded-md font-semibold transition-all text-xs sm:text-sm ${selectionMode === "manual"
                      ? "bg-red-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                      }`}
                  >
                    Manual
                  </button>
                </div>

                {/* Auto Detection */}
                {selectionMode === "auto" && (
                  <div className="mb-4">
                    <TheatersNear
                      selectedCinema={selectedCinema}
                      setSelectedCinema={setSelectedCinema}
                    />
                  </div>
                )}

                {/* Manual Theater Selection */}
                {selectionMode === "manual" && (
                  <div className="mb-4">
                    <AllTheatersLocation
                      movieId={movie?.id}
                      onLocationSelect={(loc) => {
                        if (loc?.cinemas?.length > 0) {
                          handleCinemaSelect({
                            name: loc.cinemas[0],
                            city: loc.region,
                            district: loc.district,
                          });
                        }
                      }}
                    />
                  </div>
                )}

                {/* Book Now Button */}
                {selectedCinema && (
                  <button
                    onClick={() =>
                      router.push(
                        `/booking/${movie.id}?cinema=${encodeURIComponent(
                          selectedCinema.name
                        )}&city=${selectedCinema.city}&district=${selectedCinema.district
                        }`
                      )
                    }
                    className="w-full py-3 sm:py-4 rounded-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg font-semibold text-sm sm:text-base whitespace-nowrap"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Book at{" "}
                    {selectedCinema.name.length > 20
                      ? `${selectedCinema.name.substring(0, 20)}...`
                      : selectedCinema.name}
                  </button>
                )}
              </div>
            </div>
          )}





        </div>
      </div>
    </div>
  )
}