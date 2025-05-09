'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu, LogOut, Home, Edit, User, Award, HelpCircle, X, Store, Coins
} from 'lucide-react';
import { Bebas_Neue } from 'next/font/google';
import supabase from '../../../../config/supabaseClient';

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
});

// Helper functions for color adjustment
function adjustColorBrightness(color: string, amount: number) {
  let colorCode = color.slice(1);
  let r = parseInt(colorCode.slice(0, 2), 16);
  let g = parseInt(colorCode.slice(2, 4), 16);
  let b = parseInt(colorCode.slice(4, 6), 16);

  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
function generateHoverColor(color: string) {
  return adjustColorBrightness(color, -50);
}

export function Header() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    userLevel: number;
    usercurrentExp: string;
    userCredits: number;
    avatar_url?: string;
  } | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/landingpage');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error('Error fetching auth user:', authError);
        return;
      }

      const { data, error } = await supabase
        .from('User')
        .select('username, userLevel, usercurrentExp, userCredits, avatar_url')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        setUser(data);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="border-b border-transparent bg-[#4F8FB7]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left side: Menu + Logo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSidebar(true)}
            className="text-white hover:text-sky-950 transition-transform transform hover:scale-110 duration-300"
          >
            <Menu className="h-7 w-7" />
          </button>

          <div className="flex items-center space-x-2 ml-4">
            <img
              src="https://ueagmtscbdirqgbjxaqb.supabase.co/storage/v1/object/public/elathala-logo//logo.png"
              alt="E-Lathala Logo"
              className="h-12 w-12"
            />
            <span className={`font-bold text-3xl text-white ${bebasNeue.className}`}>
              IWrite
            </span>
          </div>
        </div>

        {/* Right side: Stats + Shop/Home toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-20 h-8 px-2 py-1 bg-white rounded-full shadow-sm">
              <Award className="text-yellow-500 h-5 w-5 mr-1" />
              <span className="text-sm font-bold">{user?.userLevel}</span>
            </div>

            <div className="flex items-center justify-center w-24 h-8 px-2 py-1 bg-white rounded-full shadow-sm">
              <Coins className="text-yellow-500 h-5 w-5 mr-1" />
              <span className="text-sm font-bold">{user?.userCredits}</span>
            </div>
          </div>

          <button
            onClick={() =>
              pathname === '/shop' ? router.push('/homepage') : router.push('/shop')
            }
            className="text-white hover:text-sky-950 transition-transform transform hover:scale-110 duration-300"
            aria-label={pathname === '/shop' ? 'Go to homepage' : 'Go to shop'}
          >
            {pathname === '/shop' ? (
              <Home className="h-7 w-7" />
            ) : (
              <Store className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40"
            />

            {/* Slide-in Sidebar */}
            <motion.div
              initial={{ x: -320 }} // 320px = 20rem = w-80
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.08 }} // ← mas mabilis pa
              className="fixed inset-y-0 left-0 w-80 shadow-xl z-50 transform transition-transform duration-300"
              style={{
                backgroundColor: adjustColorBrightness("#4F8FB7", -30),
              }}
            >
              <div className="p-4 text-white">
                {/* X Button */}
                <button
                  onClick={() => setShowSidebar(false)}
                  className="rounded-full transition-all duration-300 ease-in-out transform"
                  style={{ position: 'absolute', left: 24, top: 20 }} // tinaas ng konti (from 32 to 20)
                  aria-label="Close sidebar"
                >
                  <X className="h-6 w-6 text-white" />
                </button>

                {/* User Info */}
                <div className="mb-6 mt-12 p-4 text-center">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Profile"
                      className="w-20 h-20 rounded-full mx-auto object-cover mb-2 shadow-inner"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white text-[#4F8FB7] rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-2 shadow-inner">
                      {user?.username?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="font-bold text-xl text-white">{user?.username || "Username"}</div>
                  <div className="text-sm text-gray-100">
                    Level {user?.userLevel ?? 1} ({user?.usercurrentExp ?? "0"} XP)
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2 shadow-inner">
                    <div
                      className="bg-[#00FF85] h-2.5 rounded-full shadow-md"
                      style={{
                        width: user?.usercurrentExp
                          ? `${Math.min(Number(user.usercurrentExp), 100)}%`
                          : "25%",
                      }}
                    ></div>
                  </div>
                </div>

                <nav>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/homepage"
                        className={`flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-300 ease-in-out transform hover:scale-105 group`}
                        style={{ backgroundColor: 'white' }}
                      >
                        <Home className="h-5 w-5 text-[#005B88] group-hover:text-[#005B88]" />
                        <span className="text-black font-bold group-hover:text-black">
                          Home
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/works"
                        className={`flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-300 ease-in-out transform hover:scale-105 group`}
                      >
                        <Edit className="h-5 w-5 text-[#9D79FF] group-hover:text-[#9D79FF]" />
                        <span className="text-black font-bold group-hover:text-black">
                          Works
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/account-settings"
                        className={`flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-300 ease-in-out transform hover:scale-105 group`}
                      >
                        <User
                          className="h-5 w-5"
                          style={{
                            color: "#4F8FB7",
                          }}
                        />
                        <span className="text-black font-bold group-hover:text-black">
                          Account Settings
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/writingrewards"
                        className={`flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-300 ease-in-out transform hover:scale-105 group`}
                      >
                        <Award className="h-5 w-5 text-[#FFD700] group-hover:text-[#FFD700]" />
                        <span className="text-black font-bold group-hover:text-black">
                          Levels and Rewards
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/help"
                        className={`flex items-center space-x-4 py-3 px-4 rounded-lg bg-white shadow-md shadow-black/30 transition-all duration-300 ease-in-out transform hover:scale-105 group`}
                      >
                        <HelpCircle className="h-5 w-5 text-[#FF6B6B] group-hover:text-[#FF6B6B]" />
                        <span className="text-black font-bold group-hover:text-black">
                          Help & Support
                        </span>
                      </Link>
                    </li>
                    <li>
                      <button
                        className="w-full flex items-center space-x-4 justify-start py-2.5 px-4 rounded-lg text-left text-red-500 bg-white shadow-sm shadow-black/20 transition-all duration-300 ease-in-out transform hover:bg-gray-100 group"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5 text-[#FF6B6B] group-hover:text-[#FF6B6B]" />
                        <span className="text-red-500 font-bold group-hover:text-red-500">
                          Logout
                        </span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
