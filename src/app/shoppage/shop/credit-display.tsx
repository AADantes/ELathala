import { CreditCard } from "lucide-react"
import { Button } from "@/app/shoppage/ui/button"

interface CreditDisplayProps {
  credits: number
}

export function CreditDisplay({ credits }: CreditDisplayProps) {
  return (
    <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
      <CreditCard className="h-5 w-5 text-sky-500" />
      <span className="font-medium">Your Credits:</span>
      <span className="font-bold">{credits}</span>
      <Button
        size="sm"
        className="ml-2 px-4 py-2 bg-gradient-to-r from-sky-700 to-sky-900 text-white font-semibold rounded-md shadow-xl transition-all duration-300 hover:brightness-110 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50"
      >
        Buy Credits
      </Button>
    </div>
  )
}
