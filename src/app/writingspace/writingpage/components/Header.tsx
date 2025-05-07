'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Palette } from 'lucide-react';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { Bebas_Neue } from 'next/font/google';
import supabase from '../../../../../config/supabaseClient';

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
});

interface HeaderProps {
  onMenuClick: () => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  title: string;
  genre: string;
  topic: string;
}

export default function Header({ onMenuClick, bgColor, setBgColor }: HeaderProps) {
  const defaultColor = '#3498DB';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(bgColor || defaultColor);
  const [customColor, setCustomColor] = useState(bgColor || defaultColor);
  const [user, setUser] = useState<{
    username: string;
    userLevel: number;
    usercurrentExp: string;
    userCredits: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedColor = localStorage.getItem('selectedColor');
      if (savedColor) {
        setSelectedColor(savedColor);
        setBgColor(savedColor);
      } else {
        setSelectedColor(defaultColor);
        setBgColor(defaultColor);
      }
    }

    const fetchUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('Error fetching auth user:', authError);
          return;
        }

        const { data, error } = await supabase
          .from('User')
          .select('username, userLevel, usercurrentExp, userCredits')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUser(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching user data:', err);
      }
    };

    fetchUser();
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
      style={{ backgroundColor: bgColor }}
    >
      {/* Left: Menu Icon + Logo + E-LATHALA */}
      <div className="flex items-center space-x-2 ml-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="rounded-full transition-transform duration-300 ease-in-out"
          aria-label="Menu"
        >
          <Menu className="h-7 w-7 text-white" />
        </Button>
        <Link href="/" className="flex items-center space-x-1 ml-2">
          <img src="https://ueagmtscbdirqgbjxaqb.supabase.co/storage/v1/object/public/elathala-logo//logo.png" alt="E-Lathala Logo" className="h-12 w-12" />
          <span
            className={`font-bold text-3xl text-white ${bebasNeue.className} ml-1`}
            style={{
              letterSpacing: '0.5px',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            E-LATHALA
          </span>
        </Link>
      </div>



        {/* Color Picker */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="ml-2 rounded-full transition-transform duration-300 ease-in-out"
            aria-label="Select Color Theme"
            style={{
              color: 'white', // Set the color of the icon to white
              borderColor: colorForIcon, // Optional: Border color
            }}
          >
            <Palette className="h-8 w-8" style={{ color: 'white' }} /> {/* Increased size */}
          </Button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg p-3 z-50">
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
                    className={`cursor-pointer rounded-full w-8 h-8 ${selectedColor === color ? 'border-4 border-white' : ''}`}
                    style={{ backgroundColor: color, border: `2px solid ${color}` }}
                    role="menuitem"
                  />
                ))}
              </ul>

              {/* Custom Color Picker */}
              <div className="flex items-center justify-between mt-3 px-4 py-3 bg-gray-50 rounded-md shadow-md">
                <label htmlFor="custom-color" className="text-sm font-bold text-gray-800">
                  Custom Color:
                </label>
                <input
                  type="color"
                  id="custom-color"
                  className="w-12 h-12 appearance-none rounded-full cursor-pointer bg-transparent border-none outline-none ring-0 shadow-none"
                  value={customColor}
                  onChange={(e) => changeCustomColor(e.target.value)}
                  aria-label="Custom color picker"
                />
              </div>
            </div>
          )}
        </div>
    </header>
  );
}
