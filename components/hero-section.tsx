import Image from "next/image"
import Link from "next/link"
import { Play, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection({ movie }) {
  const backdropPath = movie.backdrop_path
  const posterPath = movie.poster_path

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Backdrop image with gradient overlay */}
      <div className="absolute inset-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${backdropPath}`}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="col-span-2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{movie.title}</h1>

            <div className="flex items-center gap-4 text-sm">
              <span className="px-2 py-1 bg-purple-500/20 border border-purple-500 rounded-md">
                {movie.release_date?.split("-")[0]}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span> {movie.vote_average?.toFixed(1)}
              </span>
              <span>{movie.original_language?.toUpperCase()}</span>
            </div>

            <p className="text-gray-300 max-w-xl line-clamp-3">{movie.overview}</p>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Play className="mr-2 h-4 w-4" /> Watch Trailer
              </Button>
              <Button variant="outline" className="border-purple-500 text-white hover:bg-purple-950/50">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
              <Link href={`/movie/${movie.id}`}>
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  View Details
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="relative aspect-[2/3] w-full max-w-[300px] mx-auto transform hover:scale-105 transition-transform duration-300 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <Image
                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
