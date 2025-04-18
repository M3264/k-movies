import { NextResponse } from "next/server"

const BASE_URL = "https://api.themoviedb.org/3"

export async function GET() {
  try {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB API key is not defined")
    }

    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("TMDB API error:", errorData)
      throw new Error(`Failed to fetch trending movies: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching trending movies:", error)
    return NextResponse.json({ error: "Failed to fetch trending movies", details: error.message }, { status: 500 })
  }
}
