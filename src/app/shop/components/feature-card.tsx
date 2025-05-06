
"use client";

import { Paintbrush, CreditCard } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/shop/ui/card"
import { Badge } from "@/app/shop/ui/badge"
import { Button } from "@/app/shop/ui/button"
import { PurchaseDialog } from "@/app/shop/components/purchase-dialog"
import type { CustomizationFeature } from "@/app/shop/lib/shop-data"
interface FeatureCardProps {
  feature: CustomizationFeature
}

interface FeatureCardProps {
  feature: CustomizationFeature
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card key={feature.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{feature.name}</CardTitle>
          {feature.icon}
        </div>
        <CardDescription>{feature.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
        {feature.popular && (
          <Badge variant="secondary" className="mb-2">
            Popular Choice
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 mr-1 text-primary" />
          <span className="font-bold">{feature.credits} credits</span>
        </div>
        <PurchaseDialog
          title={`Unlock ${feature.name}`}
          description={feature.description}
          credits={feature.credits}
          itemType="feature"
        >
          <Button size="sm">
            <Paintbrush className="h-4 w-4 mr-2" />
            Unlock Feature
          </Button>
        </PurchaseDialog>
      </CardFooter>
    </Card>
  )
}
