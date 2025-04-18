import { Suspense } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/video-player"
import { fetchMovieDetails, fetchSimilarMovies } from "@/lib/tmdb"
import { MovieCarousel } from "@/components/movie-carousel"

export default async function WatchPage({ params }) {
  const { id } = params
  const movie = await fetchMovieDetails(id)
  const similarMovies = await fetchSimilarMovies(id)

  // Get trailer key if available
  const trailer = movie.videos?.results?.find((video) => video.type === "Trailer" && video.site === "YouTube")

  const trailerKey = trailer?.key || "dQw4w9WgXcQ" // Fallback video

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/movie/${id}`} className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to movie details
        </Link>

        <h1 className="text-2xl md:text-3xl font-bold mb-4">{movie.title}</h1>

        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 mb-8">
          <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Loading player...</div>}>
            <VideoPlayer trailerKey={trailerKey} />
          </Suspense>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-2">About this movie</h2>
              <p className="text-gray-300">{movie.overview}</p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Streaming Options</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Standard Streaming</h3>
                    <p className="text-sm text-gray-400">720p quality</p>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Watch
                  </Button>
                </div>
                <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Premium Streaming</h3>
                    <p className="text-sm text-gray-400">1080p quality</p>
                  </div>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Watch
                  </Button>
                </div>
                <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">4K Ultra HD</h3>
                    <p className="text-sm text-gray-400">Premium members only</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-purple-500 hover:bg-purple-950/50">
                    Upgrade
                  </Button>
                </div>
                <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Download & Watch</h3>
                    <p className="text-sm text-gray-400">Watch offline</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-purple-500 hover:bg-purple-950/50">
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Movie Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Release Date</p>
                  <p>{movie.release_date}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Runtime</p>
                  <p>{movie.runtime} minutes</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Genres</p>
                  <p>{movie.genres.map((g) => g.name).join(", ")}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Rating</p>
                  <p>
                    {movie.vote_average?.toFixed(1)}/10 ({movie.vote_count} votes)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Streaming Quality</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto</span>
                  <span className="text-purple-500">Selected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>4K UHD</span>
                  <span className="text-gray-400">Premium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>1080p</span>
                  <span className="text-gray-400">Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>720p</span>
                  <span className="text-gray-400">Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>480p</span>
                  <span className="text-gray-400">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More Like This</h2>
          <MovieCarousel movies={similarMovies} />
        </section>
      </div>
    </div>
  )
}
