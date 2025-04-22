"use client"

import { useState } from "react"
import { ChevronRight, Gift, Star, PenTool, Zap, BookOpen, FileText, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function UserLevelPage() {
  // Change the userData state to include writing-specific metrics
  const [userData] = useState({
    username: "Alex Johnson",
    level: 4,
    currentExp: 1250,
    nextLevelExp: 2000,
    credits: 750,
    dailyCreditLimit: 200,
    wordsWritten: 25430,
    streakDays: 12,
  })

  // Replace the levelRewards array with writing-focused rewards
  const levelRewards = [
    { level: 1, name: "Novice Writer", expRequired: 0, rewards: ["Basic editor access", "5 daily AI assists"] },
    { level: 2, name: "Aspiring Author", expRequired: 500, rewards: ["Grammar checker", "10 daily AI assists"] },
    {
      level: 3,
      name: "Dedicated Wordsmith",
      expRequired: 1000,
      rewards: ["Style suggestions", "15 daily AI assists", "1 premium template"],
    },
    {
      level: 4,
      name: "Prolific Writer",
      expRequired: 2000,
      rewards: ["Advanced editing tools", "20 daily AI assists", "3 premium templates"],
    },
    {
      level: 5,
      name: "Accomplished Author",
      expRequired: 3500,
      rewards: ["Plagiarism checker", "30 daily AI assists", "All basic templates"],
    },
    {
      level: 6,
      name: "Master Storyteller",
      expRequired: 5500,
      rewards: ["AI plot generator", "40 daily AI assists", "Character development tools"],
    },
    {
      level: 7,
      name: "Writing Virtuoso",
      expRequired: 8000,
      rewards: ["Advanced analytics", "50 daily AI assists", "Publishing assistance"],
    },
    {
      level: 8,
      name: "Literary Craftsman",
      expRequired: 12000,
      rewards: ["Collaborative editing", "75 daily AI assists", "SEO optimization tools"],
    },
    {
      level: 9,
      name: "Writing Maestro",
      expRequired: 18000,
      rewards: ["Custom writing workflows", "100 daily AI assists", "Priority feedback"],
    },
    {
      level: 10,
      name: "Legendary Author",
      expRequired: 25000,
      rewards: ["Unlimited AI assistance", "All premium features", "Mentor status", "Revenue sharing options"],
    },
  ]

  // Calculate experience percentage for progress bar
  const expPercentage = Math.min(Math.round((userData.currentExp / userData.nextLevelExp) * 100), 100)

  // Get current level details
  const currentLevelDetails = levelRewards.find((reward) => reward.level === userData.level)

  // Get next level details
  const nextLevelDetails = levelRewards.find((reward) => reward.level === userData.level + 1)

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Writer Level</CardTitle>
            <CardDescription>Your writing expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PenTool className="h-8 w-8 text-primary mr-3" />
              <div>
                <div className="text-2xl font-bold">{userData.level}</div>
                <div className="text-sm text-muted-foreground">{currentLevelDetails?.name}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AI Assists</CardTitle>
            <CardDescription>Your available assists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-amber-500 mr-3" />
              <div>
                <div className="text-2xl font-bold">{userData.credits}</div>
                <div className="text-sm text-muted-foreground">Daily limit: {userData.dailyCreditLimit}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Next Level</CardTitle>
            <CardDescription>Words needed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-8 w-8 text-amber-400 mr-3" />
              <div>
                <div className="text-2xl font-bold">{userData.nextLevelExp - userData.currentExp} XP</div>
                <div className="text-sm text-muted-foreground">To reach Level {userData.level + 1}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Add a fourth card for writing stats after the third card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Writing Stats</CardTitle>
            <CardDescription>Your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm">Words Written</span>
              </div>
              <div className="font-bold">{userData.wordsWritten.toLocaleString()}</div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm">Writing Streak</span>
              </div>
              <div className="font-bold">{userData.streakDays} days</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experience Bar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Writing Progress</CardTitle>
          <CardDescription>
            Level {userData.level} • {userData.currentExp} / {userData.nextLevelExp} XP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pt-1">
            <div className="mb-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Progress value={expPercentage} className="h-8 w-full" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {userData.currentExp} / {userData.nextLevelExp} XP ({expPercentage}%)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="absolute top-1 left-0 w-full h-8 flex items-center justify-between px-3 pointer-events-none">
                <div className="text-xs font-medium text-white z-10">Level {userData.level}</div>
                <div className="text-xs font-medium text-white z-10">Level {userData.level + 1}</div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentLevelDetails?.name}</span>
              <span>{nextLevelDetails?.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Section */}
      <Tabs defaultValue="all-rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-rewards">All Rewards</TabsTrigger>
          <TabsTrigger value="current-rewards">Your Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="all-rewards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Writing Rewards By Level</CardTitle>
              <CardDescription>Unlock new writing tools as you level up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {levelRewards.map((reward) => (
                  <div key={reward.level} className="relative">
                    <div className="flex items-start">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                          reward.level <= userData.level
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {reward.level}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3
                            className={`text-lg font-semibold ${
                              reward.level <= userData.level ? "" : "text-muted-foreground"
                            }`}
                          >
                            {reward.name}
                          </h3>
                          {reward.level === userData.level && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {reward.level > 1 ? `${reward.expRequired} XP required` : "Starting level"}
                        </p>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {reward.rewards.map((item, index) => (
                            <div
                              key={index}
                              className={`flex items-center p-2 rounded-md ${
                                reward.level <= userData.level ? "bg-primary/10" : "bg-muted/50"
                              }`}
                            >
                              <Gift
                                className={`h-4 w-4 mr-2 ${
                                  reward.level <= userData.level ? "text-primary" : "text-muted-foreground"
                                }`}
                              />
                              <span
                                className={`text-sm ${reward.level <= userData.level ? "" : "text-muted-foreground"}`}
                              >
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {reward.level < levelRewards.length && (
                      <div className="absolute left-5 top-14 bottom-0 w-0.5 bg-muted h-12"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current-rewards" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Writing Tools</CardTitle>
              <CardDescription>
                Level {userData.level} - {currentLevelDetails?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {levelRewards
                  .filter((reward) => reward.level <= userData.level)
                  .map((reward) => (
                    <div key={reward.level} className="border rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          {reward.level}
                        </div>
                        <h3 className="font-semibold">{reward.name}</h3>
                        {reward.level === userData.level && (
                          <span className="ml-auto px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <Separator className="my-2" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                        {reward.rewards.map((item, index) => (
                          <div key={index} className="flex items-center p-2 rounded-md bg-primary/10">
                            <ChevronRight className="h-4 w-4 text-primary mr-2" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {userData.level < 10 && (
                <div className="mt-6 p-4 border border-dashed rounded-lg bg-muted/30">
                  <h3 className="font-semibold flex items-center">
                    <BookOpen className="h-5 w-5 text-amber-400 mr-2" />
                    Next Level Writing Tools
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Reach level {userData.level + 1} to unlock:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                    {nextLevelDetails?.rewards.map((item, index) => (
                      <div key={index} className="flex items-center p-2 rounded-md bg-muted">
                        <Gift className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

