"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Add this import
import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';
import {
  Menu, LogOut, Home, Edit, User, Award, HelpCircle, X, Store
} from 'lucide-react';
import { Bebas_Neue } from 'next/font/google';
import supabase from '../../../../config/supabaseClient';

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
});

export function Header() {
  const [showSidebar, setShowSidebar] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Add this line
  const [user, setUser] = useState<{
    username: string;
    userLevel: number;
    usercurrentExp: string;
    userCredits: number;
    avatar_url?: string;
  } | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/landingpage');
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError || !authUser) {
        console.error('Error fetching auth user:', authError);
        return;
      }
  
      console.log('Authenticated user UID:', authUser.id);
  
      const { data, error } = await supabase
        .from('User') // or from('"User"') if case-sensitive
        .select('username, userLevel, usercurrentExp, userCredits')
        .eq('id', authUser.id) // ✅ filter by UID column in your table
        .single();
  
      if (error) {
        console.error('Error fetching user data:', error);
      } else {
        console.log('Fetched user data:', data);
        setUser(data);
      }
    };
  
    fetchUser();
  }, []);

  return (
    <header className="border-b border-transparent bg-[#4F8FB7]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSidebar(true)}
            className="text-white hover:text-sky-950 transition-transform transform hover:scale-110 duration-300"
          >
            <Menu className="h-7 w-7" />
          </button>

          <div className="flex items-center space-x-2 ml-4">
            <img src="/logos/logo.png" alt="E-Lathala Logo" className="h-12 w-12" />
            <span className={`font-bold text-3xl text-white ${bebasNeue.className}`}>
              E-LATHALA
            </span>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Stats Display */}
          <div className="flex items-center space-x-2">
            {/* Level */}
            <div className="flex items-center justify-center w-20 h-8 px-2 py-1 bg-white rounded-full shadow-sm">
              <Award className="text-yellow-500 h-5 w-5 mr-1" />
              <span className="text-sm font-bold">{user?.userLevel}</span>
            </div>

            <div className="flex items-center justify-center w-24 h-8 px-2 py-1 bg-white rounded-full shadow-sm">
              <Coins className="text-yellow-500 h-5 w-5 mr-1" />
              <span className="text-sm font-bold">{user?.userCredits}</span>
            </div>
          </div>

          {/* Shop/Home Button */}
          <button
            onClick={() =>
              pathname === "/shop"
                ? router.push("/homepage")
                : router.push("/shop")
            }
            className="text-white hover:text-sky-950 transition-transform transform hover:scale-110 duration-300"
            aria-label={pathname === "/shop" ? "Go to homepage" : "Go to shop"}
          >
            {pathname === "/shop" ? (
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40"
            />

            <motion.div
              initial={{ x: -384 }}
              animate={{ x: 0 }}
              exit={{ x: -384 }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="fixed top-0 left-0 z-50 h-full w-96 bg-white shadow-xl overflow-hidden"
            >
              <button
                onClick={() => setShowSidebar(false)}
                className="absolute top-4 right-4 text-2xl text-gray-700 hover:text-gray-900"
              >
                <X />
              </button>

              {/* User Info */}
              <div className="py-8 px-8 bg-sky-50 text-center">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-sky-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                    {user?.username?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <p className="mt-3 text-lg font-bold text-gray-800">
                  {user ? user.username : "Loading..."}
                </p>
                <p className="text-base text-gray-500 font-bold">
                  Writer Level {user ? user.userLevel : "..."}</p>
              </div>

              <hr className="border-gray-200" />

              {/* Navigation */}
              <ul className="py-4 font-semibold space-y-3">
                <li>
                  <Link
                    href="/homepage"
                    className="flex items-center px-6 py-3 text-lg text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-lg rounded-xl"
                  >
                    <Home className="h-7 w-7 mr-4 text-blue-500" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/works"
                    className="flex items-center px-6 py-3 text-lg text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-lg rounded-xl"
                  >
                    <Edit className="h-7 w-7 mr-4 text-violet-500" />
                    Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account-settings"
                    className="flex items-center px-6 py-3 text-lg text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-lg rounded-xl"
                  >
                    <User className="h-7 w-7 mr-4 text-teal-500" />
                    Account Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/writingrewards"
                    className="flex items-center px-6 py-3 text-lg text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-lg rounded-xl"
                  >
                    <Award className="h-7 w-7 mr-4 text-yellow-500" />
                    Level Rewards
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="flex items-center px-6 py-3 text-lg text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-lg rounded-xl"
                  >
                    <HelpCircle className="h-7 w-7 mr-4 text-red-500" />
                    Help & Support
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-6 py-3 text-red-600 transition-all duration-300 hover:bg-red-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                  >
                    <LogOut className="h-7 w-7 mr-4 text-red-600 transition-transform duration-300 transform hover:scale-110" />
                    Log Out
                  </button>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
