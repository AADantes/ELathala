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

export interface WrittenWork {
  workTitle: string
  numberofWords: number
  noOfWordsSet: number
  timelimitSet: number
}

export function UserPanel() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [writtenWorks, setWrittenWorks] = useState<WrittenWork[]>([])
  const [bestPerformance, setBestPerformance] = useState<{
    highestWords: WrittenWork
    highestTarget: WrittenWork
    lowestTime: WrittenWork
  } | null>(null)

  
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

      const { data: writtenWorksData, error: writtenWorksError } = await supabase
        .from("written_works")
        .select("workTitle, numberofWords, noOfWordsSet, timelimitSet")
        .eq("UserID", authUser.id)

      if (writtenWorksError) {
        console.error("Error fetching written works:", writtenWorksError)
        return
      }

      if (writtenWorksData) {
        setWrittenWorks(writtenWorksData)

        
  const highestWords = writtenWorksData.reduce((max, work) =>
    work.numberofWords > max.numberofWords ? work : max
  )

  const highestTarget = writtenWorksData.reduce((max, work) =>
    work.noOfWordsSet > max.noOfWordsSet ? work : max
  )

  const lowestTime = writtenWorksData.reduce((min, work) =>
    work.timelimitSet < min.timelimitSet ? work : min
  )

  setBestPerformance({
    highestWords,
    highestTarget,
    lowestTime,
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
          className={`text-cyan-400 text-3xl font-extrabold tracking-wider leading-none text-center ${bebasNeue.className}`}
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
              className="h-full bg-yellow-400 transition-all duration-500"
            />
          </div>

          <p className="text-sm text-gray-900 font-medium mt-2">
            {userData.experience} / {userData.totalExperience} XP
          </p>
        </div>

        {/* Scrollable Table with Borders */}
        <div className="overflow-y-auto max-h-[300px] mt-4 border border-gray-300 rounded">
          <table className="min-w-full table-fixed border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">Work Title</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">Number of Words</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">Target Word Count</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-300">Time Limit (min)</th>
              </tr>
            </thead>
            <tbody>
  {writtenWorks.length === 0 ? (
    <tr>
      <td colSpan={4} className="px-4 py-2 text-center text-sm text-gray-700 border border-gray-300">
        No written works found.
      </td>
    </tr>
  ) : (
    writtenWorks.map((work, index) => (
      <tr key={index} className="bg-white hover:bg-gray-50">
        <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">{work.workTitle}</td>
        <td
          className={`px-4 py-2 text-sm text-gray-700 border border-gray-300 ${
            work.numberofWords >= work.noOfWordsSet
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          {work.numberofWords}
        </td>
        <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">{work.noOfWordsSet}</td>
        <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">{work.timelimitSet}</td>
      </tr>
    ))
  )}
</tbody>
          </table>



        </div>

        {bestPerformance && (
  <div className="mt-4 text-sm text-gray-800 space-y-2">
    <p>
      🏆 <strong>Most Words Written:</strong> {bestPerformance.highestWords.workTitle} ({bestPerformance.highestWords.numberofWords} words)
    </p>
    <p>
      🎯 <strong>Highest Target Word Count:</strong> {bestPerformance.highestTarget.workTitle} ({bestPerformance.highestTarget.noOfWordsSet} words)
    </p>
    <p>
      ⏱️ <strong>Lowest Time Limit:</strong> {bestPerformance.lowestTime.workTitle} ({bestPerformance.lowestTime.timelimitSet} min)
    </p>
  </div>
)}

      </CardContent>
    </Card>
  )
}
