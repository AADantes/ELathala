"use client";

import { Button } from "../homepage/ui/button";

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-[#4F8FB7]">
      <div className="container flex items-center justify-between h-16 py-4 px-4 mx-auto">
        {/* Title - Left-aligned on larger screens, centered on smaller screens */}
        <h1 className="text-2xl font-semibold text-white tracking-tight text-center md:text-left flex-grow">
          Admin Dashboard
        </h1>

        {/* Button - Always aligned to the right */}
        <Button
          variant="ghost"
          onClick={onLogout}
          className="text-white flex items-center justify-center px-6 py-3 rounded-lg border-2 border-white transition-all duration-300 ease-in-out transform hover:bg-[#3E7D99] active:bg-[#2F5B71] focus:outline-none focus:ring-4 focus:ring-sky-400 bg-[#4F8FB7] hover:scale-105 active:scale-95 text-lg font-semibold"
        >
          <span className="text-sm font-bold">Log out</span>
        </Button>
      </div>
    </header>
  );
}
