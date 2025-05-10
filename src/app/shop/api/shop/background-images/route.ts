import { NextResponse } from "next/server"

// BACKEND INTEGRATION POINT:
// This is where you would connect to your database to fetch background images
export async function GET() {
  // Mock data for now
  const backgroundImages = [
    {
      id: "bg1",
      name: "Abstract Waves",
      price: 300,
      description: "Colorful abstract wave patterns",
      previewUrl: "/placeholder.svg?height=300&width=600",
    },
    {
      id: "bg2",
      name: "Mountain Landscape",
      price: 350,
      description: "Serene mountain view with lake",
      previewUrl: "/placeholder.svg?height=300&width=600",
    },
    // Add more background images here
  ]

  return NextResponse.json(backgroundImages)
}
