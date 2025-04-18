"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || pathname !== "/"
          ? "bg-black/90 backdrop-blur-md border-b border-gray-800"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 bg-purple-600 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Film className="w-5 h-5 text-white" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              K-Movies
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-white hover:text-purple-400 transition-colors ${
                pathname === "/" ? "text-purple-400 font-medium" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/movies"
              className={`text-white hover:text-purple-400 transition-colors ${
                pathname === "/movies" ? "text-purple-400 font-medium" : ""
              }`}
            >
              Movies
            </Link>
            <Link
              href="/genres"
              className={`text-white hover:text-purple-400 transition-colors ${
                pathname === "/genres" ? "text-purple-400 font-medium" : ""
              }`}
            >
              Genres
            </Link>
            <Link
              href="/trending"
              className={`text-white hover:text-purple-400 transition-colors ${
                pathname === "/trending" ? "text-purple-400 font-medium" : ""
              }`}
            >
              Trending
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <SearchBar />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Film className="mr-2 h-4 w-4" />
                  <span>Watchlist</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <SearchBar />
            <nav className="flex flex-col space-y-4 mt-4">
              <Link
                href="/"
                className={`text-white hover:text-purple-400 transition-colors ${
                  pathname === "/" ? "text-purple-400 font-medium" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={`text-white hover:text-purple-400 transition-colors ${
                  pathname === "/movies" ? "text-purple-400 font-medium" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link
                href="/genres"
                className={`text-white hover:text-purple-400 transition-colors ${
                  pathname === "/genres" ? "text-purple-400 font-medium" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Genres
              </Link>
              <Link
                href="/trending"
                className={`text-white hover:text-purple-400 transition-colors ${
                  pathname === "/trending" ? "text-purple-400 font-medium" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trending
              </Link>
              <div className="pt-2 border-t border-gray-800">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
