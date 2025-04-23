import { Award, BookOpen, Clock, Crown, Edit3, Gift, Star, Users } from "lucide-react"
import type { UserData, Reward, LevelMilestone } from "@/app/writingrewards/lib/types"

// Mock user data
export const userData: UserData = {
  name: "Alex Johnson",
  level: 4,
  xp: 1250,
  xpToNextLevel: 2000,
  wordsWritten: 45320,
  daysStreak: 12,
  articlesPublished: 8,
  followers: 127,
  likes: 342,
}

// Mock rewards data
export const rewardsData: Reward[] = [
  {
    id: 1,
    level: 1,
    name: "Basic Templates",
    description: "Access to 5 basic writing templates",
    icon: <BookOpen className="h-6 w-6" />,
    unlocked: true,
  },
  {
    id: 2,
    level: 2,
    name: "Custom Profile",
    description: "Customize your writer profile with themes",
    icon: <Edit3 className="h-6 w-6" />,
    unlocked: true,
  },
  {
    id: 3,
    level: 3,
    name: "Writing Analytics",
    description: "Access detailed stats about your writing",
    icon: <Clock className="h-6 w-6" />,
    unlocked: true,
  },
  {
    id: 4,
    level: 4,
    name: "Featured Placement",
    description: "Chance to be featured on the homepage",
    icon: <Star className="h-6 w-6" />,
    unlocked: true,
  },
  {
    id: 5,
    level: 5,
    name: "Premium Templates",
    description: "Access to 10 premium writing templates",
    icon: <Crown className="h-6 w-6" />,
    unlocked: false,
  },
  {
    id: 6,
    level: 6,
    name: "AI Writing Assistant",
    description: "Access to AI-powered writing suggestions",
    icon: <Gift className="h-6 w-6" />,
    unlocked: false,
  },
  {
    id: 7,
    level: 8,
    name: "Monetization",
    description: "Ability to monetize your content",
    icon: <Award className="h-6 w-6" />,
    unlocked: false,
  },
  {
    id: 8,
    level: 10,
    name: "Writer's Guild",
    description: "Exclusive access to the Writer's Guild",
    icon: <Users className="h-6 w-6" />,
    unlocked: false,
  },
]

// Level milestones
export const levelMilestones: LevelMilestone[] = [
  { level: 1, name: "Novice", xp: 0 },
  { level: 2, name: "Apprentice", xp: 500 },
  { level: 3, name: "Wordsmith", xp: 1000 },
  { level: 4, name: "Storyteller", xp: 1500 },
  { level: 5, name: "Author", xp: 2000 },
  { level: 6, name: "Scribe", xp: 3000 },
  { level: 7, name: "Chronicler", xp: 4000 },
  { level: 8, name: "Novelist", xp: 5000 },
  { level: 9, name: "Laureate", xp: 7000 },
  { level: 10, name: "Maestro", xp: 10000 },
]
