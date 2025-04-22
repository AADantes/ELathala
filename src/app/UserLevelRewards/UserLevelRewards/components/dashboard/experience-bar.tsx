"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { calculatePercentage } from "@/lib/utils"
import { HiChevronRight } from 'react-icons/hi'

interface ExperienceBarProps {
  level: number
  currentExp: number
  nextLevelExp: number
  currentLevelName: string
  nextLevelName: string
}

export function ExperienceBar({
  level,
  currentExp,
  nextLevelExp,
  currentLevelName,
  nextLevelName,
}: ExperienceBarProps) {
  // Calculate experience percentage for progress bar
  const expPercentage = calculatePercentage(currentExp, nextLevelExp)

  return (
    <Card className="mb-8 overflow-hidden card-hover-effect rounded-lg border border-gray-200 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center text-black font-semibold text-2xl">
          Writing Progress
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Level {level} • {currentExp} / {nextLevelExp} XP
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative pt-1">
          <div className="mb-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="progress-bar relative w-full h-6 bg-gray-200 rounded-full">
                    <div
                      style={{ width: `${expPercentage}%` }}
                      className="transition-all duration-700 ease-out bg-gradient-to-r from-teal-400 to-cyan-500 dark:from-teal-500 dark:to-cyan-600 rounded-full shadow-lg"
                    ></div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white p-3 rounded-md shadow-md transition-all duration-300 transform scale-95 hover:scale-100">
                  <p className="text-sm">
                    {currentExp} / {nextLevelExp} XP ({expPercentage.toFixed(1)}%)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="absolute top-1 left-0 w-full h-6 flex items-center justify-between px-3 pointer-events-none">
              <div className="text-xs font-medium text-white z-10">Level {level}</div>
              <div className="text-xs font-medium text-white z-10">Level {level + 1}</div>
            </div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span className="text-gray-700">{currentLevelName}</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">{nextLevelName}</span>
              <HiChevronRight className="text-sm text-gray-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
