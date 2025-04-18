// Client-side Firebase utilities using localStorage
// This file is safe to import in client components

// Helper function to get all reviews from localStorage
export function getClientReviews(movieId: string) {
  if (typeof window === "undefined") return []

  try {
    const reviews = localStorage.getItem("k-movies-reviews")
    const allReviews = reviews ? JSON.parse(reviews) : []

    return allReviews
      .filter((review: any) => review.movieId === movieId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error getting reviews from localStorage:", error)
    return []
  }
}

// Helper function to add a review to localStorage
export function addClientReview(review: any) {
  if (typeof window === "undefined") return null

  try {
    const reviews = localStorage.getItem("k-movies-reviews")
    const allReviews = reviews ? JSON.parse(reviews) : []

    const newReview = {
      ...review,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    allReviews.push(newReview)
    localStorage.setItem("k-movies-reviews", JSON.stringify(allReviews))

    return newReview
  } catch (error) {
    console.error("Error adding review to localStorage:", error)
    return null
  }
}

// Initialize with sample reviews in client-side localStorage
if (typeof window !== "undefined" && !localStorage.getItem("k-movies-reviews")) {
  const sampleReviews = [
    {
      id: "sample-1",
      movieId: "278", // Shawshank Redemption
      name: "John Doe",
      content: "One of the best movies ever made. The story, acting, and direction are all perfect.",
      rating: 5,
      likes: 42,
      createdAt: new Date(2023, 5, 15).toISOString(),
      comments: [
        {
          id: "comment-1",
          name: "Jane Smith",
          content: "I completely agree! I watch it every year.",
          createdAt: new Date(2023, 5, 16).toISOString(),
        },
      ],
    },
    {
      id: "sample-2",
      movieId: "278",
      name: "Alice Johnson",
      content:
        "A masterpiece that stands the test of time. Morgan Freeman and Tim Robbins deliver incredible performances.",
      rating: 5,
      likes: 28,
      createdAt: new Date(2023, 4, 20).toISOString(),
      comments: [],
    },
  ]

  localStorage.setItem("k-movies-reviews", JSON.stringify(sampleReviews))
}
