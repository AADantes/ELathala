"use client";

import { FontCard } from "@/app/shop/shop/font-card"
import { fonts } from "@/app/shop/lib/shop-data"

export function FontsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fonts.map((font) => (
        <FontCard key={font.id} font={font} />
      ))}
    </div>
  )
}

