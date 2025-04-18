import { NextResponse } from "next/server"

const BASE_URL = "https://api.themoviedb.org/3"

export async function GET() {
  try {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB API key is not defined")
    }

    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`,
      {
        next: { revalidate: 3600 },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch top rated movies")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching top rated movies:", error)
    return NextResponse.json({ error: "Failed to fetch top rated movies" }, { status: 500 })
  }
}
