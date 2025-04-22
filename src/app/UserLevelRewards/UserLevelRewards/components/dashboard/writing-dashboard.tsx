"use client" // Add this at the very top to mark this as a Client Component

import { useState } from "react"
import { PenTool, Zap, Star, FileText, Clock, Feather } from "lucide-react"
import { motion } from "framer-motion" // Importing motion for animations
import { StatCard } from "./stat-card"
import { ExperienceBar } from "./experience-bar"
import WritingAchievements from "./writing-achievements"
import WritingStatsCard from "./writing-stats-card"
import { RewardsSection } from "./rewards-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { getAllLevelDetails } from "@/config/theme"
import { formatNumber } from "@/lib/utils"
import { mockUserData, mockAchievements, mockWritingStats } from "@/data/mock-data"

export default function WritingDashboard() {
  const [userData] = useState(mockUserData)

  const levelRewards = getAllLevelDetails()

  const currentLevelDetails = levelRewards.find((reward) => reward.level === userData.level)
  const nextLevelDetails = levelRewards.find((reward) => reward.level === userData.level + 1)

  return (
    <div className="container mx-auto py-12 px-6 relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-sky-50 dark:bg-sky-950/20 -z-10"></div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-primary mb-2">Your Writing Journey</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Welcome back, <span className="font-semibold">{userData.username}</span>! Continue your writing adventure.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="shadow-lg hover:shadow-2xl"
          >
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition-all duration-300 flex items-center space-x-2"
            >
              <span className="font-bold text-md">Start Writing</span>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  y: { duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                }}
              >
                <Feather className="h-5 w-5" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <motion.div
          className="transform hover:scale-105 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <StatCard
            title="Writer Level"
            description="Your writing expertise"
            value={userData.level}
            subValue={currentLevelDetails?.name}
            icon={PenTool}
            iconColor="text-sky-500"
            iconBgColor="bg-sky-100 dark:bg-sky-900/30"
          />
        </motion.div>

        <motion.div
          className="transform hover:scale-105 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <StatCard
            title="AI Assists"
            description="Your available assists"
            value={userData.credits}
            subValue={`Daily limit: ${userData.dailyCreditLimit}`}
            icon={Zap}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          />
        </motion.div>

        <motion.div
          className="transform hover:scale-105 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <StatCard
            title="Next Level"
            description="Words needed"
            value={`${userData.nextLevelExp - userData.currentExp} XP`}
            subValue={`To reach Level ${userData.level + 1}`}
            icon={Star}
            iconColor="text-teal-500"
            iconBgColor="bg-teal-100 dark:bg-teal-900/30"
          />
        </motion.div>

        <motion.div
          className="transform hover:scale-105 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <Card className="stat-card overflow-hidden shadow-lg rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gray-900">Writing Stats</CardTitle>
              <CardDescription className="text-sm text-gray-600">Your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-sky-100 dark:bg-sky-900/30 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <span className="text-sm text-gray-700">Words Written</span>
                </div>
                <div className="font-bold text-sky-700 dark:text-sky-300">
                  {formatNumber(userData.wordsWritten)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-sm text-gray-700">Writing Streak</span>
                </div>
                <div className="font-bold text-teal-700 dark:text-teal-300">
                  {userData.streakDays} days
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {currentLevelDetails && nextLevelDetails && (
        <ExperienceBar
          level={userData.level}
          currentExp={userData.currentExp}
          nextLevelExp={userData.nextLevelExp}
          currentLevelName={currentLevelDetails.name}
          nextLevelName={nextLevelDetails.name}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <WritingStatsCard stats={mockWritingStats} />
        <WritingAchievements achievements={mockAchievements} />
      </div>

      <RewardsSection
        currentLevel={userData.level}
        levelRewards={levelRewards}
        currentLevelDetails={currentLevelDetails}
        nextLevelDetails={nextLevelDetails}
      />
    </div>
  )
}
