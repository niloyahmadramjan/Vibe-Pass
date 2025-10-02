'use client'

import React from 'react'

/**
 * MovieExperienceSection.jsx
 * Enhanced responsive Next.js React component with smooth gradients and better UX
 */

export default function MovieExperienceSection({
  images = [
    'https://i.ibb.co/TDpPRSgY/panel-fx.webp',
    'https://i.ibb.co/XxBWBvCP/panel-gd.webp',
    'https://i.ibb.co/Z1wHQQ9Y/panel-imx.webp',
    'https://i.ibb.co/8D5XXB3D/panel-kd.webp',
    'https://i.ibb.co/QvvP28w3/panel-kmp.webp',
    'https://i.ibb.co/ksf37rCz/panel-mn.webp',
    'https://i.ibb.co/h1n2PqbP/panel-mx.webp',
    'https://i.ibb.co/vvvPPrvH/panel-pmr.webp',
    'https://i.ibb.co/PZZgqVhn/panel-pod.webp',
    'https://i.ibb.co/0yhFGzhY/panel-pvt.webp',
    'https://i.ibb.co/ym41bzt3/panel-so.webp',
    'https://i.ibb.co/LhBB1kwQ/panel-th.webp',
  ],
  rowHeight = 160, // px fallback for height
  speed = 30, // Increased for smoother experience
}) {
  // Duplicate images so the marquee looks continuous
  const doubled = [...images, ...images]

  return (
    <section className="relative overflow-hidden py-8 md:py-12 max-w-7xl mx-auto">
      <div className="px-4 md:px-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-[#D32F2F] rounded-full"></div>
            <span className="text-[#FFD700] font-semibold text-sm uppercase tracking-wider">
              Premium Experiences
            </span>
            <div className="w-2 h-2 bg-[#D32F2F] rounded-full"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Ultimate
            <span className="text-gradient bg-gradient-to-r from-[#D32F2F] to-[#FF5252] bg-clip-text text-transparent">
              {' '}
              Movie Experiences
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our premium formats and immersive cinema technologies
          </p>
        </div>

        {/* Enhanced Marquee Container */}
        <div className="relative group">
          {/* Row 1: left -> right */}
          <div
            className="relative overflow-hidden rounded-xl mb-6 md:mb-8"
            style={{ height: `${rowHeight}px` }}
          >
            {/* Enhanced Gradient Overlays */}
            <div
              className="absolute inset-y-0 left-0 w-32 md:w-48 z-30 pointer-events-none"
              aria-hidden
            >
              <div className="h-full w-full bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
            </div>

            <div
              className="absolute inset-y-0 right-0 w-32 md:w-48 z-30 pointer-events-none"
              aria-hidden
            >
              <div className="h-full w-full bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
            </div>

            {/* Marquee Content */}
            <div
              className="flex animate-marquee-smooth whitespace-nowrap will-change-transform hover:animation-paused"
              style={{
                animationDuration: `${speed}s`,
              }}
            >
              {doubled.map((src, i) => (
                <div
                  key={`l2r-${i}`}
                  className="inline-flex items-center justify-center mr-6 md:mr-8 flex-shrink-0 group relative"
                  style={{
                    height: `${rowHeight - 16}px`,
                    width: `${Math.min(rowHeight * (16 / 9), 280)}px`,
                  }}
                >
                  {/* Image Container with Hover Effect */}
                  <div className="relative h-full w-full overflow-hidden rounded-lg shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-red-500/20">
                    <img
                      src={src}
                      alt="Cinema experience"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      aria-hidden
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: right -> left (reverse direction) */}
          <div
            className="relative overflow-hidden rounded-xl"
            style={{ height: `${rowHeight}px` }}
          >
            {/* Enhanced Gradient Overlays */}
            <div
              className="absolute inset-y-0 left-0 w-32 md:w-48 z-30 pointer-events-none"
              aria-hidden
            >
              <div className="h-full w-full bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
            </div>

            <div
              className="absolute inset-y-0 right-0 w-32 md:w-48 z-30 pointer-events-none"
              aria-hidden
            >
              <div className="h-full w-full bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
            </div>

            {/* Marquee Content */}
            <div
              className="flex animate-marquee-reverse-smooth whitespace-nowrap will-change-transform hover:animation-paused"
              style={{
                animationDuration: `${speed + 8}s`,
              }}
            >
              {doubled.map((src, i) => (
                <div
                  key={`r2l-${i}`}
                  className="inline-flex items-center justify-center mr-6 md:mr-8 flex-shrink-0 group relative"
                  style={{
                    height: `${rowHeight - 16}px`,
                    width: `${Math.min(rowHeight * (16 / 9), 280)}px`,
                  }}
                >
                  {/* Image Container with Hover Effect */}
                  <div className="relative h-full w-full overflow-hidden rounded-lg shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-yellow-500/20">
                    <img
                      src={src}
                      alt="Cinema experience"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      aria-hidden
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Hover Instruction */}
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm font-medium flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Hover to pause & explore
              </p>
            </div>
          </div>
        </div>

        {/* Experience Labels */}
        <div className="mt-8 md:mt-12">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {[
              { name: 'IMAX', color: 'from-blue-500 to-cyan-400' },
              { name: '4DX', color: 'from-purple-500 to-pink-500' },
              { name: 'Dolby Atmos', color: 'from-green-500 to-emerald-400' },
              { name: 'VIP', color: 'from-yellow-500 to-orange-500' },
              { name: '3D', color: 'from-red-500 to-pink-500' },
            ].map((format, index) => (
              <div
                key={format.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700"
              >
                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${format.color}`}
                />
                <span className="text-white text-sm font-medium">
                  {format.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes marquee-smooth {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-reverse-smooth {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee-smooth {
          animation: marquee-smooth var(--marquee-duration, 30s) linear infinite;
        }

        .animate-marquee-reverse-smooth {
          animation: marquee-reverse-smooth var(--marquee-duration, 38s) linear
            infinite;
        }

        .hover\:animation-paused:hover {
          animation-play-state: paused;
        }

        .text-gradient {
          background: linear-gradient(135deg, #d32f2f 0%, #ff5252 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Smooth performance optimizations */
        .will-change-transform {
          will-change: transform;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-smooth,
          .animate-marquee-reverse-smooth {
            animation: none;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          .animate-marquee-smooth {
            animation-duration: 20s !important;
          }
          .animate-marquee-reverse-smooth {
            animation-duration: 25s !important;
          }
        }
      `}</style>
    </section>
  )
}
