import type { ReactNode } from "react"

export interface UserData {
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  wordsWritten: number
  daysStreak: number
  articlesPublished: number
  followers: number
  likes: number
}

export interface Reward {
  id: number
  level: number
  name: string
  description: string
  icon: ReactNode
  unlocked: boolean
}

export interface LevelMilestone {
  level: number
  name: string
  xp: number
}
