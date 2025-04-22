// This file contains theme configuration that can be easily edited

export const themeConfig = {
  // Color scheme for the application
  colors: {
    // Primary colors used for main UI elements
    primary: {
      light: "#3b82f6", // Blue
      dark: "#60a5fa",
    },
    // Secondary colors for less prominent elements
    secondary: {
      light: "#0ea5e9", // Sky blue
      dark: "#38bdf8",
    },
    // Accent colors for highlights and special elements
    accent: {
      light: "#6366f1", // Indigo
      dark: "#818cf8",
    },
    // Colors for different achievement types
    achievement: {
      completed: "#10b981", // Emerald
      inProgress: "#3b82f6", // Blue
    },
  },

  // Customizable level names and requirements
  levels: [
    { level: 1, name: "Novice Writer", expRequired: 0 },
    { level: 2, name: "Aspiring Author", expRequired: 500 },
    { level: 3, name: "Dedicated Wordsmith", expRequired: 1000 },
    { level: 4, name: "Prolific Writer", expRequired: 2000 },
    { level: 5, name: "Accomplished Author", expRequired: 3500 },
    { level: 6, name: "Master Storyteller", expRequired: 5500 },
    { level: 7, name: "Writing Virtuoso", expRequired: 8000 },
    { level: 8, name: "Literary Craftsman", expRequired: 12000 },
    { level: 9, name: "Writing Maestro", expRequired: 18000 },
    { level: 10, name: "Legendary Author", expRequired: 25000 },
  ],

  // Rewards configuration per level
  rewards: {
    1: ["Basic editor access", "5 daily AI assists"],
    2: ["Grammar checker", "10 daily AI assists"],
    3: ["Style suggestions", "15 daily AI assists", "1 premium template"],
    4: ["Advanced editing tools", "20 daily AI assists", "3 premium templates"],
    5: ["Plagiarism checker", "30 daily AI assists", "All basic templates"],
    6: ["AI plot generator", "40 daily AI assists", "Character development tools"],
    7: ["Advanced analytics", "50 daily AI assists", "Publishing assistance"],
    8: ["Collaborative editing", "75 daily AI assists", "SEO optimization tools"],
    9: ["Custom writing workflows", "100 daily AI assists", "Priority feedback"],
    10: ["Unlimited AI assistance", "All premium features", "Mentor status", "Revenue sharing options"],
  },

  // UI customization options
  ui: {
    borderRadius: "0.75rem",
    cardShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    progressBarHeight: "2rem",
  },
}

// Helper function to get level details
export function getLevelDetails(level: number) {
  return {
    ...themeConfig.levels.find((l) => l.level === level),
    rewards: themeConfig.rewards[level as keyof typeof themeConfig.rewards] || [],
  }
}

// Helper function to get all level details with rewards
export function getAllLevelDetails() {
  return themeConfig.levels.map((level) => ({
    ...level,
    rewards: themeConfig.rewards[level.level as keyof typeof themeConfig.rewards] || [],
  }))
}

