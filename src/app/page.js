// not allow to write code here

import React from 'react'
import MovieCard from './components/MovieCard'
import Hero from './components/Hero'
import KidsMovies from './components/KidsMovies'
import UpcomingMovie from './components/UpcomingMovie'
import FAQ from './components/FAQ'

export default function home() {
  return (
    <main>
      <Hero />
      <MovieCard />
      <KidsMovies />
      <UpcomingMovie></UpcomingMovie>
      <FAQ />
    </main>
  )
}
