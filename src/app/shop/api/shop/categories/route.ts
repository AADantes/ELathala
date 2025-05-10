import { NextResponse } from "next/server"

// BACKEND INTEGRATION POINT:
// This is where you would connect to your database to fetch categories
export async function GET() {
  // Mock data for now
  const categories = [
    { id: "fonts", name: "Custom Fonts" },
    { id: "upgrades", name: "Upgrades" },
  ]

  return NextResponse.json(categories)
}

// Add a new category (admin only)
export async function POST(request: Request) {
  // BACKEND INTEGRATION POINT:
  // 1. Authenticate that the user is an admin
  // 2. Validate the request body
  // 3. Add the new category to the database

  const body = await request.json()

  // Mock response
  return NextResponse.json({ success: true, id: "new-category-id" })
}
