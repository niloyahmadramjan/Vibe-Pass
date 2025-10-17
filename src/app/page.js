// not allow to write code here

import React from "react";
import MovieCard from "./components/MovieCard";
import Hero from "./components/Hero";
import KidsMovies from "./components/KidsMovies";
import UpcomingMovie from "./components/UpcomingMovie";
import FAQ from "./components/FAQ";
import MovieExperienceSection from "./components/Experience";
import LoyaltyRewards from "./components/LoyaltyRewards";
import NewsLetter from "./components/NewsLetter";
import UpcomingEvent from "./components/UpcomingEvent";
import NearbyHome from "./components/NearbyHome";

export default function home() {
  return (
    <main>
      <Hero />
      <MovieCard />
      <KidsMovies />
      <UpcomingMovie />
      <MovieExperienceSection />
      <LoyaltyRewards />
      <UpcomingEvent />
      {/* <NearbyHome /> */}
      <NewsLetter />
      <FAQ />
    </main>
  );
}
