'use client'
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure'
import TheatersNear from '@/app/components/NearbyTheaters'
import LoadingSpinner from '@/app/hooks/LoadingSpiner'
import AllTheatersLocation from '@/app/location/AllTheatersLocation'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MovieDetailsPage() {
  const params = useParams()
  const id = params.id
  const [movie, setMovie] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [hallData, setHallData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [nearbyTheaters, setNearbyTheaters] = useState([])
  const [selectedCinema, setSelectedCinema] = useState(null)
  const [selectionMode, setSelectionMode] = useState("auto") // auto/manual toggle
  const router = useRouter()

  // Fetch Hall Data
  useEffect(() => {
    const fetchHallData = async () => {
      try {
        const res = await axiosSecure.get('/api/hall-distribution')
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
      try {
        setLoading(true)
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos,credits`
        )
        const data = await res.json()
        setMovie(data)
      } catch (err) {
        console.error('Error fetching movie details:', err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchMovie()
  }, [id])

  // Auto Detect nearby theater
  useEffect(() => {
    if (!hallData.length) return
    if (selectionMode === "auto") {
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
                district: theaters[0].district || ''
              })
            }
          }
        },
        (err) => console.error('Location error:', err)
      )
    }
  }, [hallData, selectionMode])

  // ✅ Reset selectedCinema when switching to manual
  useEffect(() => {
    if (selectionMode === "manual") {
      setSelectedCinema(null)
    }
  }, [selectionMode])

  const trailer = movie?.videos?.results?.find(
    (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
  )

  if (loading) return <LoadingSpinner />
  if (!movie) return <div className="p-6 text-center text-red-500 bg-gray-900 min-h-screen">❌ Movie not found!</div>

  return (
    <div className="space-y-10 text-white">
      {/* Banner */}
      <div className="relative w-full h-72 md:h-96 lg:h-[700px] overflow-hidden shadow-lg">
        <Image
          fill
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,black_0%,black_0%,rgba(0,0,0,0.8)_10%,rgba(0,0,0,0.3)_100%)]"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-500">{movie.title}</h1>
          <p className="mt-1 text-gray-200 text-sm md:text-base">{movie.release_date} | ⭐ {movie.vote_average} ({movie.vote_count} votes)</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Trailer Modal */}
        {showTrailer && trailer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="relative bg-gray-900 rounded-xl p-4 max-w-3xl w-full">
              <button onClick={() => setShowTrailer(false)} className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition">✖ Close</button>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={`${movie.title} Trailer`}
                width="100%"
                height="500"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded-lg w-full aspect-video"
              />
            </div>
          </div>
        )}

        {/* Overview */}
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-yellow-400">Overview</h2>
        <p className="text-gray-300 mb-8 leading-relaxed">{movie.overview}</p>

        {/* Movie Info */}
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-400">Movie Info</h2>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-2 text-sm md:text-base">
          <p><strong>Original Language:</strong> {movie.original_language}</p>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
          <p><strong>Genres:</strong> {movie.genres?.map((g) => g.name).join(', ')}</p>
          <p><strong>Production Companies:</strong> {movie.production_companies?.map((pc) => pc.name).join(', ')}</p>
          <p><strong>Cast:</strong> {movie.credits?.cast?.slice(0, 5).map((actor) => actor.name).join(', ')}</p>

          {trailer && (
            <button onClick={() => setShowTrailer(true)} className="mt-4 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition flex items-center gap-2">
              ▶ Watch Trailer
            </button>
          )}
        </div>

        {/* Cinema Selection Mode */}
        <div className="flex gap-3 items-center my-8">
          <button onClick={() => setSelectionMode("auto")} className={`px-5 py-2 rounded-lg font-semibold ${selectionMode === "auto" ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"}`}>Auto Detect</button>
          <button onClick={() => setSelectionMode("manual")} className={`px-5 py-2 rounded-lg font-semibold ${selectionMode === "manual" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>Manual Select</button>
        </div>

        {/* Auto Detect */}
        {selectionMode === "auto" && (
          <TheatersNear
            selectedCinema={selectedCinema}
            setSelectedCinema={setSelectedCinema}
          />
        )}

        {/* Manual Select */}
        {selectionMode === "manual" && (
          <AllTheatersLocation
            onLocationSelect={(loc) => {
              if (loc?.cinemas?.length > 0) {
                setSelectedCinema({
                  name: loc.cinemas[0],
                  city: loc.region,
                  district: loc.district
                })
              }
            }}
          />
        )}

        {/* Book Now Button */}
        <div className="flex gap-4 flex-wrap pb-20 pt-10">
          {selectedCinema && (
            <button
              onClick={() =>
                router.push(
                  `/booking/${movie.id}?cinema=${encodeURIComponent(selectedCinema.name)}&city=${selectedCinema.city}&district=${selectedCinema.district}`
                )
              }
              className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              🎫 Book Now at {selectedCinema.name}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
