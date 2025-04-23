"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/writingrewards/ui/tabs"
import { UserProfileCard } from "@/app/writingrewards/user-profile-card"
import { RewardsOverview } from "@/app/writingrewards/rewards-overview"
import { XPActivities } from "@/app/writingrewards/xp-activities"
import { RewardsGallery } from "@/app/writingrewards/rewards-gallery"
import { LevelPath } from "@/app/writingrewards/level-path"
import { userData, rewardsData, levelMilestones } from "@/app/writingrewards/lib/rewards-data"

export function UserLevelRewards() {
  const [activeTab, setActiveTab] = useState("overview")
  const [progressValue, setProgressValue] = useState(0)

  // Calculate progress percentage
  const progressPercentage = (userData.xp / userData.xpToNextLevel) * 100

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressValue(progressPercentage)
    }, 300)
    return () => clearTimeout(timer)
  }, [progressPercentage])

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <UserProfileCard userData={userData} levelMilestones={levelMilestones} progressValue={progressValue} />

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 p-1 bg-slate-100/80 backdrop-blur-sm rounded-lg">
          {/* Overview Tab Button */}
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-sky-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-sky-600 font-medium text-sm py-1.5 px-4 rounded-md transition-all duration-300 hover:bg-sky-600 hover:text-white"
          >
            Overview
          </TabsTrigger>
          
          {/* Rewards Tab Button */}
          <TabsTrigger
            value="rewards"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-sky-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-sky-600 font-medium text-sm py-1.5 px-4 rounded-md transition-all duration-300 hover:bg-sky-600 hover:text-white"
          >
            Rewards
          </TabsTrigger>

          {/* Level Path Tab Button */}
          <TabsTrigger
            value="levels"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-600 data-[state=active]:to-sky-500 data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-sky-600 font-medium text-sm py-1.5 px-4 rounded-md transition-all duration-300 hover:bg-sky-600 hover:text-white"
          >
            Level Path
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          <RewardsOverview rewardsData={rewardsData} setActiveTab={setActiveTab} />
          <XPActivities />
        </TabsContent>

        {/* Rewards Tab Content */}
        <TabsContent value="rewards">
          <RewardsGallery rewardsData={rewardsData} />
        </TabsContent>

        {/* Levels Tab Content */}
        <TabsContent value="levels">
          <LevelPath levelMilestones={levelMilestones} userData={userData} rewardsData={rewardsData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
