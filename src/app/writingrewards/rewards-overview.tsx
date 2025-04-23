"use client"

import { motion } from "framer-motion"
import { Trophy, Bookmark } from "lucide-react"
import { Badge } from "@/app/writingrewards/ui/badge"
import { Button } from "@/app/writingrewards/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/writingrewards/ui/card"
import type { Reward } from "@/app/writingrewards/lib/types"

interface RewardsOverviewProps {
  rewardsData: Reward[]
  setActiveTab: (tab: string) => void
}

export function RewardsOverview({ rewardsData, setActiveTab }: RewardsOverviewProps) {
  return (
    <Card className="border-none shadow-lg bg-white rounded-xl w-full max-w-full overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-blue-300/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />

      {/* Header */}
      <CardHeader className="relative z-10 border-b pb-6">
        <CardTitle className="text-2xl font-bold text-sky-800">Your Writing Journey</CardTitle>
        <CardDescription className="text-slate-500">
          Track your progress and unlock rewards as you write more
        </CardDescription>
      </CardHeader>

      {/* Content */}
      <CardContent className="relative z-10 pt-6 space-y-8">
        <CurrentPerks rewardsData={rewardsData} />
        <NextReward rewardsData={rewardsData} />
      </CardContent>

      {/* Footer */}
      <CardFooter className="border-t mt-6 pt-6">
        <Button
          onClick={() => setActiveTab("rewards")}
          className="w-full bg-gradient-to-r from-sky-800 to-sky-700 hover:from-sky-900 hover:to-sky-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
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
      <h3 className="text-lg font-semibold mb-4 text-sky-800 flex items-center">
        <Trophy className="h-5 w-5 mr-2 text-black" />
        Current Perks
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {unlockedRewards.map((reward) => (
          <motion.div
            key={reward.id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-gradient-to-br from-white to-slate-50 shadow hover:shadow-lg transition-all w-full"
          >
            <div className="bg-gradient-to-br p-3 rounded-xl text-black shadow-sm">
              <span className="text-black">{reward.icon}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sky-800">{reward.name}</h4>
              <p className="text-sm text-black mt-1">{reward.description}</p>
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
      <h3 className="text-lg font-semibold mb-4 text-sky-800 flex items-center">
        <Bookmark className="h-5 w-5 mr-2 text-black" />
        Next Reward
      </h3>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="flex items-start gap-4 p-5 border border-amber-100 rounded-xl bg-gradient-to-br from-amber-50/50 to-white shadow-lg w-full"
      >
        <div className="bg-gradient-to-br p-3 rounded-xl text-black shadow-sm">
          <span className="text-black">{nextReward.icon}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-semibold text-sky-800">{nextReward.name}</h4>
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              Level {nextReward.level}
            </Badge>
          </div>
          <p className="text-sm text-black">{nextReward.description}</p>
        </div>
      </motion.div>
    </div>
  )
}
