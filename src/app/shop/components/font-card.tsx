'use client';

import { Type, Zap, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/shop/ui/card";
import { Button } from "@/app/shop/ui/button";
import { PurchaseDialog } from "@/app/shop/components/purchase-dialog";
import type { Font } from "@/app/shop/lib/shop-data";

interface FontCardProps {
  font: Font;
}

export function FontCard({ font }: FontCardProps) {
  return (
    <Card
      key={font.id}
      className="transition-shadow hover:shadow-xl border border-muted-foreground/10"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{font.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {font.style}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Font preview box */}
        <div
          className="h-28 bg-gray-50 dark:bg-muted border rounded-md p-4 flex items-center justify-center text-center mb-4"
          style={{ fontFamily: font.previewFontFamily }}
        >
          <p className="text-xl leading-snug">
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        {/* Font details */}
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

      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex items-center text-sm">
          <CreditCard className="h-4 w-4 mr-1 text-primary" />
          <span className="font-semibold">{font.credits} credits</span>
        </div>
        <PurchaseDialog
          title={`Purchase ${font.name} Font`}
          description="Add this premium font to your writing toolkit."
          credits={font.credits}
          itemType="font"
        >
          <Button
            size="sm"
            variant="secondary"
            className="bg-black text-white border border-transparent rounded-md px-5 py-2.5 font-medium shadow-md hover:bg-gray-800 hover:shadow-lg active:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
          >
            <Type className="h-4 w-4 mr-2" />
            Buy Font
          </Button>
        </PurchaseDialog>
      </CardFooter>
    </Card>
  );
}
