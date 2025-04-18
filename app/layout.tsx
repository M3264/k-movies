import { Inter } from "next/font/google"
import { Navbar } from "@/components/navbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "K-Movies - Your Ultimate Movie Destination",
  description: "Discover, stream, and download your favorite movies with K-Movies",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <Navbar />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  )
}
