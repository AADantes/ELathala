"use client"

import { BookOpen, Check, Edit, FileText, Star, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function WritingAchievements() {
  // This would normally come from your API/database
  const achievements = [
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing Achievements</CardTitle>
        <CardDescription>Complete challenges to earn XP and rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border rounded-lg p-4">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${achievement.completed ? "bg-green-100" : "bg-primary/10"}`}>
                  <achievement.icon
                    className={`h-5 w-5 ${achievement.completed ? "text-green-600" : "text-primary"}`}
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{achievement.name}</h3>
                    <Badge variant={achievement.completed ? "success" : "outline"}>
                      {achievement.completed ? (
                        <span className="flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Completed
                        </span>
                      ) : (
                        achievement.reward
                      )}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>

              {!achievement.completed && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>
                      {achievement.progress} / {achievement.target}
                    </span>
                    <span>{Math.round((achievement.progress / achievement.target) * 100)}%</span>
                  </div>
                  <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

