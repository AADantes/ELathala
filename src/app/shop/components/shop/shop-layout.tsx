"use client"

import { useState, useEffect } from "react"
import { Header } from "../../../homepage/components/Header"
import Sidebar from "../shop/sidebar"
import FontsDisplay from "../shop/fonts-display"
import UpgradesDisplay from "./upgrades-display"
import PurchaseModal from "../shop/purchase-modal"
import { UuidProvider, useUuid } from "@/app/writingspace/UUIDContext"
import type { ShopItem } from "../../types/shop-types"
import { usePurchasedFont, PurchasedFontProvider } from "../../PurchasedFontContext"

export default function ShopLayout() {
  const { userID } = useUuid();  // Use UUIDContext to access userID
  const [selectedCategory, setSelectedCategory] = useState<string>("fonts")
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false)
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const [userCredits, setUserCredits] = useState<number>(0)
  const [purchasedFonts, setPurchasedFonts] = useState<string[]>([]) // Tracks purchased fonts
  const [availableFonts, setAvailableFonts] = useState<ShopItem[]>([])
  const [showDoneModal, setShowModal] = useState(false)

  // Fetch user's credits and purchased fonts when the component mounts or userID changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userID) return

      try {
        // Fetch user's credits
        const creditsResponse = await fetch(`/api/purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userID })
        })
        const creditsData = await creditsResponse.json()
        if (creditsData.success) {
          setUserCredits(creditsData.updatedCredits)
        }

        // Fetch purchased fonts
        const fontsResponse = await fetch(`/api/purchased-fonts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userID })
        })
        const fontsData = await fontsResponse.json()
        if (fontsData.success) {
          setPurchasedFonts(fontsData.purchasedFonts)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [userID]) // Re-run when userID changes

  const handlePurchase = (item: ShopItem) => {
    setSelectedItem(item)
    setIsPurchaseModalOpen(true)
  }

  const confirmPurchase = async () => {
    if (!selectedItem || !userID) return

    const transactionId = `TXN-${Math.floor(Math.random() * 1000000).toString().padStart(6, "0")}`
    const purchaseDate = new Date().toLocaleString()

    try {
      const response = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userID,
          fontOD: selectedItem.id,
          price: selectedItem.price,
          transactionID: transactionId,
          purchaseDate: purchaseDate,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setUserCredits(data.updatedCredits)
        setPurchasedFonts((prev) => [...prev, selectedItem.name]) // Update purchased fonts list after purchase
      }

      setIsPurchaseModalOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error("Purchase request failed:", error)
    }
  }

  return (
    <PurchasedFontProvider>
    <UuidProvider>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          <main className="flex-1 overflow-auto p-6">
            {selectedCategory === "fonts" ? (
              <FontsDisplay 
                onPurchase={handlePurchase}  />
            ) : (
              <UpgradesDisplay onPurchase={handlePurchase} />
            )}
          </main>
        </div>

        {isPurchaseModalOpen && selectedItem && (
          <PurchaseModal
            item={selectedItem}
            onClose={() => setIsPurchaseModalOpen(false)}
            onConfirm={async () => {
              await confirmPurchase()
              setShowModal(true)
            }}
          />
        )}
      </div>
    </UuidProvider>
    </PurchasedFontProvider>
  )
}
