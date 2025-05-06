import React from 'react'
import { X } from 'lucide-react'
import { Button } from '../writingspace/writingresults/ui/button'
import Link from 'next/link'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-yellow-100 transform  ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="mb-4">
          <X className="h-6 w-6" />
        </Button>
        <div className="mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
          <div className="font-bold">Username</div>
          <div className="text-sm">Level 1 (100 XP)</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full w-1/4"></div>
          </div>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/login" className="block py-2 hover:text-blue-500">
                Login / Register
              </Link>
            </li>
            <li>
              <Link href="/" className="block py-2 hover:text-blue-500">
                Home
              </Link>
            </li>
            <li>
              <Link href="/works" className="block py-2 hover:text-blue-500">
                Works
              </Link>
            </li>
            <li>
              <Link href="/profile" className="block py-2 hover:text-blue-500">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/levels-rewards" className="block py-2 hover:text-blue-500">
                Levels and Rewards
              </Link>
            </li>
            <li>
              <Link href="/help" className="block py-2 hover:text-blue-500">
                Help
              </Link>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start p-0 h-auto">
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}