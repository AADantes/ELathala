'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
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
        setBgColor(savedColor);
      } else {
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
            IWrite
          </span>
        </Link>
      </div>
    </header>
  );
}