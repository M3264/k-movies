import { NextResponse } from "next/server"

const BASE_URL = "https://api.themoviedb.org/3"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    if (!process.env.TMDB_API_KEY) {
      throw new Error("TMDB API key is not defined")
    }

    const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch movie credits for ID: ${id}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error fetching movie credits for ID: ${id}:`, error)
    return NextResponse.json({ error: `Failed to fetch movie credits for ID: ${id}` }, { status: 500 })
  }
}
