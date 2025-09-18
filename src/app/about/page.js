'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center text-center px-6">
        <Image
          src="https://i.ibb.co/cK3r4vZJ/Zk-RCOGZId3c.jpg" 
          alt="Cinema Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400">
            Welcome to Vibe-Pass
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300">
            Your ultimate movie ticket booking platform – seamless, fast, and
            designed for movie lovers like you.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <h2 className="text-3xl font-bold text-center text-red-500">
          Why Choose Vibe-Pass?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3">🎟 Easy Booking</h3>
            <p className="text-gray-300">
              Book your favorite movie tickets in just a few clicks – hassle
              free and secure.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3">🎥 Watch Trailers</h3>
            <p className="text-gray-300">
              Explore trailers before booking and discover the perfect movie for
              your vibe.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3">📍 Location Based</h3>
            <p className="text-gray-300">
              Find nearby cinemas and choose your perfect seat – wherever you
              are.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3">⭐ Verified Reviews</h3>
            <p className="text-gray-300">
              Get real ratings & reviews from movie fans before booking your
              ticket.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3">📱 Mobile Friendly</h3>
            <p className="text-gray-300">
              Fully optimized for mobile, tablet, and desktop – book anytime,
              anywhere.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-3">🚀 Fast & Secure</h3>
            <p className="text-gray-300">
              Powered by modern tech, Vibe-Pass ensures a smooth and safe ticket
              booking experience.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-900 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-400">Our Mission</h2>
          <p className="mt-6 text-gray-300 leading-relaxed text-lg">
            At Vibe-Pass, we aim to revolutionize the way you experience cinema.
            From booking tickets to exploring movies and connecting with your
            local theaters – our mission is to bring the magic of movies closer
            to you.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-400">
          Ready for your next movie experience?
        </h2>
        <p className="mt-4 text-gray-300">
          Explore the latest movies and book your tickets instantly.
        </p>
        <button
          onClick={() => router.push('/movies')}
          className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-semibold shadow-lg transition"
        >
          Book Your Ticket Now 🎟
        </button>
      </section>
    </div>
  )
}
