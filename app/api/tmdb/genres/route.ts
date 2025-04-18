import { NextResponse } from "next/server"

const BASE_URL = "https://api.themoviedb.org/3"

export async function GET() {
  try {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB API key is not defined")
    }

    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    )

    if (!response.ok) {
      throw new Error("Failed to fetch genres")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching genres:", error)
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 })
  }
}
