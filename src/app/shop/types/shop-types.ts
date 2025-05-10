import type React from "react"
export interface ShopItem {
  id: string
  name: string
  price: number
  title?: string
  description?: string
  previewUrl?: string
  font_name?:string
  type?: string
  currentLevel?: number
  nextLevel?: number
  userID?: string
  fonts?:string
  font?: string
}

export interface Category {
  id: string
  name: string
  icon: React.ReactNode
}

// You can extend these types as needed for your backend integration
export interface User {
  id: string
  name: string
  credits: number
  multiplier: number
}

export interface PurchaseTransaction {
  id: string
  userId: string
  itemId: string
  itemType: string
  price: number
  date: Date
}
