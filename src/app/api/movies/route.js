// app/api/movies/route.js
import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function GET() {
  try {
    const [nowShowingRes, upcomingRes, trendingRes] = await Promise.all([
      fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`),
      fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`),
      fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=en-US`),
    ]);

    const [nowShowing, upcoming, trending] = await Promise.all([
      nowShowingRes.json(),
      upcomingRes.json(),
      trendingRes.json(),
    ]);

    return NextResponse.json({
      nowShowing: nowShowing.results.map((m) => ({
        id: m.id,
        title: m.title,
        poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      })),
      upcoming: upcoming.results.map((m) => ({
        id: m.id,
        title: m.title,
        poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      })),
      trending: trending.results.map((m) => ({
        id: m.id,
        title: m.title,
        poster: `https://image.tmdb.org/t/p/w500${m.poster_path}`,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
