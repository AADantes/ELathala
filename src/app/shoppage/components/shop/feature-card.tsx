import { Paintbrush, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PurchaseDialog } from "@/components/shop/purchase-dialog"
import type { CustomizationFeature } from "@/lib/shop-data"

interface FeatureCardProps {
  feature: CustomizationFeature
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card key={feature.id} className="overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg border border-gray-200 bg-white">
      {/* Card Header Section */}
      <CardHeader className="py-4 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold text-black font-serif">{feature.name}</CardTitle>
          {feature.icon}
        </div>
        <CardDescription className="text-md text-gray-700 font-medium">{feature.category}</CardDescription>
      </CardHeader>

      {/* Card Content Section */}
      <CardContent className="px-6 py-4">
        <p className="text-sm text-gray-700 line-clamp-3">{feature.description}</p>
        {feature.popular && (
          <Badge variant="secondary" className="mb-2">
            Popular Choice
          </Badge>
        )}
      </CardContent>

      {/* Card Footer Section */}
      <CardFooter className="flex justify-between items-center py-4 px-6 bg-white rounded-b-lg">
        {/* Credits */}
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 mr-1 text-black" />
          <span className="font-semibold text-black">{feature.credits} credits</span>
        </div>

        {/* Purchase Button */}
        <div className="flex items-center">
          <PurchaseDialog
            title={`Unlock ${feature.name}`}
            description={feature.description}
            credits={feature.credits}
            itemType="feature"
          >
            <Button
              size="sm"
              className="bg-gradient-to-r from-sky-700 to-sky-900 hover:from-sky-800 hover:to-sky-1000 text-white font-semibold py-2 px-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center"
            >
              <Paintbrush className="h-4 w-4 mr-2 text-white" />
              Unlock Feature
            </Button>
          </PurchaseDialog>
        </div>
      </CardFooter>
    </Card>
  )
}
