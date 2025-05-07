"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Star } from "lucide-react"
import { Bebas_Neue } from "next/font/google"
import supabase from "../../../../config/supabaseClient"

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
})

export interface UserData {
  username: string
  experience: number
  level: number
  totalExperience: number
}

export function UserPanel() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !authUser) {
        console.error("Error fetching authenticated user:", authError)
        return
      }

      const { data, error } = await supabase
        .from("User")
        .select("username, userLevel, usercurrentExp, targetExp")
        .eq("id", authUser.id)
        .single()

      if (error) {
        console.error("Error fetching user data:", error)
        return
      }

      if (data) {
        setUserData({
          username: data.username ?? "Unknown",
          experience: parseFloat(data.usercurrentExp),
          level: data.userLevel ?? 1,
          totalExperience: parseFloat(data.targetExp),
        })
      }
    }

    fetchUserData()
  }, [])

  if (!userData) return null

  const progressPercent = Math.min(
    (userData.experience / userData.totalExperience) * 100,
    100
  )

  return (
    <Card className="bg-white text-gray-900 shadow-md h-[600px]">
      <CardHeader className="bg-[#f9fafb] px-6 py-4">
        <CardTitle
          className={`text-cyan-500 text-3xl font-extrabold tracking-wider leading-none text-center ${bebasNeue.className}`}
        >
          {userData.username}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              Level {userData.level}
            </span>
          </div>

          <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transition-all duration-500"
            />
          </div>

          <p className="text-sm text-gray-900 font-medium mt-2">
            {userData.experience} / {userData.totalExperience} XP
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
