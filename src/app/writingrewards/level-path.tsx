"use client"

import { motion } from "framer-motion"
import { Trophy, Check, Star, Lock } from "lucide-react"
import { Badge } from "@/app/writingrewards/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/writingrewards/ui/card"
import type { LevelMilestone, UserData, Reward } from "@/app/writingrewards/lib/types"

interface LevelPathProps {
  levelMilestones: LevelMilestone[]
  userData: UserData
  rewardsData: Reward[]
}

export function LevelPath({ levelMilestones, userData, rewardsData }: LevelPathProps) {
  return (
    <Card className="border-none bg-white relative rounded-md">
      <CardHeader className="relative z-10 border-b pb-6 bg-white rounded-md">
        <CardTitle className="text-2xl font-bold text-black flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-black" />
          Writer's Level Path
        </CardTitle>
        <CardDescription className="text-black/80">
          Your journey from novice to writing maestro
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 pt-6 pb-8">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-yellow-300 rounded-md" />
          <div className="space-y-12">
            {levelMilestones.map((milestone, index) => (
              <LevelMilestoneCard
                key={milestone.level}
                milestone={milestone}
                index={index}
                userData={userData}
                rewardsData={rewardsData}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface LevelMilestoneCardProps {
  milestone: LevelMilestone
  index: number
  userData: UserData
  rewardsData: Reward[]
}

function LevelMilestoneCard({ milestone, index, userData, rewardsData }: LevelMilestoneCardProps) {
  const milestoneRewards = rewardsData.filter((r) => r.level === milestone.level)

  const isAchieved = milestone.level < userData.level
  const isCurrent = milestone.level === userData.level

  const progress =
    isCurrent && milestone.xp > 0 ? Math.min((userData.xp / milestone.xp) * 100, 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex flex-col sm:flex-row sm:items-start gap-6 transition-all"
    >
      {/* Level Circle */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
        className={`relative z-10 flex items-center justify-center w-16 h-16 bg-white border-2 rounded-full border-dashed ${
          isCurrent ? "border-yellow-400 animate-pulse" : isAchieved ? "border-gray-400" : "border-gray-200"
        }`}
      >
        <div
          className={`text-xl font-bold ${
            isAchieved ? "text-gray-700" : isCurrent ? "text-yellow-500" : "text-gray-400"
          }`}
        >
          {milestone.level}
        </div>
      </motion.div>

      {/* Content Box */}
      <div
        className={`flex-1 p-5 bg-white border rounded-md transition-all ${
          isAchieved
            ? "border-gray-300"
            : isCurrent
            ? "border-yellow-300"
            : "border-gray-100"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-xl text-black">{milestone.name}</h4>
          <MilestoneBadge milestone={milestone} userData={userData} />
        </div>

        <p className="text-sm text-black/80 mb-3">
          {milestone.level === 1
            ? "Starting point of your writing journey"
            : `Requires ${milestone.xp.toLocaleString()} XP to unlock`}
        </p>

        {isCurrent && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>{userData.xp.toLocaleString()} XP</span>
              <span>{milestone.xp.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-yellow-400"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {milestoneRewards.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Rewards at this level:
            </h5>
            <div className="space-y-2">
              {milestoneRewards.map((reward, rewardIndex) => (
                <motion.div
                  key={reward.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: rewardIndex * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-100"
                >
                  <div className="p-1.5 text-black">{reward.icon}</div>
                  <span className="font-medium text-black">{reward.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function MilestoneBadge({ milestone, userData }: { milestone: LevelMilestone; userData: UserData }) {
  if (milestone.level < userData.level) {
    return (
      <Badge className="bg-gradient-to-r from-green-500 to-green-400 text-white border-none py-1 px-2 rounded-md">
        <Check className="h-3 w-3 mr-1.5 text-white" /> Achieved
      </Badge>
    )
  } else if (milestone.level === userData.level) {
    return (
      <Badge className="bg-yellow-500 text-white border-none py-1 px-2 rounded-md">
        <Star className="h-3 w-3 mr-1.5 text-white" /> Current
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="bg-white text-gray-500 border-gray-200 py-1 px-2 rounded-md">
        <Lock className="h-3 w-3 mr-1.5 text-gray-400" /> Locked
      </Badge>
    )
  }
}
