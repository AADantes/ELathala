'use client'

import { useState } from 'react'
import { Button } from "@/app/homepage/ui/button"
import { Progress } from "@/app/homepage/ui/progress"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/homepage/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/homepage/ui/card"

interface UserData {
  username: string
  experience: number
  level: number
  totalExperience: number
}

export function UserPanel({ userData }: { userData: UserData }) {
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{userData.username}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Level {userData.level}</span>
            <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0">View Details</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Experience Details</DialogTitle>
                  <DialogDescription>
                    Your current level and progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <p>Current Level: {userData.level}</p>
                  <p>Total Experience: {userData.experience} / {userData.totalExperience}</p>
                  <p>Next Level: {userData.level + 1}</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Progress value={(userData.experience / userData.totalExperience) * 100} />
          <p className="text-sm text-muted-foreground">
            {userData.experience} / {userData.totalExperience} XP
          </p>
        </div>
      </CardContent>
    </Card>
  )
}