import { fetchMoviesByGenre, fetchGenres } from "@/lib/tmdb"
import { MovieGrid } from "@/components/movie-grid"

export default async function GenrePage({ params }) {
  const { id } = params
  const movies = await fetchMoviesByGenre(id)
  const genres = await fetchGenres()

  // Find the genre name
  const genre = genres.find((g) => g.id.toString() === id)
  const genreName = genre ? genre.name : "Genre"

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{genreName} Movies</h1>

        <MovieGrid movies={movies} />
      </div>
    </div>
  )
}
