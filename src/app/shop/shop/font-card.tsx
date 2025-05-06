"use client";

import { Type, Zap, CreditCard } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/shop/ui/card"
import { Button } from "@/app/shop/ui/button"
import { PurchaseDialog } from "@/app/shop/shop/purchase-dialog"
import type { Font } from "@/app/shop/lib/shop-data"

interface FontCardProps {
  font: Font
}

export function FontCard({ font }: FontCardProps) {
  return (
    <Card key={font.id}>
      <CardHeader>
        <CardTitle>{font.name}</CardTitle>
        <CardDescription>{font.style}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="h-24 flex items-center justify-center border rounded-md p-4 mb-4"
          style={{ fontFamily: font.previewFontFamily }}
        >
          <p className="text-xl">The quick brown fox jumps over the lazy dog</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Type className="h-4 w-4 mr-1" />
            <span>{font.weights} weights</span>
          </div>
          {font.ligatures && (
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              <span>Ligatures</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 mr-1 text-primary" />
          <span className="font-bold">{font.credits} credits</span>
        </div>
        <PurchaseDialog
          title={`Purchase ${font.name} Font`}
          description="Add this premium font to your writing toolkit."
          credits={font.credits}
          itemType="font"
        >
          <Button size="sm">
            <Type className="h-4 w-4 mr-2" />
            Buy Font
          </Button>
        </PurchaseDialog>
      </CardFooter>
    </Card>
  )
}

