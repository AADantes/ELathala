import { Timer, BookText, Award, Star } from "lucide-react"
import { Card } from "../ui/card"
import { CardHeader } from "../ui/card-header"
import { CardTitle } from "../ui/card-title"
import { CardDescription } from "../ui/card-description"
import { CardContent } from "../ui/card-content"
import type { ResultsData } from "../types/results"
import IconLabel from "../ui/icon-label"

interface PerformanceCardProps {
  results: ResultsData
}

export default function PerformanceCard({ results }: PerformanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Your Performance
        </CardTitle>
        <CardDescription>How you did in this challenge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <IconLabel icon={<Timer className="h-5 w-5" />} label="Time Remaining" value={results.timeRemaining} />
        <IconLabel icon={<BookText className="h-5 w-5" />} label="Words Written" value={`${results.wordsMade} words`} />
        <IconLabel
          icon={<Award className="h-5 w-5" />}
          label="Credits Gained"
          value={`${results.creditsGained} credits`}
        />
        <IconLabel
          icon={<Star className="h-5 w-5" />}
          label="Experience Gained"
          value={`${results.experienceGained} XP`}
        />
      </CardContent>
    </Card>
  )
}
