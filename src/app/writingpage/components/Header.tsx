import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/app/writingpage/ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-[#4F8FB7] text-white p-4 flex items-center sticky top-0 z-50">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuClick} 
        className="mr-4 hover:bg-[#0D1E3A] rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110"
      >
        <Menu className="h-6 w-6 text-white" />
      </Button>
      <div className="flex items-center space-x-2">
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
    </header>
  );
}
