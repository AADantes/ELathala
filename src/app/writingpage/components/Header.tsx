import React, { useState, useEffect } from 'react';
import { Menu, Palette } from 'lucide-react';
import { Button } from '@/app/writingpage/ui/Button';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
  bgColor: string;
  setBgColor: (color: string) => void;
}

export default function Header({ onMenuClick, bgColor, setBgColor }: HeaderProps) {
  const defaultColor = '#3498DB';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(bgColor || defaultColor);
  const [customColor, setCustomColor] = useState<string>(bgColor || defaultColor);

  useEffect(() => {
    const savedColor = localStorage.getItem('selectedColor');
    if (savedColor) {
      setSelectedColor(savedColor);
      setBgColor(savedColor);
    } else {
      setSelectedColor(defaultColor);
      setBgColor(defaultColor);
    }
  }, [setBgColor]);

  const changeColor = (color: string) => {
    setSelectedColor(color);
    setBgColor(color);
    localStorage.setItem('selectedColor', color);
  };

  const changeCustomColor = (color: string) => {
    setCustomColor(color);
    setSelectedColor(color);
    setBgColor(color);
    localStorage.setItem('selectedColor', color);
  };

  const colorForIcon = selectedColor || customColor;

  return (
    <header
      className="text-white p-4 flex items-center justify-between sticky top-0 z-50"
      style={{
        backgroundColor: bgColor,
        height: '80px',
      }}
    >
      <div className="flex items-center">
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="mr-2 rounded-full transition-transform duration-300 ease-in-out"
          aria-label="Menu"
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>

        {/* Logo */}
        <Link className="flex items-center" href="/">
          <img
            src="/logos/logo.png" // Replace with the actual path to your logo
            alt="E-Lathala Logo"
            className="h-28 w-auto mr-[-14px]" // Increased height and negative margin for closer alignment
          />
          <span
            className={`font-bold text-4xl text-white`}
            style={{
              letterSpacing: '1px',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            E-LATHALA
          </span>
        </Link>
      </div>

      {/* Color Picker Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="ml-4 bg-white rounded-full transition-transform duration-300 ease-in-out"
          aria-label="Select Color Theme"
          style={{
            color: colorForIcon,
            borderColor: colorForIcon,
          }}
        >
          <Palette className="h-6 w-6" style={{ color: colorForIcon }} />
        </Button>

        {/* Color Picker Dropdown */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg transition-transform duration-200 ease-in-out transform opacity-100 scale-100 p-3 z-50">
            <h3 className="text-sm font-bold mb-2">Select a theme color</h3>
            <ul className="flex flex-wrap gap-2 mb-3">
              {[
                '#4F8FB7', '#D9534F', '#28A745', '#FFC107', '#6C757D',
                '#FF5733', '#8E44AD', '#1ABC9C', '#F39C12', '#E74C3C',
                '#3498DB', '#9B59B6',
              ].map((color, idx) => (
                <li
                  key={idx}
                  onClick={() => changeColor(color)}
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
              <label htmlFor="custom-color" className="text-sm font-bold text-gray-800">
                Custom Color:
              </label>
              <div className="relative flex items-center">
                <input
                  type="color"
                  id="custom-color"
                  className="w-12 h-12 appearance-none rounded-full cursor-pointer p-0 bg-transparent border-none outline-none ring-0 shadow-none"
                  value={customColor}
                  onChange={(e) => changeCustomColor(e.target.value)}
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
