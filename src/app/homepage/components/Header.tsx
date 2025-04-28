'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, LogOut, Home, Edit, User, Award, HelpCircle, Pen, X } from 'lucide-react'
import { Bebas_Neue } from 'next/font/google'
import supabase from '../../../../config/supabaseClient'

// Load the Bebas Neue font
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
})

export function Header() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [user, setUser] = useState<{ username: string; userLevel: number } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        console.error('Error fetching auth user:', authError)
        return
      }

      const { data, error } = await supabase
        .from('User')
        .select('username, userLevel')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching user data:', error)
      } else {
        setUser(data)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/landingpage')
  }

  return (
    <header className="border-b border-transparent bg-[#4F8FB7]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Menu Icon and Brand on the left */}
        <div className="flex items-center space-x-4">
          {/* Menu Icon */}
          <button
            onClick={() => setShowSidebar(true)}
            className="text-white hover:text-sky-950 transition-transform transform hover:scale-110 duration-300"
          >
            <Menu className="h-7 w-7" />
          </button>

          {/* Brand and Logo */}
          <div className="flex items-center space-x-2">
            <Pen className="h-6 w-6 text-white" />
            <span className={`font-bold text-3xl text-white ${bebasNeue.className}`}>E-LATHALA</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Overlay to close the sidebar when clicked outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 z-40"
            />

            {/* Sidebar container */}
            <motion.div
              initial={{ x: -384 }} // Sidebar starting position off the screen
              animate={{ x: 0 }} // Move to the visible position (0, aligned to the left)
              exit={{ x: -384 }} // Exit the sidebar off the screen
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }} // Smooth sliding effect with no bouncing
              className="fixed top-0 left-0 z-50 h-full w-96 bg-white shadow-xl overflow-hidden" // Removed rounded-r-3xl class
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSidebar(false)}
                className="absolute top-4 right-4 text-2xl text-gray-700 hover:text-gray-900"
              >
                <X />
              </button>

              {/* User Info */}
              <div className="py-8 px-8 bg-sky-50 text-center">
                <div className="w-20 h-20 bg-sky-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                  {user ? user.username.charAt(0).toUpperCase() : "?"}
                </div>
                <p className="mt-3 text-lg font-bold text-gray-800">
                  {user ? user.username : "Loading..."}
                </p>
                <p className="text-base text-gray-500 font-bold">Writer Level {user ? user.userLevel : "..."}</p>
              </div>

              <hr className="border-gray-200" />

              {/* Sidebar Links */}
              <ul className="py-4 font-semibold space-y-3">
                <li>
                  <Link 
                    href="/" 
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
                    href="/profile" 
                    className="flex items-center px-6 py-3 text-lg text-black transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-lg rounded-xl"
                  >
                    <User className="h-7 w-7 mr-4 text-teal-500" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/level-rewards" 
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

                {/* Logout Button */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-6 py-3 text-red-600 transition-all duration-300 hover:bg-red-200 hover:scale-105 hover:shadow-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
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
  )
}
