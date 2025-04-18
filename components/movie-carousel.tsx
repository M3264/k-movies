"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star, Play, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function MovieCarousel({ movies }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)
  const [visibleItems, setVisibleItems] = useState(5)

  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(2)
      } else if (window.innerWidth < 1024) {
        setVisibleItems(3)
      } else {
        setVisibleItems(5)
      }
    }

    updateVisibleItems()
    window.addEventListener("resize", updateVisibleItems)
    return () => window.removeEventListener("resize", updateVisibleItems)
  }, [])

  const nextSlide = () => {
    if (currentIndex < movies.length - visibleItems) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className={cn("flex-none w-1/2 sm:w-1/3 lg:w-1/5 p-2 transition-all duration-300")}>
              <Link href={`/movie/${movie.id}`}>
                <div className="bg-gray-900 rounded-lg overflow-hidden h-full hover:scale-105 transition-transform duration-300 border border-gray-800 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] group">
                  <div className="relative aspect-[2/3]">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-2 right-2 bg-black/70 text-yellow-500 text-xs px-2 py-1 rounded-md flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                      {movie.vote_average?.toFixed(1)}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 p-1"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 p-1"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">{movie.title}</h3>
                    <p className="text-xs text-gray-400">{movie.release_date?.split("-")[0]}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={prevSlide}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={nextSlide}
        disabled={currentIndex >= movies.length - visibleItems}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  )
}
