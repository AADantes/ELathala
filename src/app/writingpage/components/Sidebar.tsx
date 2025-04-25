import React from 'react';
import {
  X,
  Home,
  BookOpen,
  User,
  Star,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { Button } from '@/app/writingpage/ui/Button';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  bgColor: string; // Background color prop
}

// Function to lighten or darken the color, ensuring it’s still soft yet not too bright
function adjustColorBrightness(color: string, amount: number) {
  let colorCode = color.slice(1); // Remove the '#' symbol
  let r = parseInt(colorCode.slice(0, 2), 16);
  let g = parseInt(colorCode.slice(2, 4), 16);
  let b = parseInt(colorCode.slice(4, 6), 16);

  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Function to generate contrasting hover colors
function generateHoverColor(color: string) {
  // Adjust the color to be lighter or darker for hover effects
  return adjustColorBrightness(color, -50); // Darken for hover effect
}

export default function Sidebar({ isOpen, onClose, bgColor }: SidebarProps) {
  // Adjust the color to make it softer, making it easier on the eyes
  const softBgColor = adjustColorBrightness(bgColor, -30); // Darken the background slightly
  const hoverBgColor = generateHoverColor(bgColor); // Get hover color for buttons/links

  return (
    <div
      className={`fixed inset-y-0 left-0 w-80 shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}
      style={{
        backgroundColor: softBgColor, // Apply the adjusted, softer background color
      }}
    >
      <div className="p-4 text-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="mb-4 rounded-full transition-all duration-300 ease-in-out transform"
        >
          <X className="h-6 w-6 text-white" />
        </Button>

        <div className="mb-6 p-4 text-center">
          <div className="w-20 h-20 rounded-full mb-2 mx-auto bg-white flex items-center justify-center shadow-inner">
            <User
              className="h-10 w-10"
              style={{
                color: bgColor, // Dynamically set the icon color to match the background color
              }}
            />
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
                className={`flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[${hoverBgColor}] group`}
              >
                <Home className="h-5 w-5 text-[#005B88] transition-all duration-300 group-hover:text-[#005B88]" />
                <span className="text-black font-bold transition-all duration-300 group-hover:text-black">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/works"
                className={`flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[${hoverBgColor}] group`}
              >
                <BookOpen className="h-5 w-5 text-[#9D79FF] transition-all duration-300 group-hover:text-[#9D79FF]" />
                <span className="text-black font-bold transition-all duration-300 group-hover:text-black">
                  Works
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[${hoverBgColor}] group`}
              >
                <User
                  className="h-5 w-5"
                  style={{
                    color: bgColor, // Dynamically set the icon color to match the background color
                  }}
                />
                <span className="text-black font-bold transition-all duration-300 group-hover:text-black">
                  Profile
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/levels-rewards"
                className={`flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[${hoverBgColor}] group`}
              >
                <Star className="h-5 w-5 text-[#FFD700] transition-all duration-300 group-hover:text-[#FFD700]" />
                <span className="text-black font-bold transition-all duration-300 group-hover:text-black">
                  Levels and Rewards
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/help"
                className={`flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[${hoverBgColor}] group`}
              >
                <HelpCircle className="h-5 w-5 text-[#FF6B6B] transition-all duration-300 group-hover:text-[#FF6B6B]" />
                <span className="text-black font-bold transition-all duration-300 group-hover:text-black">
                  Help
                </span>
              </Link>
            </li>
            <li>
              <Button
                variant="ghost"
                className={`w-full flex items-center space-x-4 justify-start py-5 px-4 rounded-lg text-left text-red-500 bg-white shadow-sm shadow-black/20 transition-all duration-300 ease-in-out transform hover:bg-[${hoverBgColor}] group`}
              >
                <LogOut className="h-5 w-5 text-[#FF6B6B] transition-all duration-300 group-hover:text-[#FF6B6B]" />
                <span className="text-red-500 font-bold transition-all duration-300 group-hover:text-red-500">
                  Logout
                </span>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
