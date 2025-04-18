'use client'


// export const dynamic = "force-dynamic"

import React, { useEffect, useState } from "react"
import { MovieCarousel } from "@/components/movie-carousel"
import { HeroSection } from "@/components/hero-section"
import { fetchTrendingMovies, fetchTopRatedMovies, fetchGenres } from "@/lib/tmdb"
import { FloatingAction } from "@/components/floating-action"

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendingData = await fetchTrendingMovies()
        const topRatedData = await fetchTopRatedMovies()
        const genresData = await fetchGenres()

        setTrendingMovies(trendingData)
        setTopRatedMovies(topRatedData)
        setGenres(genresData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div> // Or a loading spinner
  }

  const featuredMovie = trendingMovies[0]

  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        <HeroSection movie={featuredMovie} />

        <div className="container mx-auto px-4 py-12 space-y-16">
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-fuchsia-500 mr-3"></span>
              Trending Now
            </h2>
            <MovieCarousel movies={trendingMovies} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 mr-3"></span>
              Top Rated
            </h2>
            <MovieCarousel movies={topRatedMovies} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-1 h-8 bg-gradient-to-b from-pink-500 to-rose-500 mr-3"></span>
              Browse by Genre
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.id}`}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-lg backdrop-blur-sm border border-gray-800 hover:border-purple-500 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] text-center group"
                >
                  <div className="relative overflow-hidden">
                    <span className="relative z-10 group-hover:text-white transition-colors">{genre.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 -translate-y-full group-hover:translate-y-0 transition-all duration-300"></div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 K-Movies. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <FloatingAction />
    </div>
  )
}
