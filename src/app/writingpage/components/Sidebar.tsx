import React from 'react'
import {
  X,
  Home,
  BookOpen,
  User,
  Star,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import { Button } from '@/app/writingpage/ui/Button'
import Link from 'next/link'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-80 bg-[#00cccc] shadow-xl shadow-black/30 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4 text-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="mb-4 hover:bg-[#55B4ED] rounded-full transition-all duration-300 ease-in-out transform hover:scale-110"
        >
          <X className="h-6 w-6 text-white" />
        </Button>

        <div className="mb-6 p-4 text-center">
          <div className="w-20 h-20 rounded-full mb-2 mx-auto bg-white flex items-center justify-center shadow-inner">
            <User className="h-10 w-10 text-[#3A9FD9]" />
          </div>
          <div className="font-bold text-xl text-white">Username</div>
          <div className="text-sm text-gray-100">Level 1 (100 XP)</div>
          <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2 shadow-inner">
            <div className="bg-[#00FF85] h-2.5 rounded-full w-1/4 shadow-md"></div>
          </div>
        </div>

        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/homepage"
                className="flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#00C6FF] hover:to-[#0072FF] hover:text-white group"
              >
                <Home className="h-5 w-5 text-[#005B88] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                <span className="text-black font-bold transition-all duration-300 group-hover:text-white group-hover:scale-110">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/works"
                className="flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#00C6FF] hover:to-[#0072FF] hover:text-white group"
              >
                <BookOpen className="h-5 w-5 text-[#9D79FF] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                <span className="text-black font-bold transition-all duration-300 group-hover:text-white group-hover:scale-110">
                  Works
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#00C6FF] hover:to-[#0072FF] hover:text-white group"
              >
                <User className="h-5 w-5 text-[#00FF85] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                <span className="text-black font-bold transition-all duration-300 group-hover:text-white group-hover:scale-110">
                  Profile
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/levels-rewards"
                className="flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#00C6FF] hover:to-[#0072FF] hover:text-white group"
              >
                <Star className="h-5 w-5 text-[#FFD700] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                <span className="text-black font-bold transition-all duration-300 group-hover:text-white group-hover:scale-110">
                  Levels and Rewards
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/help"
                className="flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-500 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#00C6FF] hover:to-[#0072FF] hover:text-white group"
              >
                <HelpCircle className="h-5 w-5 text-[#FF6B6B] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                <span className="text-black font-bold transition-all duration-300 group-hover:text-white group-hover:scale-110">
                  Help
                </span>
              </Link>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full flex items-center space-x-4 justify-start py-5 px-4 rounded-lg text-left text-red-500 bg-white shadow-sm shadow-black/20 transition-all duration-500 ease-in-out transform hover:bg-gradient-to-r hover:from-[#FF6B6B] hover:to-[#FF4C4C] hover:scale-105 hover:shadow-sm hover:shadow-[#FF4C4C] hover:text-white group"
              >
                <LogOut className="h-5 w-5 text-[#FF6B6B] transition-all duration-300 group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-sm" />
                <span className="text-red-500 font-bold transition-all duration-300 group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-sm">
                  Logout
                </span>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
