"use client"

import { BarChart, BookOpen, Calendar, Clock, Edit, FileText, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WritingStats {
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

export default function WritingStatsCard() {
  // This would normally come from your API/database
  const writingStats: WritingStats = {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing Analytics</CardTitle>
        <CardDescription>Track your writing productivity</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Words Written</div>
                  <div className="text-2xl font-bold">{writingStats.today.wordsWritten}</div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <Clock className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Time Writing</div>
                  <div className="text-2xl font-bold">{writingStats.today.timeSpent}</div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <Edit className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                  <div className="text-2xl font-bold">{writingStats.today.sessionsCompleted}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="week" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Words Written</div>
                  <div className="text-2xl font-bold">{writingStats.week.wordsWritten}</div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <Clock className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Time Writing</div>
                  <div className="text-2xl font-bold">{writingStats.week.timeSpent}</div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <Edit className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                  <div className="text-2xl font-bold">{writingStats.week.sessionsCompleted}</div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <BarChart className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Avg. Words/Day</div>
                  <div className="text-2xl font-bold">{writingStats.week.avgWordsPerDay}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="month" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Words Written</div>
                  <div className="text-2xl font-bold">{writingStats.month.wordsWritten}</div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <Clock className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Time Writing</div>
                  <div className="text-2xl font-bold">{writingStats.month.timeSpent}</div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <Calendar className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Active Days</div>
                  <div className="text-2xl font-bold">{writingStats.month.sessionsCompleted}</div>
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 flex items-center">
                <BarChart className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-sm text-muted-foreground">Avg. Words/Day</div>
                  <div className="text-2xl font-bold">{writingStats.month.avgWordsPerDay}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium flex items-center mb-3">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  Writing by Genre
                </h3>
                <div className="space-y-3">
                  {writingStats.genres.map((genre, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{genre.name}</span>
                      <span className="font-medium">{genre.count.toLocaleString()} words</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium flex items-center mb-3">
                  <Sparkles className="h-5 w-5 text-amber-400 mr-2" />
                  Achievement Progress
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium">{writingStats.achievements.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="font-medium">{writingStats.achievements.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-medium">
                      {Math.round((writingStats.achievements.completed / writingStats.achievements.total) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

