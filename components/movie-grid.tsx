import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

export function MovieGrid({ movies, title }) {
  return (
    <section>
      {title && (
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="w-1 h-8 bg-purple-500 mr-3"></span>
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movie/${movie.id}`}>
            <div className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 border border-gray-800 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <div className="relative aspect-[2/3]">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-yellow-500 text-xs px-2 py-1 rounded-md flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                  {movie.vote_average?.toFixed(1)}
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-1">{movie.title}</h3>
                <p className="text-xs text-gray-400">{movie.release_date?.split("-")[0]}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
