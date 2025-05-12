"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Coins, Award } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { ShopItem } from "../../types/shop-types"
import supabase from "../../../../../config/supabaseClient"

type UpgradesDisplayProps = {
  onPurchase?: (item: ShopItem) => void
}

export default function UpgradesDisplay({ onPurchase }: UpgradesDisplayProps) {
  const [creditMultiplier, setCreditMultiplier] = useState(1.0)
  const [expMultiplier, setExpMultiplier] = useState(1.0)
  const [userID, setUserID] = useState<string | null>(null)
  const [userCredits, setUserCredits] = useState(0)
  const [loading, setLoading] = useState(true)
  const [creditShopLevel, setCreditShopLevel] = useState(0)
  const [expShopLevel, setExpShopLevel] = useState(0)

  // Reusable fetcher
  const fetchUserData = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setUserID(user.id)

    const { data, error } = await supabase
      .from("User")
      .select("userCreditMultiplier, userExpMultiplier, userCredits, creditShopLevel, expShopLevel")
      .eq("id", user.id)
      .single()

    if (data && !error) {
      setCreditMultiplier(data.userCreditMultiplier)
      setExpMultiplier(data.userExpMultiplier)
      setUserCredits(data.userCredits)
      setCreditShopLevel(data.creditShopLevel || 0)
      setExpShopLevel(data.expShopLevel || 0)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const calculateUpgradeInfo = (level: number, currentMultiplier: number) => {
    const upgradeAmount = 0.10 + 0.05 * level
    const price = 1500 + 100 + 50 * level
    const nextMultiplier = parseFloat((currentMultiplier + upgradeAmount).toFixed(2))
    return { level, upgradeAmount, price, nextMultiplier }
  }

  const handleUpgrade = async (type: "credit" | "exp") => {
  const current = type === "credit" ? creditMultiplier : expMultiplier
  const level = type === "credit" ? creditShopLevel : expShopLevel

  if (level >= 15) return alert("Maximum shop upgrade level reached.")

  const { upgradeAmount, price, nextMultiplier } = calculateUpgradeInfo(level, current)
  if (userCredits < price) return alert("Not enough credits.")

  const newCredits = userCredits - price
  const updates: Record<string, number> = {
    userCredits: newCredits,
  }

  if (type === "credit") {
    updates.userCreditMultiplier = nextMultiplier
    updates.creditShopLevel = level + 1
  } else {
    updates.userExpMultiplier = nextMultiplier
    updates.expShopLevel = level + 1
  }

  const { error } = await supabase.from("User").update(updates).eq("id", userID)

  if (!error) {
    await supabase.from("multiplier_upgrades").insert([{ user_id: userID, type }])
    if (type === "credit") {
      setCreditMultiplier(nextMultiplier)
      setCreditShopLevel(level + 1)
    } else {
      setExpMultiplier(nextMultiplier)
      setExpShopLevel(level + 1)
    }
    setUserCredits(newCredits)

    // Alert for successful level-up
    alert(`Successfully leveled up! Your ${type} multiplier is now ${nextMultiplier.toFixed(2)}x.`)
    window.location.reload();
  } else {
    console.error("Upgrade failed:", error)
  }
}
  const upgrades = useMemo(() => [
    {
      id: "credit-multiplier",
      name: "Credit Multiplier Upgrade",
      multiplier: creditMultiplier,
      type: "credit",
      color: "bg-yellow-500",
      icon: <Coins className="h-6 w-6 text-yellow-500" />,
    },
    {
      id: "exp-multiplier",
      name: "Experience Multiplier Upgrade",
      multiplier: expMultiplier,
      type: "exp",
      color: "bg-purple-500",
      icon: <Award className="h-6 w-6 text-purple-500" />,
    },
  ], [creditMultiplier, expMultiplier])

  if (loading) return <div className="text-center py-6 text-gray-600">Loading upgrades...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Upgrades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {upgrades.map(({ id, name, multiplier, type, color, icon }) => {
          const level = type === "credit" ? creditShopLevel : expShopLevel
          const { upgradeAmount, price, nextMultiplier } = calculateUpgradeInfo(level, multiplier)

          return (
            <Card key={id} className="shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{name}</CardTitle>
                  {icon}
                </div>
                <CardDescription>
                  Increase your {type === "credit" ? "credit" : "experience"} earnings from all sources
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Current Shop Multiplier</span>
                    <span className="text-lg font-bold">{multiplier.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Next Level</span>
                    <span className="text-lg font-bold">{nextMultiplier.toFixed(2)}x</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
<div
  className={`${color} h-2.5 rounded-full`}
  style={{ width: `${(level / 15) * 100}%` }}  // Use level instead of multiplier for progress
></div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>1.0x</span>
                    <span>5.0x</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2">
                <div className="font-bold">{price} Credits</div>
                <Button onClick={() => handleUpgrade(type as "credit" | "exp")}>Upgrade</Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
