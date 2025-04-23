"use client"

import { motion } from "framer-motion"
import { Gift, Lock, Unlock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Reward } from "@/lib/types"

interface RewardsGalleryProps {
  rewardsData: Reward[]
}

export function RewardsGallery({ rewardsData }: RewardsGalleryProps) {
  return (
    <Card className="border-none shadow-xl overflow-hidden bg-white">
      <CardHeader className="relative z-10 border-b border-slate-100 pb-6 bg-white">
        <CardTitle className="text-2xl font-bold text-sky-800 flex items-center">
          <Gift className="h-6 w-6 mr-2 text-black" /> {/* Ensuring Gift icon is black */}
          Rewards Gallery
        </CardTitle>
        <CardDescription className="text-black/80">
          Unlock these rewards as you level up your writing
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 pt-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewardsData.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RewardCard({ reward }: { reward: Reward }) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 10px 25px rgba(56, 189, 248, 0.15)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`flex flex-col p-5 rounded-xl border transition-all duration-300 ${
        reward.unlocked
          ? "border-sky-100 bg-gradient-to-br from-sky-50/60 to-white"
          : "border-slate-100 bg-gradient-to-br from-slate-50/60 to-white"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-xl shadow-inner ${
            reward.unlocked
              ? "bg-white" // Ensure the background is white when unlocked
              : "bg-white" // Ensure the background is white when locked
          }`}
        >
          {/* Ensure the icon itself is black */}
          <span className="text-black">{reward.icon}</span>
        </div>
        {reward.unlocked ? (
          <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white border-none shadow-sm py-1">
            <Unlock className="h-3 w-3 mr-1.5 text-black" /> {/* Unlock icon color changed to black */}
            Unlocked
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-white text-black border-slate-200 py-1">
            <Lock className="h-3 w-3 mr-1.5 text-black" /> {/* Lock icon color changed to black */}
            Level {reward.level}
          </Badge>
        )}
      </div>

      <h4 className="font-semibold text-sky-800 text-lg mb-2">{reward.name}</h4>
      <p className="text-sm text-black/80 mb-4 flex-grow">{reward.description}</p>

      {reward.unlocked ? (
        <Button
          size="sm"
          className="mt-auto bg-gradient-to-r from-sky-700 to-sky-600 hover:from-sky-800 hover:to-sky-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          Use Reward
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          disabled
          className="mt-auto border-sky-600 text-sky-700 opacity-50 cursor-not-allowed"
        >
          <Lock className="h-3.5 w-3.5 mr-1.5 text-black" /> {/* Lock icon color changed to black */}
          Locked
        </Button>
      )}
    </motion.div>
  )
}
