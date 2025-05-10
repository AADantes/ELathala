import { NextResponse } from "next/server"

// BACKEND INTEGRATION POINT:
// This is where you would connect to your database to fetch fonts
export async function GET() {
  // Mock data for now
  const fonts = [
    {
      id: "1",
      name: "Roboto",
      price: 100,
      description: "Clean and modern sans-serif font",
      previewUrl: "https://fonts.google.com/specimen/Roboto",
    },
    {
      id: "2",
      name: "Playfair Display",
      price: 150,
      description: "Elegant serif font with high contrast",
      previewUrl: "https://fonts.google.com/specimen/Playfair+Display",
    },
    // Add more fonts here
  ]

  return NextResponse.json(fonts)
}
