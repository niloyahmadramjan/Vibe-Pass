'use client'
import axiosSecure from '@/app/api/axiosHook/useAxiosSecure'
import LoadingSpinner from '@/app/hooks/LoadingSpiner'
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
  const [map, setMap] = useState(null)
<<<<<<< HEAD
  console.log(hallData);
=======
  const router = useRouter();
>>>>>>> 7b63a72c9a4b8fe8f41848b155022e926df038e9

  // State for location selection
  const [selectedDivision, setSelectedDivision] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  // Fetch Hall Data
  useEffect(() => {
    const fetchHallData = async () => {
      try {
        const res = await axiosSecure.get('/api/hall-distribution')
        const distributionData = res.data
        setHallData(distributionData)

        // Set initial state
        if (distributionData?.length > 0) {
          const firstDivision = distributionData[0]
          setSelectedDivision(firstDivision.name || '')
          if (firstDivision?.districts?.length > 0) {
            setSelectedDistrict(firstDivision.districts[0].id)
          }
        }
      } catch (err) {
        setError(err)
      }
    }
    fetchHallData()
  }, [])

  // ✅ Fetch TMDB Movie Details
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

 

  const trailer = movie?.videos?.results?.find(
    (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
  )

  if (loading) {
    return <LoadingSpinner/>
  }

  if (!movie) {
    return (
      <div className="p-6 text-center text-red-500 bg-gray-900 min-h-screen">
        ❌ Movie not found!
      </div>
    )
  }

  const selectedDivisionData = hallData.find(
    (div) => div.name === selectedDivision
  )
  const availableDistricts = selectedDivisionData?.districts || []

  return (
    <div className=" space-y-10 text-white ">
      {/* Banner */}
      <div className="relative  w-full h-72 md:h-96 lg:h-[700px]  overflow-hidden shadow-lg">
        <Image
          fill
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,black_0%,black_0%,rgba(0,0,0,0.8)_10%,rgba(0,0,0,0.3)_100%)]"></div>
        <div className="absolute inset-0  flex flex-col justify-end p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-500">
            {movie.title}
          </h1>
          <p className="mt-1 text-gray-200 text-sm md:text-base">
            {movie.release_date} | ⭐ {movie.vote_average} ({movie.vote_count}{' '}
            votes)
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4">
        {/* Trailer */}
        {showTrailer && trailer && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="relative bg-gray-900 rounded-xl p-4 max-w-3xl w-full">
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
              >
                ✖ Close
              </button>
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
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-yellow-400">
          Overview
        </h2>
        <p className="text-gray-300 mb-8 leading-relaxed">{movie.overview}</p>

        {/* Movie Info */}
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-400">
          Movie Info
        </h2>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-2 text-sm md:text-base">
          <p>
            <strong>Original Language:</strong> {movie.original_language}
          </p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Runtime:</strong> {movie.runtime} minutes
          </p>
          <p>
            <strong>Genres:</strong>{' '}
            {movie.genres?.map((g) => g.name).join(', ')}
          </p>
          <p>
            <strong>Production Companies:</strong>{' '}
            {movie.production_companies?.map((pc) => pc.name).join(', ')}
          </p>
          <p>
            <strong>Cast:</strong>{' '}
            {movie.credits?.cast
              ?.slice(0, 5)
              .map((actor) => actor.name)
              .join(', ')}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 flex-wrap pb-20 pt-10">
          {trailer && (
            <button
              onClick={() => setShowTrailer(true)}
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
            >
              ▶ Watch Trailer
            </button>
          )}
          <button
            onClick={() => router.push(`/booking/${movie.id}`)}
            className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
          >
            🎫 Book Now
          </button>
        </div>

        {/* Location Selectors */}
        {/* <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-400">
          Select Location
        </h2>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Division Selector */}
          {/* <div className="flex-1">
            <label
              htmlFor="division-select"
              className="block text-gray-300 mb-1"
            >
              Select Division
            </label>
            <select
              id="division-select"
              value={selectedDivision}
              onChange={(e) => {
                const newDivision = e.target.value
                setSelectedDivision(newDivision)
                const newDivisionData = hallData.find(
                  (div) => div.name === newDivision
                )
                if (newDivisionData?.districts?.length > 0) {
                  setSelectedDistrict(newDivisionData.districts[0].id)
                } else {
                  setSelectedDistrict('')
                }
              }}
              className="w-full md:w-auto p-3 rounded-lg bg-gray-700 text-white cursor-pointer"
            >
              {hallData.map((division) => (
                <option key={division.name} value={division.name}>
                  {division.name}
                </option>
              ))}
            </select>
          </div> */}

<<<<<<< HEAD
      {/* Map Section */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-purple-400">
        Location Map
      </h2>
      <div
        id="map"
        className="w-full md:w-3/4 lg:w-1/2 h-72 md:h-96 rounded-xl overflow-hidden shadow-lg mx-auto"
      />
=======
          {/* District Selector */}
          {/* <div className="flex-1">
            <label
              htmlFor="district-select"
              className="block text-gray-300 mb-1"
            >
              Select District
            </label>
            <select
              id="district-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full md:w-auto p-3 rounded-lg bg-gray-700 text-white cursor-pointer"
            >
              {availableDistricts.length > 0 ? (
                availableDistricts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.label}
                  </option>
                ))
              ) : (
                <option value="">No districts found</option>
              )}
            </select>
          </div> */}
        {/* </div> */} 

        {/* Map Section */}
        {/* <h2 className="text-xl md:text-2xl font-bold mb-4 text-purple-400">
          Location Map
        </h2> */}
        
      </div>
>>>>>>> 7b63a72c9a4b8fe8f41848b155022e926df038e9
    </div>
  )
}
