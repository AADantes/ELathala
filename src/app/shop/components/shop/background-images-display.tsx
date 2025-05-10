"use client"
import Image from "next/image"
import type { ShopItem } from "../../types/shop-types"
import { Button } from "../ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"

interface BackgroundImagesDisplayProps {
  onPurchase: (item: ShopItem) => void
}

export default function BackgroundImagesDisplay({ onPurchase }: BackgroundImagesDisplayProps) {
  // BACKEND INTEGRATION POINT:
  // Fetch background images from backend
  // const [backgroundImages, setBackgroundImages] = useState<ShopItem[]>([])
  // useEffect(() => {
  //   const fetchBackgroundImages = async () => {
  //     const response = await fetch('/api/shop/background-images')
  //     const data = await response.json()
  //     setBackgroundImages(data)
  //   }
  //   fetchBackgroundImages()
  // }, [])

  // For now, using mock data
  const backgroundImages: ShopItem[] = [
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
    {
      id: "bg3",
      name: "Geometric Patterns",
      price: 280,
      description: "Modern geometric background",
      previewUrl: "/placeholder.svg?height=300&width=600",
    },
    {
      id: "bg4",
      name: "Night Sky",
      price: 320,
      description: "Starry night sky with aurora",
      previewUrl: "/placeholder.svg?height=300&width=600",
    },
    {
      id: "bg5",
      name: "Tropical Beach",
      price: 340,
      description: "Sunny tropical beach scene",
      previewUrl: "/placeholder.svg?height=300&width=600",
    },
    {
      id: "bg6",
      name: "City Skyline",
      price: 310,
      description: "Modern city skyline at sunset",
      previewUrl: "/placeholder.svg?height=300&width=600",
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Background Images</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {backgroundImages.map((background) => (
          <Card key={background.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{background.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="relative h-40 w-full mb-4 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={background.previewUrl || "/placeholder.svg"}
                  alt={background.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-gray-500">{background.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 pt-0">
              <span className="font-medium">{background.price} Credits</span>
              <Button variant="outline" onClick={() => onPurchase(background)}>
                Purchase
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
