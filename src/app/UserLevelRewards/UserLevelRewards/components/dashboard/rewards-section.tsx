import { ChevronRight, Gift, BookOpen, Feather } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import type { LevelReward } from "@/types"

// Function to get a color based on level
const getLevelColor = (level: number, currentLevel: number) => {
  if (level > currentLevel) {
    return {
      bg: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
      text: "text-gray-500 dark:text-gray-400",
      border: "border-gray-300 dark:border-gray-700",
      item: "bg-gray-200/70 dark:bg-gray-800/20",
    }
  }

  return {
    bg: "bg-teal-600 text-white",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-300 dark:border-teal-800/50",
    item: "bg-teal-100/70 dark:bg-teal-900/20",
  }
}

interface RewardsSectionProps {
  currentLevel: number
  levelRewards: LevelReward[]
  currentLevelDetails: LevelReward | undefined
  nextLevelDetails: LevelReward | undefined
}

export function RewardsSection({
  currentLevel,
  levelRewards,
  currentLevelDetails,
  nextLevelDetails,
}: RewardsSectionProps) {
  return (
    <Tabs defaultValue="all-rewards" className="w-full">
      {/* Tabs List */}
      <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
        <TabsTrigger
          value="all-rewards"
          className="px-6 py-2 rounded-md font-medium transition-all data-[state=active]:bg-sky-800 data-[state=active]:text-white dark:data-[state=active]:bg-sky-600"
        >
          All Writing Tools
        </TabsTrigger>
        <TabsTrigger
          value="current-rewards"
          className="px-6 py-2 rounded-md font-medium transition-all data-[state=active]:bg-sky-800 data-[state=active]:text-white dark:data-[state=active]:bg-sky-600"
        >
          Your Writing Tools
        </TabsTrigger>
      </TabsList>

      {/* All Writing Tools Content */}
      <TabsContent value="all-rewards" className="mt-4">
        <Card className="overflow-hidden shadow-lg rounded-lg">
          <CardHeader className="bg-gray-100 dark:bg-gray-800 py-3">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Writing Rewards By Level</CardTitle>
            <CardDescription className="text-sm text-gray-700 dark:text-gray-300">Unlock new writing tools as you level up</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {levelRewards.map((reward) => {
              const colors = getLevelColor(reward.level, currentLevel)
              return (
                <motion.div
                  key={reward.level}
                  className="relative bg-white shadow-md rounded-lg border hover:border-teal-300 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start p-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${colors.bg}`}>
                      {reward.level}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className={`text-lg font-medium ${reward.level <= currentLevel ? "" : "text-muted-foreground"}`}>
                          {reward.name}
                        </h3>
                        {reward.level === currentLevel && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {reward.level > 1 ? `${reward.expRequired} XP required` : "Starting level"}
                      </p>
                    </div>
                  </div>
                  <Separator />
                </motion.div>
              )
            })}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Your Writing Tools Content */}
      <TabsContent value="current-rewards" className="mt-4">
        <Card className="overflow-hidden bg-white text-gray-900 shadow-xl rounded-lg">
          <CardHeader className="p-4 bg-gray-100 dark:bg-gray-800">
            <CardTitle className="text-2xl font-medium text-gray-900 dark:text-white">Your Writing Tools</CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
              Level {currentLevel} - {currentLevelDetails?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            {/* Unlocking Prolific Writer Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="p-4 bg-teal-50 text-teal-800 rounded-lg shadow-sm"
            >
              <h4 className="text-xl font-semibold">Unlocking {currentLevelDetails?.name}</h4>
              <p className="mt-2 text-sm text-teal-700">
                As you level up, you will unlock more powerful writing tools. Each tool brings new features to improve your writing process and enhance creativity.
              </p>
            </motion.div>

            {/* Start Writing Button */}
            <div className="flex justify-center mt-6">
              <motion.div
                whileHover={{ y: -2 }} // Moves the button up on hover
                whileTap={{ scale: 0.98 }} // Slightly shrinks on tap
                transition={{ type: "spring", stiffness: 300, damping: 20 }} // Smooth transition
                className="shadow-md hover:shadow-lg rounded-lg transform transition-all duration-200"
              >
                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-lg transition-all duration-200 flex items-center space-x-3"
                >
                  <span className="font-medium text-md">Start Writing</span>
                  <motion.div
                    animate={{ y: [0, -5, 0] }} // Bouncing effect
                    transition={{
                      y: {
                        duration: 1,
                        repeat: Infinity, // Infinite bounce
                        repeatType: "reverse", // Reverse bounce direction
                        ease: "easeInOut", // Smooth easing
                      },
                    }}
                  >
                    <Feather className="h-5 w-5 ml-2" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>

            {/* Level Badge with gradient and hover shadow moved to the top-right corner */}
            <div className="absolute top-4 right-4">
              <span
                className={`rounded-full text-white px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md ${
                  currentLevel === 4 ? "bg-sky-500" : "bg-gray-400"
                }`}
                style={{
                  transform: "scale(1.1)", // Slightly larger for emphasis
                  transition: "transform 0.2s ease-in-out", // Smooth scale transition
                }}
              >
                Level {currentLevel}
              </span>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
