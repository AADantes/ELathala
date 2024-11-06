import Link from 'next/link'
import { Button } from "@/app/homepage/ui/button"
import { LogOut, Settings } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold">ELATHALA</span>
          <nav>
            <ul className="flex space-x-4">
              <li><Link href="/home" className="hover:underline">Home</Link></li>
              <li><Link href="/explore" className="hover:underline">Explore</Link></li>
              <li><Link href="/community" className="hover:underline">Community</Link></li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}