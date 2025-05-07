"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Zap, Edit3, Clock, BookOpen, Heart } from "lucide-react"
import { Badge } from "@/app/writingrewards/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/writingrewards/ui/card"

export function XPActivities() {
  return (
    <Card className="border-none shadow-lg overflow-hidden bg-white relative">
      {/* Decorative background blur */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-200/30 to-gray-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none"></div>

      <CardHeader className="relative z-10 border-b pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center tracking-tight">
          <Zap className="h-5 w-5 mr-2 text-yellow-500" />
          How to Earn XP
        </CardTitle>
        <CardDescription className="text-gray-500">
          Complete these activities to level up faster
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 pt-6 space-y-4">
        <XPActivity icon={<Edit3 className="h-5 w-5 text-blue-500" />} activity="Write 500 words" xp={50} />
        <XPActivity icon={<Clock className="h-5 w-5 text-purple-500" />} activity="Daily writing streak" xp={20} />
        <XPActivity icon={<BookOpen className="h-5 w-5 text-green-600" />} activity="Publish an article" xp={100} />
        <XPActivity icon={<Heart className="h-5 w-5 text-red-500" />} activity="Receive 10 likes" xp={30} />
      </CardContent>
    </Card>
  )
}

interface XPActivityProps {
  icon: React.ReactNode
  activity: string
  xp: number
}

function XPActivity({ icon, activity, xp }: XPActivityProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="flex justify-between items-center p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-2 rounded-lg border border-gray-200 shadow-inner">
          {icon}
        </div>
        <span className="text-base font-semibold text-gray-800 tracking-tight">{activity}</span>
      </div>
      <Badge className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-sm shadow-md border-2 border-yellow-600 tracking-wide flex items-center gap-1">
        <Zap className="h-3.5 w-3.5 text-white" />
        +{xp} XP
      </Badge>
    </motion.div>
  )
}
