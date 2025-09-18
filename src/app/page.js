// not allow to write code here

import React from 'react'
import Hero from './components/Hero'
import MovieCard from './components/MovieCard'

export default function home() {
  return (
    <main className='max-w-7xl mx-auto'>
      <Hero />
      <MovieCard />
    </main>
  )
}
