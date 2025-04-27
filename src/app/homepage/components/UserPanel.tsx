'use client'

import { useState } from 'react'
import { Button } from "@/app/homepage/ui/button"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/homepage/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/homepage/ui/card"
import { ChevronRight, Star, Gauge, ArrowUpCircle } from 'lucide-react'
import { Bebas_Neue } from '@next/font/google'

import  supabase  from '../../../../config/supabaseClient'


// Load Bebas Neue for a bold, modern look
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
})

export interface UserData {
  username: string
  experience: number
  level: number
  totalExperience: number
}

export function UserPanel({ userData }: { userData: UserData }) {

  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false)

  return (
    <Card 
      className="bg-gradient-to-br from-[#e5e7eb] to-[#f3f4f6] text-gray-900 rounded-2xl shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.15)] transition-transform transform hover:scale-105 duration-300"
    >
      <CardHeader className="bg-[#f3f4f6] rounded-t-2xl px-6 py-4">
        <CardTitle 
          className={`text-cyan-500 text-3xl font-extrabold tracking-wider leading-none text-center ${bebasNeue.className}`}
          style={{ letterSpacing: '2px' }}
        >
          {userData.username}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4 min-h-[280px]">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 flex items-center">
              <Star className="h-5 w-5 text-yellow-500 drop-shadow-[0_0_6px_rgba(255,223,0,0.6)] mr-2" />
              Level {userData.level}
            </span>
            <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="link" 
                  className="text-sky-600 hover:text-sky-500 font-semibold transition-all duration-300 ease-in-out hover:scale-105"
                >
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                </Button>
              </DialogTrigger>
              <DialogContent className="border border-gray-300 shadow-xl rounded-xl bg-white text-gray-900 max-w-xl p-6 space-y-6 transform transition-all duration-300 ease-out">
                <DialogHeader className="border-b border-gray-200 pb-2 mb-1">
                  <DialogTitle className="text-sky-600 text-3xl font-bold leading-tight">
                    Experience Details
                  </DialogTitle>
                  <DialogDescription className="text-gray-700 text-sm mb-1">
                    Your journey to greatness!
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4 text-gray-900">
                  {/* Current Level */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                    <p className="flex items-center text-xl font-semibold">
                      <Star className="h-6 w-6 text-yellow-500 mr-2" />
                      Current Level:
                    </p>
                    <span className="text-xl text-sky-600 font-bold"> 
                      {userData.level}
                    </span>
                  </div>
                  {/* Total Experience */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                    <p className="flex items-center text-xl font-semibold">
                      <Gauge className="h-6 w-6 text-purple-500 mr-2" />
                      Total Experience:
                    </p>
                    <span className="text-xl text-gray-800 font-bold">
                      {userData.experience} / {userData.totalExperience}
                    </span>
                  </div>
                  {/* Next Level */}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                    <p className="flex items-center text-xl font-semibold">
                      <ArrowUpCircle className="h-6 w-6 text-green-500 mr-2" />
                      Next Level:
                    </p>
                    <span className="text-xl text-gray-800 font-bold">
                      {userData.level + 1}
                    </span>
                  </div>
                  <p className="text-yellow-500 text-lg italic text-center mt-2">
                    Keep crafting your words!
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Progress Bar */}
          <p className="text-xs text-sky-600 font-semibold">Experience Points</p>
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner"> 
            <div 
              style={{ width: `${(userData.experience / userData.totalExperience) * 100}%` }} 
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full transition-all duration-500 ease-in-out shadow-[inset_0_-1px_2px_rgba(0,0,0,0.4)]"
            />
          </div>
          <p className="text-xs text-green-500 italic mt-2">
            Keep going! You're close to the next level!
          </p>
          <p className="text-sm text-gray-900 font-medium mt-2">
            {userData.experience} / {userData.totalExperience} XP
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
