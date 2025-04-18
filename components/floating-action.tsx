"use client"

import { useState } from "react"
import { Plus, Film, Heart, Download, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingAction() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-2 transition-all duration-300 ease-in-out">
            <Button
              size="icon"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              <Film className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              <Download className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              <Play className="h-5 w-5" />
            </Button>
          </div>
        )}

        <Button
          size="icon"
          className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg transition-all duration-300 ${isOpen ? "rotate-45" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}
