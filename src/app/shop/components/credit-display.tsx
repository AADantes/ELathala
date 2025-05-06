"use client";

import { CreditCard } from "lucide-react"
import { Button } from "@/app/shop/ui/button"

interface CreditDisplayProps {
  credits: number
}

export function CreditDisplay({ credits }: CreditDisplayProps) {
  return (
    <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
      <CreditCard className="h-5 w-5 text-primary" />
      <span className="font-medium">Your Credits:</span>
      <span className="font-bold">{credits}</span>
    </div>
  )
}

