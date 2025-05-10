"use client"
import Image from "next/image"
import type { ShopItem } from "../../types/shop-types"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "..//ui/card"
import { useEffect, useState } from "react"
import supabase from "config/supabaseClient"

interface ProfilePicturesDisplayProps {
  onPurchase: (item: ShopItem) => void
}

export default function ProfilePicturesDisplay({ onPurchase }: ProfilePicturesDisplayProps) {
  // // BACKEND INTEGRATION POINT:
  // // Fetch profile pictures from backend
  // const [profilePictures, setProfilePictures] = useState<ShopItem[]>([])
  // useEffect(() => {
  //   const fetchProfilePictures = async () => {
  //     const response = await fetch('/api/shop/profile-pictures')
  //     const data = await response.json()
  //     setProfilePictures(data)
  //   }
  //   fetchProfilePictures()
  // }, [])

  // For now, using mock data

  
  const profilePictures: ShopItem[] = [
    {
      id: "1",
      name: "Abstract Art",
      price: 200,
      description: "Colorful abstract design",
      previewUrl: "https://ueagmtscbdirqgbjxaqb.supabase.co/storage/v1/object/public/profile-pics//dp-1.jpg",
    },
    {
      id: "2",
      name: "Pixel Avatar",
      price: 180,
      description: "Retro pixel art style",
      previewUrl: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "3",
      name: "Minimalist",
      price: 150,
      description: "Clean and simple design",
      previewUrl: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "4",
      name: "Neon Glow",
      price: 250,
      description: "Vibrant neon-styled avatar",
      previewUrl: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "5",
      name: "Vintage",
      price: 220,
      description: "Classic vintage look",
      previewUrl: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "6",
      name: "Geometric",
      price: 190,
      description: "Modern geometric patterns",
      previewUrl: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Profile Pictures</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profilePictures.map((picture) => (
          <Card key={picture.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{picture.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="relative h-48 w-full mb-4 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={picture.previewUrl || "/placeholder.svg"}
                  alt={picture.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-gray-500">{picture.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 pt-0">
              <span className="font-medium">{picture.price} Credits</span>
              <Button variant="outline" onClick={() => onPurchase(picture)}>
                Purchase
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
