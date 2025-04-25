import React, { useState } from 'react';
import { Menu, Palette } from 'lucide-react'; // Palette icon for color picker
import { Button } from '@/app/writingpage/ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
  bgColor: string;
  setBgColor: (color: string) => void;
}

export default function Header({ onMenuClick, bgColor, setBgColor }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Function to change the background color
  const changeColor = (color: string) => {
    setBgColor(color);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <header
      className="text-white p-4 flex items-center justify-between sticky top-0 z-50"
      style={{ backgroundColor: bgColor }} // Apply the dynamic background color
    >
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="mr-4 rounded-full transition-transform duration-300 ease-in-out" // Removed hover effect here
          aria-label="Menu"
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.398 19.316a4.5 4.5 0 01-1.896 1.12l-2.662.835.835-2.662a4.5 4.5 0 011.12-1.896l12.067-12.066z"
          />
        </svg>
        <h1
          className="text-2xl font-bold tracking-wide uppercase text-white"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          E-Lathala
        </h1>
      </div>

      {/* Icon button to toggle the dropdown menu for color themes */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown
          className="ml-4 bg-white rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110"
          aria-label="Select Color Theme"
          style={{
            color: bgColor, // Icon color dynamically set to bgColor
            borderColor: bgColor, // Border color matches background color
          }}
        >
          <Palette className="h-6 w-6" style={{ color: bgColor }} /> {/* Set icon color dynamically */}
        </Button>

        {/* Dropdown Menu for color options */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg transition-transform duration-200 ease-in-out transform opacity-100 scale-100 p-2">
            <ul className="flex flex-wrap gap-2">
              {[ 
                '#4F8FB7', '#D9534F', '#28A745', '#FFC107', '#6C757D', 
                '#FF5733', '#8E44AD', '#1ABC9C', '#F39C12', '#E74C3C', 
                '#3498DB', '#9B59B6'
              ].map((color, idx) => (
                <li
                  key={idx}
                  onClick={() => changeColor(color)}
                  className={`cursor-pointer transition-all duration-200 ease-in-out rounded-full w-8 h-8 flex items-center justify-center ${
                    bgColor === color ? 'border-4 border-white' : ''
                  }`}
                  style={{
                    backgroundColor: color,
                    border: `2px solid ${color}`,
                  }}
                  role="menuitem"
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
