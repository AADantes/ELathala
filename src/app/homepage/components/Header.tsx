'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/app/homepage/ui/button"
import { LogOut, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Header() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing tokens, making API calls)
    router.push('/landingpage') // Redirect to the logout route
  }

  return (
    <header className="border-b border-fadingBgLandingPage">
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
        <div className="flex items-center space-x-2 relative">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
          >
            <LogOut className="h-5 w-5" />
          </Button>
          {showLogoutConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white border shadow-lg rounded-lg w-80 p-6">
                <p className="text-lg mb-6 text-center">Are you sure you want to log out?</p>
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLogoutConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
