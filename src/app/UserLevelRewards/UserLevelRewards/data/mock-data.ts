import type { UserData, Achievement, WritingStats } from "@/types"
import { BookOpen, Edit, FileText, Star, Target } from "lucide-react"

// Mock user data
export const mockUserData: UserData = {
  username: "Alex Johnson",
  level: 4,
  currentExp: 1250,
  nextLevelExp: 2000,
  credits: 750,
  dailyCreditLimit: 200,
  wordsWritten: 25430,
  streakDays: 12,
}

// Mock achievements data
export const mockAchievements: Achievement[] = [
  {
    id: 1,
    name: "Word Count Warrior",
    description: "Write 50,000 words total",
    progress: 25430,
    target: 50000,
    completed: false,
    icon: FileText,
    reward: "+500 XP",
  },
  {
    id: 2,
    name: "Consistent Creator",
    description: "Maintain a 30-day writing streak",
    progress: 12,
    target: 30,
    completed: false,
    icon: Target,
    reward: "+750 XP",
  },
  {
    id: 3,
    name: "Genre Explorer",
    description: "Write in 5 different genres",
    progress: 3,
    target: 5,
    completed: false,
    icon: BookOpen,
    reward: "+300 XP",
  },
  {
    id: 4,
    name: "Feedback Seeker",
    description: "Receive feedback on 10 pieces",
    progress: 10,
    target: 10,
    completed: true,
    icon: Edit,
    reward: "+400 XP",
  },
  {
    id: 5,
    name: "Daily Dedication",
    description: "Write 500+ words for 7 consecutive days",
    progress: 5,
    target: 7,
    completed: false,
    icon: Star,
    reward: "+250 XP",
  },
]

// Mock writing stats data
export const mockWritingStats: WritingStats = {
  today: {
    wordsWritten: 1250,
    timeSpent: "1h 45m",
    sessionsCompleted: 2,
  },
  week: {
    wordsWritten: 8750,
    timeSpent: "12h 30m",
    sessionsCompleted: 9,
    avgWordsPerDay: 1250,
  },
  month: {
    wordsWritten: 25430,
    timeSpent: "45h 15m",
    sessionsCompleted: 28,
    avgWordsPerDay: 847,
  },
  genres: [
    { name: "Fiction", count: 12500 },
    { name: "Non-fiction", count: 8200 },
    { name: "Poetry", count: 4730 },
  ],
  achievements: {
    completed: 4,
    inProgress: 5,
    total: 9,
  },
}

