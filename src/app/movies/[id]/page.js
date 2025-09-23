
'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import LoadingSpinner from '@/app/hooks/LoadingSpiner'
import 'leaflet/dist/leaflet.css'

// 📍 Map Locations in Bangladesh
const mapLocations = {
  dhaka: {
    coords: [23.8103, 90.4125],
    label: 'Dhaka, Bangladesh',
    img: '/dhaka.png',
  },
  chattogram: {
    coords: [22.3419, 91.8155],
    label: 'Chattogram, Bangladesh',
    img: '/chattogram.png',
  },
  khulna: {
    coords: [22.8184, 89.5682],
    label: 'Khulna, Bangladesh',
    img: '/khulna.png',
  },
  gazipur: {
    coords: [23.9999, 90.4203],
    label: 'Gazipur, Bangladesh',
    img: '/gazipur.png',
  },
  uttara: {
    coords: [23.8763, 90.3796],
    label: 'Uttara, Dhaka, Bangladesh',
    img: '/uttara.png',
  },
}

export default function MovieDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState('dhaka')
  const mapRef = useRef(null)

  // 🎬 Fetch Movie Details from TMDB
  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true)
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos`
        )
        const data = await res.json()
        setMovie(data)
      } catch (err) {
        console.error('Error fetching movie details:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [id])

  // 🗺️ Init Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!movie) return

    import('leaflet').then((leaflet) => {
      const L = leaflet
      const mapElement = document.getElementById('map')
      if (!mapElement) return

      if (mapRef.current) {
        mapRef.current.remove()
      }

      const { coords, label, img } = mapLocations[selectedPlace]
      const map = L.map(mapElement).setView(coords, 12)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      const customIcon = L.icon({
        iconUrl: img,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      })

      L.marker(coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(label)
        .openPopup()
    })
  }, [selectedPlace, movie])

  if (loading) return <LoadingSpinner />
  if (!movie)
    return (
      <div className="p-6 text-center text-red-500">❌ Movie not found!</div>
    )

  // 🎥 Trailer from TMDB
  const trailer = movie.videos?.results?.find(
    (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
  )

  return (
    <div className="p-4 md:p-6 mx-auto space-y-10 text-white max-w-7xl">
      {/*  Banner */}
      <div className="relative mt-10 w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-lg">
        <button
          onClick={() => router.push('/movies')}
          className="absolute top-4 left-4 z-10 px-4 py-2 bg-gray-700/80 text-white rounded-lg shadow hover:bg-gray-600"
        >
          ⬅ Back
        </button>
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-500">
            {movie.title}
          </h1>
          <p className="mt-1 text-gray-200 text-sm md:text-base">
            {movie.release_date} | ⭐ {movie.vote_average} ({movie.vote_count}{' '}
            votes)
          </p>
        </div>
      </div>

      {/* 🎥 Trailer */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative bg-black rounded-xl p-4 max-w-3xl w-full">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg"
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
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {/* 📖 Overview */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-yellow-400">
        Overview
      </h2>
      <p className="text-gray-300 mb-8 leading-relaxed">{movie.overview}</p>

      {/* 🏷️ Movie Info */}
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
          <strong>Genres:</strong> {movie.genres?.map((g) => g.name).join(', ')}
        </p>
        <p>
          <strong>Popularity:</strong> {movie.popularity}
        </p>
        <p>
          <strong>Average Rating:</strong> ⭐ {movie.vote_average} (
          {movie.vote_count} votes)
        </p>
      </div>

      {/* Trailer Button */}
      {trailer && (
        <button
          onClick={() => setShowTrailer(true)}
          className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition"
        >
          ▶ Watch Trailer
        </button>
      )}

      {/*  Location Buttons */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-400">
        Select Location
      </h2>
      <div className="flex gap-3 flex-wrap mb-6">
        {Object.keys(mapLocations).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedPlace(key)}
            className={`px-4 py-2 rounded-lg ${
              selectedPlace === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200'
            }`}
          >
            {mapLocations[key].label}
          </button>
        ))}
      </div>

      {/* Leaflet Map */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-purple-400">
        Location Map
      </h2>
      <div
        id="map"
        className="w-full md:w-3/4 lg:w-1/2 h-72 md:h-96 rounded-xl overflow-hidden shadow-lg mx-auto"
      />
    </div>
  )
}
