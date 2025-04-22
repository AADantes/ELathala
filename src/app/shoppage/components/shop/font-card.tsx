import { Type, Zap, CreditCard } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PurchaseDialog } from "@/components/shop/purchase-dialog"
import type { Font } from "@/lib/shop-data"

interface FontCardProps {
  font: Font
}

export function FontCard({ font }: FontCardProps) {
  return (
    <Card
      key={font.id}
      className="hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
    >
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-semibold">{font.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground italic">
          {font.style}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-4">
        <div
          className="h-32 flex items-center justify-center border rounded-md p-6 mb-6 bg-gray-50"
          style={{ fontFamily: font.previewFontFamily }}
        >
          <p className="text-xl font-medium text-center text-gray-700">
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 mr-2 text-primary" />
            <span>{font.weights} weights</span>
          </div>
          {font.ligatures && (
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              <span>Ligatures</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center py-4 border-t bg-white rounded-b-lg px-4">
        <div className="flex items-center gap-2 text-black font-semibold">
          <CreditCard className="h-4 w-4 text-black" />
          <span>{font.credits} credits</span>
        </div>

        <PurchaseDialog
          title={`Purchase ${font.name} Font`}
          description="Add this premium font to your writing toolkit."
          credits={font.credits}
          itemType="font"
        >
          <Button
            size="sm"
            className="bg-gradient-to-r from-sky-700 to-sky-900 text-white rounded-full px-4 py-2 shadow-xl hover:brightness-110 transition-all flex items-center space-x-2"
          >
            <Type className="h-4 w-4" />
            <span>Unlock Font</span>
          </Button>
        </PurchaseDialog>
      </CardFooter>
    </Card>
  )
}
