'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, LogOut, Home, Edit, User, Award, HelpCircle, Pen } from 'lucide-react'
import { Bebas_Neue } from 'next/font/google'
import supabase from '../../../../config/supabaseClient'

// Load the Bebas Neue font
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
})

export function Header() {
  const [showDropdown, setShowDropdown] = useState(false)
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
        
        {/* Brand */}
        <div className="flex items-center space-x-2">
          <Pen className="h-6 w-6 text-white" />
          <span className={`font-bold text-3xl text-white ${bebasNeue.className}`}>E-LATHALA</span>
        </div>

        {/* Menu Dropdown */}
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="text-white hover:text-sky-950 transition-transform transform hover:scale-110 duration-300">
            <Menu className="h-7 w-7" />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-4 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden"
              >
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

                {/* Dropdown Links */}
                <ul className="py-4 font-bold space-y-2">
                  <li>
                    <Link href="/" className="flex items-center px-8 py-4 text-lg text-black transition-all duration-300 hover:bg-sky-100 hover:scale-105 hover:shadow-lg rounded-xl">
                      <Home className="h-7 w-7 mr-4 text-blue-500" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/works" className="flex items-center px-8 py-4 text-lg text-black transition-all duration-300 hover:bg-violet-100 hover:scale-105 hover:shadow-lg rounded-xl">
                      <Edit className="h-7 w-7 mr-4 text-violet-500" />
                      Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/profile" className="flex items-center px-8 py-4 text-lg text-black transition-all duration-300 hover:bg-teal-100 hover:scale-105 hover:shadow-lg rounded-xl">
                      <User className="h-7 w-7 mr-4 text-teal-500" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/level-rewards" className="flex items-center px-8 py-4 text-lg text-black transition-all duration-300 hover:bg-yellow-100 hover:scale-105 hover:shadow-lg rounded-xl">
                      <Award className="h-7 w-7 mr-4 text-yellow-500" />
                      Level Rewards
                    </Link>
                  </li>
                  <li>
                    <Link href="/help" className="flex items-center px-8 py-4 text-lg text-black transition-all duration-300 hover:bg-red-100 hover:scale-105 hover:shadow-lg rounded-xl">
                      <HelpCircle className="h-7 w-7 mr-4 text-red-500" />
                      Help & Support
                    </Link>
                  </li>

                  {/* Logout Button */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-8 py-4 text-lg text-red-600 transition-all duration-300 hover:bg-red-200 hover:scale-105 hover:shadow-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                    >
                      <LogOut className="h-7 w-7 mr-4 text-red-600 transition-transform duration-300 transform hover:scale-110" />
                      Log Out
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}