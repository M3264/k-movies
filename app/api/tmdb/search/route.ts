import { NextResponse } from "next/server"

const BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
  }

  try {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB API key is not defined")
    }

    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(
        query,
      )}&page=1&include_adult=false`,
      { next: { revalidate: 3600 } },
    )

    if (!response.ok) {
      throw new Error(`Failed to search movies for query: ${query}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error searching movies for query: ${query}:`, error)
    return NextResponse.json({ error: `Failed to search movies for query: ${query}` }, { status: 500 })
  }
}
