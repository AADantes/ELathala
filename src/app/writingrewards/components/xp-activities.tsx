"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Zap, Edit3, Clock, BookOpen, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function XPActivities() {
  return (
    <Card className="border-none shadow-lg overflow-hidden bg-white relative">
      {/* Decorative background blur */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-100/20 to-blue-300/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none"></div>

      <CardHeader className="relative z-10 border-b pb-6">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-amber-500" />
          How to Earn XP
        </CardTitle>
        <CardDescription className="text-slate-500">
          Complete these activities to level up faster
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 pt-6 space-y-4">
        <XPActivity icon={<Edit3 className="h-5 w-5" />} activity="Write 500 words" xp={50} color="blue" />
        <XPActivity icon={<Clock className="h-5 w-5" />} activity="Daily writing streak" xp={20} color="amber" />
        <XPActivity icon={<BookOpen className="h-5 w-5" />} activity="Publish an article" xp={100} color="emerald" />
        <XPActivity icon={<Heart className="h-5 w-5" />} activity="Receive 10 likes" xp={30} color="rose" />
      </CardContent>
    </Card>
  )
}

interface XPActivityProps {
  icon: React.ReactNode
  activity: string
  xp: number
  color: "blue" | "amber" | "emerald" | "rose"
}

function XPActivity({ icon, activity, xp, color }: XPActivityProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
  }

  const badgeClasses = {
    blue: "bg-gradient-to-r from-blue-600 to-blue-500",
    amber: "bg-gradient-to-r from-amber-500 to-amber-400",
    emerald: "bg-gradient-to-r from-emerald-600 to-emerald-500",
    rose: "bg-gradient-to-r from-rose-600 to-rose-500",
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-gradient-to-r from-white to-slate-50 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`${colorClasses[color]} p-2 rounded-lg transition-transform`}
        >
          {icon}
        </motion.div>
        <span className="text-base font-medium text-slate-700">{activity}</span>
      </div>
      <Badge className={`${badgeClasses[color]} text-white text-sm px-2.5 py-1 rounded-md shadow`}>
        +{xp} XP
      </Badge>
    </motion.div>
  )
}
