import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PurchaseDialogProps {
  children: React.ReactNode
  title: string
  description: string
  credits: number
  itemType: string
  currentBalance?: number
}

export function PurchaseDialog({
  children,
  title,
  description,
  credits,
  itemType,
  currentBalance = 250,
}: PurchaseDialogProps) {
  const isAffordable = currentBalance >= credits

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg bg-white rounded-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-black">{title}</DialogTitle>
          <DialogDescription className="text-md text-gray-600">{description}</DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm">Your current balance:</span>
            <span className="font-bold text-gray-800">{currentBalance} credits</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm">Cost:</span>
            <span className="font-bold text-red-500">-{credits} credits</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">New balance after purchase:</span>
            <span className={`font-bold ${isAffordable ? 'text-green-500' : 'text-red-500'}`}>
              {currentBalance - credits} credits
            </span>
          </div>

          {!isAffordable && (
            <div className="text-sm text-red-500">
              <span>Insufficient credits to complete this purchase.</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center space-x-4">
          <Button variant="outline" className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            className={`w-full sm:w-auto bg-gradient-to-r from-sky-700 to-sky-900 text-white font-semibold py-2 px-4 shadow-xl transition-all duration-300 transform ${
              !isAffordable
                ? "opacity-50 cursor-not-allowed"
                : "hover:brightness-110 hover:scale-[1.02]"
            }`}
            disabled={!isAffordable}
          >
            Confirm Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
