import React, { useState, useEffect } from 'react';
import { Menu, Palette } from 'lucide-react';
import { Button } from '@/app/writingpage/ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
  bgColor: string;
  setBgColor: (color: string) => void;
}

export default function Header({ onMenuClick, bgColor, setBgColor }: HeaderProps) {
  const defaultColor = '#2C3E50'; // Darker shade of blue
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(bgColor || defaultColor); // Default to darker blue if no color
  const [customColor, setCustomColor] = useState<string>(bgColor || defaultColor); // Default to darker blue if no color

  // Effect to load the saved color from localStorage when the component is mounted
  useEffect(() => {
    const savedColor = localStorage.getItem('selectedColor');
    if (savedColor) {
      setSelectedColor(savedColor);
      setBgColor(savedColor);
    } else {
      setSelectedColor(defaultColor); // Set to default darker blue if no color in localStorage
      setBgColor(defaultColor); // Set the background color to darker blue
    }
  }, [setBgColor]);

  // Function to handle theme color changes
  const changeColor = (color: string) => {
    setSelectedColor(color);
    setBgColor(color);
    localStorage.setItem('selectedColor', color);
  };

  // Function to handle custom color changes
  const changeCustomColor = (color: string) => {
    setCustomColor(color);
    setSelectedColor(color); // Update both selected color and custom color
    setBgColor(color);
    localStorage.setItem('selectedColor', color);
  };

  // Color to use for the icon and button, prioritizing selectedColor
  const colorForIcon = selectedColor || customColor;

  return (
    <header
      className="text-white p-4 flex items-center justify-between sticky top-0 z-50"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="mr-4 rounded-full transition-transform duration-300 ease-in-out"
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

      {/* Color Picker */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="ml-4 bg-white rounded-full transition-transform duration-300 ease-in-out"
          aria-label="Select Color Theme"
          style={{
            color: colorForIcon,  // Use colorForIcon for both the button and icon
            borderColor: colorForIcon,  // Apply the same color to the border
          }}
        >
          <Palette className="h-6 w-6" style={{ color: colorForIcon }} />
        </Button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg transition-transform duration-200 ease-in-out transform opacity-100 scale-100 p-3 z-50">
            <h3 className="text-sm font-bold mb-2">Select a theme color</h3> {/* Bold Text */}
            <ul className="flex flex-wrap gap-2 mb-3">
              {[
                '#4F8FB7', '#D9534F', '#28A745', '#FFC107', '#6C757D',
                '#FF5733', '#8E44AD', '#1ABC9C', '#F39C12', '#E74C3C',
                '#3498DB', '#9B59B6'
              ].map((color, idx) => (
                <li
                  key={idx}
                  onClick={() => changeColor(color)} // Change color when a theme color is selected
                  className={`cursor-pointer transition-all duration-200 ease-in-out rounded-full w-8 h-8 flex items-center justify-center ${selectedColor === color ? 'border-4 border-white' : ''}`}
                  style={{
                    backgroundColor: color,
                    border: `2px solid ${color}`,
                  }}
                  role="menuitem"
                />
              ))}
            </ul>

            {/* Custom Color Picker */}
            <div className="flex items-center justify-between mt-3 px-4 py-3 bg-gray-50 rounded-md shadow-md">
              <label htmlFor="custom-color" className="text-sm font-bold text-gray-800"> {/* Bold Text */}
                Custom Color:
              </label>
              <div className="relative flex items-center">
                <input
                  type="color"
                  id="custom-color"
                  className="w-12 h-12 appearance-none rounded-full cursor-pointer p-0 bg-transparent border-none outline-none ring-0 shadow-none"
                  value={customColor}
                  onChange={(e) => changeCustomColor(e.target.value)} // Update the custom color
                  aria-label="Custom color picker"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
