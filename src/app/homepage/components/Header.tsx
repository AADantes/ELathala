'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, LogOut, Pen } from 'lucide-react'
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
        .from('User') // Ensure table name matches your database
        .select('username, userLevel')
        .eq('id', user.id) // Fetch user by their authid (UUID)
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

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-8">
            {["home", "explore", "community"].map((item) => (
              <li key={item} className="group">
                <Link href={`/${item}`} className="text-white hover:text-sky-950 transition-colors relative font-bold">
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  <span className="absolute left-0 -bottom-1 w-0 group-hover:w-full h-[2px] bg-sky-400 transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Settings Dropdown */}
        <div className="relative">
          <button onClick={() => setShowDropdown(!showDropdown)} className="text-white hover:text-sky-950">
            <Settings className="h-5 w-5" />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden"
              >
                {/* User Info */}
                <div className="py-6 px-6 bg-sky-50 text-center">
                  <div className="w-16 h-16 bg-sky-600 text-white rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                    {user ? user.username.charAt(0).toUpperCase() : "?"}
                  </div>
                  <p className="mt-2 text-base font-semibold text-gray-800">
                    {user ? user.username : "Loading..."}
                  </p>
                  <p className="text-sm text-gray-500">Writer Level {user ? user.userLevel : "..."}</p>
                </div>

                <hr className="border-gray-200" />

                {/* Dropdown Links */}
                <ul className="py-2">
                  {[{ href: "/settings", icon: <Settings className="h-5 w-5 mr-3 text-sky-400" />, label: "Account Settings" },
                    { href: "/help", icon: <Pen className="h-5 w-5 mr-3 text-sky-400" />, label: "Help & Support" },
                    { href: "/premium", icon: (
                      <svg className="h-5 w-5 mr-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                      </svg>
                    ), label: "Upgrade to Premium", className: "text-yellow-500 hover:bg-yellow-50" }
                  ].map(({ href, icon, label, className = "text-black hover:bg-sky-50" }) => (
                    <li key={href}>
                      <Link href={href} className={`flex items-center px-6 py-3 text-sm ${className} transition-colors duration-300`}>
                        {icon} {label}
                      </Link>
                    </li>
                  ))}

                  {/* Logout Button */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                    >
                      <LogOut className="h-5 w-5 mr-3 text-red-400" />
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
