import Image from "next/image"
import { BookOpen, Clock, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/shoppage/ui/card"
import { Badge } from "@/app/shoppage/ui/badge"
import { Button } from "@/app/shoppage/ui/button"
import { PurchaseDialog } from "@/app/shoppage/shop/purchase-dialog"
import type { Article } from "@/app/shoppage/lib/shop-data"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card key={article.id} className="overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg border border-gray-200 bg-white">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          fill
          className="object-cover transition-all duration-300 hover:opacity-80"
        />
        {article.featured && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-sky-800 to-sky-500 text-white shadow-lg px-3 py-1 rounded-full font-semibold">
            Featured
          </Badge>
        )}
      </div>

      {/* Card Header Section */}
      <CardHeader className="py-4 px-6">
        <CardTitle className="text-2xl font-semibold text-black font-serif">{article.title}</CardTitle>
        <CardDescription className="text-md text-gray-700 font-medium">{article.author}</CardDescription>
      </CardHeader>

      {/* Card Content Section */}
      <CardContent className="px-6 py-4">
        <p className="text-sm text-gray-700 line-clamp-3">{article.description}</p>
        <div className="flex items-center mt-4 text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-black" />
          <span>{article.readTime} min read</span>
        </div>
      </CardContent>

      {/* Card Footer Section */}
      <CardFooter className="flex justify-between items-center py-4 px-6 bg-white rounded-b-lg">
        {/* Credits */}
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 mr-1 text-black" />
          <span className="font-semibold text-black">{article.credits} credits</span>
        </div>

        {/* Purchase Button */}
        <div className="flex items-center">
          <PurchaseDialog
            title={`Purchase "${article.title}"`}
            description="Unlock this premium article to enhance your writing skills."
            credits={article.credits}
            itemType="article"
          >
            <Button
              size="sm"
              className="bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-1000 text-white font-semibold py-2 px-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-2 text-white" />
              Unlock Article
            </Button>
          </PurchaseDialog>
        </div>
      </CardFooter>
    </Card>
  )
}

