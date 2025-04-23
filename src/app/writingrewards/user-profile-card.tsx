"use client"

import type React from "react"
import { motion } from "framer-motion"
import { BookOpen, Clock, Edit3, Heart, Star } from "lucide-react"
import { Badge } from "@/app/writingrewards/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/writingrewards/ui/card"
import type { UserData, LevelMilestone } from "@/app/writingrewards/lib/types"

interface UserProfileCardProps {
  userData: UserData
  levelMilestones: LevelMilestone[]
  progressValue: number
}

export function UserProfileCard({ userData, levelMilestones, progressValue }: UserProfileCardProps) {
  return (
    <Card className="overflow-hidden border border-slate-200 shadow-lg bg-white relative">
      {/* Decorative gradient blurs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-100/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl pointer-events-none"></div>

      {/* Header */}
      <CardHeader className="pb-2 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-4xl font-semibold text-slate-800">
              {userData.name}
            </CardTitle>
            <CardDescription className="text-base text-slate-500 mt-2">
              Level {userData.level} • {levelMilestones[userData.level - 1].name}
            </CardDescription>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 border-none shadow text-white py-1.5">
            <Star className="h-4 w-4 mr-1.5" fill="white" />
            Level {userData.level}
          </Badge>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="relative z-10">
        <div className="space-y-8">
          {/* XP Section */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-yellow-500 font-semibold text-xl">
                XP: {userData.xp.toLocaleString()}
              </span>
              <span className="text-slate-500">
                / {userData.xpToNextLevel.toLocaleString()}
              </span>
            </div>

            {/* Sky blue gradient XP bar */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-sm">
              <div
                className="h-full bg-gradient-to-r from-sky-200 to-sky-600 transition-all duration-700 ease-out"
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-400 text-right mt-2">
              {Math.round(userData.xpToNextLevel - userData.xp).toLocaleString()} XP until next level
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
            <StatCard
              icon={<BookOpen className="h-6 w-6" />}
              value={userData.wordsWritten.toLocaleString()}
              label="Words Written"
              color="blue"
            />
            <StatCard
              icon={<Clock className="h-6 w-6" />}
              value={userData.daysStreak.toString()}
              label="Day Streak"
              color="amber"
            />
            <StatCard
              icon={<Edit3 className="h-6 w-6" />}
              value={userData.articlesPublished.toString()}
              label="Published"
              color="emerald"
            />
            <StatCard
              icon={<Heart className="h-6 w-6" />}
              value={userData.likes.toString()}
              label="Likes"
              color="rose"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
  color: "blue" | "amber" | "emerald" | "rose"
}

function StatCard({ icon, value, label, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="flex flex-col items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
    >
      <div className={`${colorClasses[color]} p-3 rounded-full mb-3`}>
        {icon}
      </div>
      <span className="text-2xl font-semibold text-slate-800">{value}</span>
      <span className="text-xs text-slate-500 mt-1">{label}</span>
    </motion.div>
  )
}
