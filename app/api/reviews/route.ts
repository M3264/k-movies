import { NextResponse } from "next/server"
import { getMovieReviews, addReview } from "@/lib/firebase-admin"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const movieId = searchParams.get("movieId")

  if (!movieId) {
    return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
  }

  try {
    const reviews = await getMovieReviews(movieId)
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.movieId || !body.name || !body.content || !body.rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const review = await addReview({
      movieId: body.movieId,
      name: body.name,
      content: body.content,
      rating: body.rating,
      likes: 0,
      comments: [],
    })

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Error adding review:", error)
    return NextResponse.json({ error: "Failed to add review" }, { status: 500 })
  }
}
