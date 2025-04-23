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
    <Card className="border-none shadow-2xl overflow-hidden bg-white relative rounded-3xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-100/20 to-sky-300/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-100/20 to-amber-300/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

      <CardHeader className="relative z-10 border-b pb-6">
        {/* Reverted "Writer's Level Path" Section to Original Design */}
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-amber-500" />
          Writer's Level Path
        </CardTitle>
        <CardDescription className="text-slate-500">
          Your journey from novice to writing maestro
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 pt-6 pb-8">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-100 via-sky-200 to-sky-100 rounded-full" />
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
  const isLocked = milestone.level > userData.level

  const progress =
    isCurrent && milestone.xp > 0 ? Math.min((userData.xp / milestone.xp) * 100, 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex flex-col sm:flex-row sm:items-start gap-6 transition-all transform hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 shadow-lg transition-all">
        {isCurrent && (
          <span className="absolute -inset-1 rounded-full bg-amber-100 opacity-50 blur-lg animate-pulse"></span>
        )}
        <div
          className={`relative z-10 flex items-center justify-center w-full h-full rounded-full font-bold text-xl
            ${
              isAchieved
                ? "bg-gradient-to-br from-sky-100 to-sky-50 border-sky-300 text-sky-600"
                : isCurrent
                ? "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-300 text-amber-600"
                : "bg-gradient-to-br from-slate-100 to-white border-slate-200 text-slate-400"
            }`}
        >
          {milestone.level}
        </div>
      </div>

      <div
        className={`flex-1 p-6 rounded-xl transition-all shadow-md ${
          isAchieved
            ? "bg-gradient-to-br from-sky-50/70 to-white border border-sky-100 shadow-lg"
            : isCurrent
            ? "bg-gradient-to-br from-amber-50/70 to-white border border-amber-100 shadow-md"
            : "bg-gradient-to-br from-slate-50/50 to-white border border-slate-100 shadow-sm"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold text-xl text-slate-800">{milestone.name}</h4>
          <MilestoneBadge milestone={milestone} userData={userData} />
        </div>

        <p className="text-sm text-slate-600 mb-3">
          {milestone.level === 1
            ? "Starting point of your writing journey"
            : `Requires ${milestone.xp.toLocaleString()} XP to unlock`}
        </p>

        {isCurrent && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>{userData.xp.toLocaleString()} XP</span>
              <span>{milestone.xp.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {milestoneRewards.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Rewards at this level:
            </h5>
            <div className="space-y-2">
              {milestoneRewards.map((reward, rewardIndex) => (
                <motion.div
                  key={reward.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: rewardIndex * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg shadow-md"
                >
                  <div
                    className={`p-1.5 rounded-lg ${
                      reward.unlocked
                        ? "bg-gradient-to-br from-sky-100 to-sky-50 text-sky-600"
                        : "bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500"
                    }`}
                  >
                    {reward.icon}
                  </div>
                  <span className="font-medium text-slate-700">{reward.name}</span>
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
      <Badge className="border border-white/30 bg-gradient-to-r from-sky-500 to-sky-400 shadow text-white py-1">
        <Check className="h-3 w-3 mr-1.5" fill="white" /> Achieved
      </Badge>
    )
  } else if (milestone.level === userData.level) {
    return (
      <Badge className="border border-white/30 bg-gradient-to-r from-amber-500 to-amber-400 shadow text-white py-1">
        <Star className="h-3 w-3 mr-1.5" fill="white" /> Current
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 py-1">
        <Lock className="h-3 w-3 mr-1.5" /> Locked
      </Badge>
    )
  }
}
