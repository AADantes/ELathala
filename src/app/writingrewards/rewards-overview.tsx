"use client"

import { motion } from "framer-motion"
import { Trophy, Bookmark, Pen } from "lucide-react" // Importing Pen icon
import { Badge } from "@/app/writingrewards/ui/badge"
import { Button } from "@/app/writingrewards/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/writingrewards/ui/card"
import type { Reward } from "@/app/writingrewards/lib/types"

interface RewardsOverviewProps {
  rewardsData: Reward[]
  setActiveTab: (tab: string) => void
}

export function RewardsOverview({ rewardsData, setActiveTab }: RewardsOverviewProps) {
  return (
    <Card className="border border-gray-200 bg-white rounded-xl w-full max-w-full overflow-hidden relative">
      {/* Header */}
      <CardHeader className="relative z-10 border-b pb-6 bg-white">
        <CardTitle className="text-2xl font-bold text-black flex items-center">
          <Pen className="h-5 w-5 mr-2 text-black" /> {/* Adding Pen icon */}
          Your Writing Journey
        </CardTitle>
        <CardDescription className="text-gray-600">
          Track your progress and unlock rewards as you write more
        </CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent className="relative z-10 pt-6 space-y-8 bg-white">
        <CurrentPerks rewardsData={rewardsData} />
        <NextReward rewardsData={rewardsData} />
      </CardContent>

      {/* Footer */}
      <CardFooter className="border-t mt-6 pt-6 bg-white">
        <Button
          onClick={() => setActiveTab("rewards")}
          className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-200"
        >
          View All Rewards
        </Button>
      </CardFooter>
    </Card>
  )
}

function CurrentPerks({ rewardsData }: { rewardsData: Reward[] }) {
  const unlockedRewards = rewardsData.filter((reward) => reward.unlocked)

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-black flex items-center">
        <Trophy className="h-5 w-5 mr-2 text-black" />
        Current Perks
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {unlockedRewards.map((reward) => (
          <motion.div
            key={reward.id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all w-full"
          >
            <div className="p-3 rounded-xl text-black border border-gray-100 bg-white">
              <span className="text-black">{reward.icon}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-black">{reward.name}</h4>
              <p className="text-sm text-gray-700 mt-1">{reward.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function NextReward({ rewardsData }: { rewardsData: Reward[] }) {
  const nextReward = rewardsData.find((reward) => !reward.unlocked)

  if (!nextReward) return null

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-black flex items-center">
        <Bookmark className="h-5 w-5 mr-2 text-black" />
        Next Reward
      </h3>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="flex items-start gap-4 p-5 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 w-full"
      >
        <div className="p-3 rounded-xl text-black border border-gray-100 bg-white">
          <span className="text-black">{nextReward.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-semibold text-black">{nextReward.name}</h4>
            <Badge variant="outline" className="text-xs bg-white text-gray-800 border-gray-300">
              Level {nextReward.level}
            </Badge>
          </div>
          <p className="text-sm text-gray-700">{nextReward.description}</p>
        </div>
      </motion.div>
    </div>
  )
}
