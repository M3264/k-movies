// OMDB API functions that use our backend API route

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://v0-k-movies-website-design.vercel.app"

// Get movie details from OMDB using IMDB ID
export async function getMovieDetails(imdbId) {
  if (!imdbId) return null

  const response = await fetch(`${BASE_URL}/api/omdb/movie?imdbId=${imdbId}`)

  if (!response.ok) {
    console.error(`Failed to fetch OMDB details for IMDB ID: ${imdbId}`)
    return null
  }

  return response.json()
}
