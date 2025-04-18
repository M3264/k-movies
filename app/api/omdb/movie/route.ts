import { NextResponse } from "next/server"

const BASE_URL = "https://www.omdbapi.com"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imdbId = searchParams.get("imdbId")

  if (!imdbId) {
    return NextResponse.json({ error: "IMDB ID is required" }, { status: 400 })
  }

  try {
    // For now, we'll keep using the hardcoded key, but ideally this should be an env var too
    const OMDB_API_KEY = "710b1598"

    const response = await fetch(`${BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch OMDB details for IMDB ID: ${imdbId}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error fetching OMDB details for IMDB ID: ${imdbId}:`, error)
    return NextResponse.json({ error: `Failed to fetch OMDB details for IMDB ID: ${imdbId}` }, { status: 500 })
  }
}
