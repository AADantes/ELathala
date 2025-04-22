// User data types
export interface UserData {
  username: string
  level: number
  currentExp: number
  nextLevelExp: number
  credits: number
  dailyCreditLimit: number
  wordsWritten: number
  streakDays: number
  // Add any additional user data fields here
}

// Level reward types
export interface LevelReward {
  level: number
  name: string
  expRequired: number
  rewards: string[]
}

// Achievement types
export interface Achievement {
  id: number
  name: string
  description: string
  progress: number
  target: number
  completed: boolean
  icon: any // Using any for simplicity, but ideally would be more specific
  reward: string
}

// Writing stats types
export interface WritingStats {
  today: {
    wordsWritten: number
    timeSpent: string
    sessionsCompleted: number
  }
  week: {
    wordsWritten: number
    timeSpent: string
    sessionsCompleted: number
    avgWordsPerDay: number
  }
  month: {
    wordsWritten: number
    timeSpent: string
    sessionsCompleted: number
    avgWordsPerDay: number
  }
  genres: Array<{
    name: string
    count: number
  }>
  achievements: {
    completed: number
    inProgress: number
    total: number
  }
}

