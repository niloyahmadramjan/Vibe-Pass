import React from 'react'

export default function home() {
  return (
    <section className="bg-bgLight min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient">🎬 Vibe Pass</h1>
        <p className="text-textDark mt-2">
          Book your movie tickets anytime, anywhere!
        </p>
        <button className="btn-primary mt-4">Get Tickets</button>
      </div>
    </section>
  )
}
