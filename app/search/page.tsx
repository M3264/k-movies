import { MovieGrid } from "@/components/movie-grid"
import { searchMovies } from "@/lib/tmdb"

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || ""
  const results = query ? await searchMovies(query) : []

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">
          Search Results for: <span className="text-purple-500">{query}</span>
        </h1>

        {results.length > 0 ? (
          <MovieGrid movies={results} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">No results found</h2>
            <p className="text-gray-400">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  )
}
