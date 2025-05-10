import { Coins } from "lucide-react"

interface HeaderProps {
  systemName: string
  credits: number
  multiplier: number
}

export default function Header({ systemName, credits, multiplier }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Logo placeholder - replace with your actual logo */}
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-bold">CS</span>
        </div>
        <h1 className="text-xl font-bold">{systemName}</h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">{credits} Credits</span>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full">
          <span className="text-sm font-medium">Multiplier: {multiplier}x</span>
        </div>

        {/* User profile - this could be expanded with a dropdown menu */}
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </header>
  )
}
