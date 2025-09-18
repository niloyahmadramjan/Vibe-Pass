// not allow to write code here

import React from 'react'
import MovieCard from './components/MovieCard'
import Hero from './components/Hero'
import ChildAndFamily from './components/ChildAndFamily'

export default function home() {
  return (
    <main>
      <Hero/>
     <MovieCard/>
     <ChildAndFamily/>
    </main>
  )
}
