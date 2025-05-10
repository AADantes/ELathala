"use client"
import { useState } from "react"
import { Coins, Award } from "lucide-react"
import type { ShopItem } from "../../types/shop-types"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"

interface UpgradesDisplayProps {
  onPurchase: (item: ShopItem) => void
}

export default function UpgradesDisplay({ onPurchase }: UpgradesDisplayProps) {
  // In a real application, you would fetch the current multiplier levels from the backend
  const [creditMultiplier, setCreditMultiplier] = useState(1.5)
  const [expMultiplier, setExpMultiplier] = useState(1.0)

  // Mock data for upgrades
  const upgrades: ShopItem[] = [
    {
      id: "credit-multiplier",
      name: "Credit Multiplier Upgrade",
      price: 500,
      description: `Increase your credit earnings by upgrading your multiplier. Current: ${creditMultiplier}x`,
      previewUrl: "",
      type: "credit-multiplier",
      currentLevel: creditMultiplier,
      nextLevel: creditMultiplier + 0.5,
    },
    {
      id: "exp-multiplier",
      name: "Experience Multiplier Upgrade",
      price: 750,
      description: `Increase your experience earnings by upgrading your multiplier. Current: ${expMultiplier}x`,
      previewUrl: "",
      type: "exp-multiplier",
      currentLevel: expMultiplier,
      nextLevel: expMultiplier + 0.5,
    },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upgrades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Credit Multiplier</CardTitle>
              <Coins className="h-6 w-6 text-yellow-500" />
            </div>
            <CardDescription>Increase your credit earnings from all sources</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Current Multiplier</span>
                <span className="text-lg font-bold">{creditMultiplier}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Next Level</span>
                <span className="text-lg font-bold">{creditMultiplier + 0.5}x</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-yellow-500 h-2.5 rounded-full"
                  style={{ width: `${(creditMultiplier / 5) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>1.0x</span>
                <span>5.0x</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-2">
            <div className="font-bold">{upgrades[0].price} Credits</div>
            <Button onClick={() => onPurchase(upgrades[0])}>Upgrade</Button>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Experience Multiplier</CardTitle>
              <Award className="h-6 w-6 text-purple-500" />
            </div>
            <CardDescription>Increase your experience points from all activities</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Current Multiplier</span>
                <span className="text-lg font-bold">{expMultiplier}x</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Next Level</span>
                <span className="text-lg font-bold">{expMultiplier + 0.5}x</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-500 h-2.5 rounded-full"
                  style={{ width: `${(expMultiplier / 5) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>1.0x</span>
                <span>5.0x</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center pt-2">
            <div className="font-bold">{upgrades[1].price} Credits</div>
            <Button onClick={() => onPurchase(upgrades[1])}>Upgrade</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
