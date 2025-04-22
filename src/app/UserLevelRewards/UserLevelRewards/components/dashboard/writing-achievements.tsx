"use client"

import { Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Achievement } from "@/types"
import { calculatePercentage } from "@/lib/utils"

// Type for the props
interface WritingAchievementsProps {
  achievements: Achievement[]
}

// Function to get a color based on achievement type or progress
const getAchievementColor = (achievement: Achievement) => {
  if (achievement.completed) {
    return {
      bg: "bg-teal-100 dark:bg-teal-900/30",
      text: "text-teal-600 dark:text-teal-400",
      progress: "bg-teal-500",
    }
  }

  // Different colors based on progress percentage
  const progress = calculatePercentage(achievement.progress, achievement.target)
  if (progress > 75) {
    return {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      progress: "bg-blue-500",
    }
  } else if (progress > 50) {
    return {
      bg: "bg-sky-100 dark:bg-sky-900/30",
      text: "text-sky-600 dark:text-sky-400",
      progress: "bg-sky-500",
    }
  } else if (progress > 25) {
    return {
      bg: "bg-teal-100 dark:bg-teal-900/30",
      text: "text-teal-600 dark:text-teal-400",
      progress: "bg-teal-500",
    }
  } else {
    return {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-600 dark:text-gray-400",
      progress: "bg-gray-500",
    }
  }
}

export default function WritingAchievements({ achievements }: WritingAchievementsProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-t-xl p-6">
        <CardTitle className="text-2xl font-semibold">Writing Achievements</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Complete challenges to earn XP and rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {achievements.map((achievement) => {
          const colors = getAchievementColor(achievement)
          return (
            <div
              key={achievement.id}
              className="achievement-card p-4 rounded-lg border transition-all duration-300 transform hover:scale-105 hover:border-teal-400"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${colors.bg}`}>
                  <achievement.icon className={`h-6 w-6 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">{achievement.name}</h3>
                    <Badge variant={achievement.completed ? "success" : "secondary"} className="capitalize">
                      {achievement.completed ? (
                        <span className="flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Completed
                        </span>
                      ) : (
                        achievement.reward
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{achievement.description}</p>
                </div>
              </div>

              {!achievement.completed && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>
                      {achievement.progress} / {achievement.target}
                    </span>
                    <span>{calculatePercentage(achievement.progress, achievement.target)}%</span>
                  </div>
                  <Progress
                    value={calculatePercentage(achievement.progress, achievement.target)}
                    className={`h-2 rounded-full bg-gray-100 dark:bg-gray-800`}
                    indicatorClassName={`${colors.progress} transition-all duration-500 ease-out`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
