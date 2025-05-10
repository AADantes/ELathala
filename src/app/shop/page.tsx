"use client"
import ShopLayout from "./components/shop/shop-layout"
import { UuidProvider } from "../writingspace/UUIDContext"
import { PurchasedFontProvider } from "./PurchasedFontContext"

export default function ShopPage() {
  return <UuidProvider>
    <PurchasedFontProvider>
      <ShopLayout /> 
      </PurchasedFontProvider> </UuidProvider>  

}
