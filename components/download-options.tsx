"use client"

import { useState } from "react"
import { Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DownloadOptions({ movie }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedQuality, setSelectedQuality] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadComplete, setDownloadComplete] = useState(false)

  const qualities = [
    { id: "4k", label: "4K UHD", size: "8.5 GB", available: true },
    { id: "1080p", label: "Full HD (1080p)", size: "2.3 GB", available: true },
    { id: "720p", label: "HD (720p)", size: "1.1 GB", available: true },
    { id: "480p", label: "SD (480p)", size: "700 MB", available: true },
  ]

  const handleDownload = (quality) => {
    setSelectedQuality(quality)
    setIsDownloading(true)

    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false)
      setDownloadComplete(true)

      // Reset after a few seconds
      setTimeout(() => {
        setDownloadComplete(false)
        setSelectedQuality(null)
        setIsOpen(false)
      }, 3000)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-purple-500 text-white hover:bg-purple-950/50">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Download "{movie.title}"</DialogTitle>
          <DialogDescription className="text-gray-400">
            Select your preferred quality to download this movie.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {qualities.map((quality) => (
            <div
              key={quality.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                selectedQuality?.id === quality.id
                  ? "border-purple-500 bg-purple-900/20"
                  : "border-gray-700 hover:border-gray-600"
              } cursor-pointer transition-colors`}
              onClick={() => quality.available && handleDownload(quality)}
            >
              <div className="flex items-center gap-3">
                {selectedQuality?.id === quality.id ? (
                  isDownloading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
                  ) : downloadComplete ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-purple-500"></div>
                  )
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                )}
                <div>
                  <p className="font-medium">{quality.label}</p>
                  <p className="text-sm text-gray-400">{quality.size}</p>
                </div>
              </div>

              {!quality.available && <span className="text-sm text-gray-500">Unavailable</span>}
            </div>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-400">
          <p>By downloading, you agree to our Terms of Service.</p>
          <p className="mt-1">Files are provided for personal use only.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
