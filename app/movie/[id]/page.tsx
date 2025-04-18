import Image from "next/image"
import Link from "next/link"
import { Play, Clock, Calendar, Star, Film, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MovieCarousel } from "@/components/movie-carousel"
import { ReviewsSection } from "@/components/reviews-section"
import { DownloadOptions } from "@/components/download-options"
import { fetchMovieDetails, fetchSimilarMovies, fetchMovieCredits } from "@/lib/tmdb"
import { getMovieDetails } from "@/lib/omdb"

export default async function MoviePage({ params }) {
  const { id } = params
  const movie = await fetchMovieDetails(id)
  const similarMovies = await fetchSimilarMovies(id)
  const credits = await fetchMovieCredits(id)
  const omdbDetails = await getMovieDetails(movie.imdb_id)

  // We'll get reviews from the client side to avoid server/client mismatch
  // with our localStorage implementation
  const initialReviews = []

  // Get director and top cast
  const director = credits.crew.find((person) => person.job === "Director")
  const topCast = credits.cast.slice(0, 5)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Movie Hero Section with Backdrop */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 h-full flex items-end pb-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
            <div className="hidden md:block">
              <div className="relative aspect-[2/3] w-full max-w-[300px] rounded-lg overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-gray-800 group">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{movie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {movie.genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}`}
                    className="px-3 py-1 bg-purple-500/20 border border-purple-500 rounded-full hover:bg-purple-500/30 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>{movie.vote_average?.toFixed(1)}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{movie.runtime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{movie.release_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  <span>{movie.original_language.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href={`/watch/${movie.id}`}>
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    <Play className="mr-2 h-4 w-4" /> Watch Now
                  </Button>
                </Link>
                <DownloadOptions movie={movie} />
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  <Heart className="mr-2 h-4 w-4" /> Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {topCast.map((person) => (
                  <div key={person.id} className="text-center group">
                    <div className="relative aspect-square rounded-full overflow-hidden mb-2 mx-auto w-20 h-20 border border-gray-800 group-hover:border-purple-500 transition-colors">
                      <Image
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                            : "/placeholder.svg?height=200&width=200"
                        }
                        alt={person.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <p className="font-medium text-sm">{person.name}</p>
                    <p className="text-xs text-gray-400">{person.character}</p>
                  </div>
                ))}
              </div>
            </section>

            <ReviewsSection movieId={id} initialReviews={initialReviews} />

            <section>
              <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
              <MovieCarousel movies={similarMovies} />
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Movie Info</h3>

              <div className="space-y-4">
                {director && (
                  <div>
                    <p className="text-gray-400 text-sm">Director</p>
                    <p>{director.name}</p>
                  </div>
                )}

                {omdbDetails?.Writer && (
                  <div>
                    <p className="text-gray-400 text-sm">Writer</p>
                    <p>{omdbDetails.Writer}</p>
                  </div>
                )}

                {omdbDetails?.Production && (
                  <div>
                    <p className="text-gray-400 text-sm">Production</p>
                    <p>{omdbDetails.Production}</p>
                  </div>
                )}

                {omdbDetails?.Country && (
                  <div>
                    <p className="text-gray-400 text-sm">Country</p>
                    <p>{omdbDetails.Country}</p>
                  </div>
                )}

                {omdbDetails?.Awards && (
                  <div>
                    <p className="text-gray-400 text-sm">Awards</p>
                    <p>{omdbDetails.Awards}</p>
                  </div>
                )}

                {omdbDetails?.BoxOffice && (
                  <div>
                    <p className="text-gray-400 text-sm">Box Office</p>
                    <p>{omdbDetails.BoxOffice}</p>
                  </div>
                )}
              </div>
            </div>

            {omdbDetails?.Ratings && omdbDetails.Ratings.length > 0 && (
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-4">Ratings</h3>
                <div className="space-y-4">
                  {omdbDetails.Ratings.map((rating, index) => (
                    <div key={index}>
                      <p className="text-gray-400 text-sm">{rating.Source}</p>
                      <p className="text-lg font-medium">{rating.Value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
