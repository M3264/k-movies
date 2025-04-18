// OMDB API functions that use our backend API routes

// Get movie details from OMDB using IMDB ID
export async function getMovieDetails(imdbId) {
  if (!imdbId) return null

  const response = await fetch(`/api/omdb/movie?imdbId=${imdbId}`)

  if (!response.ok) {
    console.error(`Failed to fetch OMDB details for IMDB ID: ${imdbId}`)
    return null
  }

  return response.json()
}
