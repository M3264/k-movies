// TMDB API functions that use our backend API routes
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://v0-k-movies-website-design.vercel.app"

// Fetch trending movies
export async function fetchTrendingMovies() {
  const response = await fetch(`${BASE_URL}/api/tmdb/trending`)

  if (!response.ok) {
    throw new Error("Failed to fetch trending movies")
  }

  const data = await response.json()
  return data.results
}

// Fetch top rated movies
export async function fetchTopRatedMovies() {
  const response = await fetch(`${BASE_URL}/api/tmdb/top-rated`)

  if (!response.ok) {
    throw new Error("Failed to fetch top rated movies")
  }

  const data = await response.json()
  return data.results
}

// Fetch movie genres
export async function fetchGenres() {
  const response = await fetch(`${BASE_URL}/api/tmdb/genres`)

  if (!response.ok) {
    throw new Error("Failed to fetch genres")
  }

  const data = await response.json()
  return data.genres
}

// Fetch movie details
export async function fetchMovieDetails(id) {
  const response = await fetch(`/api/tmdb/movie/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details for ID: ${id}`)
  }

  return response.json()
}

// Fetch similar movies
export async function fetchSimilarMovies(id) {
  const response = await fetch(`/api/tmdb/movie/${id}/similar`)

  if (!response.ok) {
    throw new Error(`Failed to fetch similar movies for ID: ${id}`)
  }

  const data = await response.json()
  return data.results
}

// Fetch movie credits
export async function fetchMovieCredits(id) {
  const response = await fetch(`/api/tmdb/movie/${id}/credits`)

  if (!response.ok) {
    throw new Error(`Failed to fetch movie credits for ID: ${id}`)
  }

  return response.json()
}

// Search movies
export async function searchMovies(query) {
  const response = await fetch(`/api/tmdb/search?q=${encodeURIComponent(query)}`)

  if (!response.ok) {
    throw new Error(`Failed to search movies for query: ${query}`)
  }

  const data = await response.json()
  return data.results
}

// Fetch movies by genre
export async function fetchMoviesByGenre(genreId) {
  const response = await fetch(`/api/tmdb/genre/${genreId}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch movies for genre ID: ${genreId}`)
  }

  const data = await response.json()
  return data.results
}
