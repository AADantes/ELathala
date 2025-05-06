import { Clock, BookText, Bookmark, Tag } from "lucide-react"
import { Card } from "../ui/card"
import { CardHeader } from "../ui/card-header"
import { CardTitle } from "../ui/card-title"
import { CardDescription } from "../ui/card-description"
import { CardContent } from "../ui/card-content"
import { Badge } from "../ui/badge"
import type { ResultsData } from "../types/results"
import IconLabel from "../ui/icon-label"

interface ChallengeParametersCardProps {
  results: ResultsData
}

export default function ChallengeParametersCard({ results }: ChallengeParametersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Challenge Parameters
        </CardTitle>
        <CardDescription>Your writing challenge settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <IconLabel icon={<Clock className="h-5 w-5" />} label="Time Set" value={results.timeSet} />
        <IconLabel icon={<BookText className="h-5 w-5" />} label="Word Target" value={`${results.wordsSet} words`} />
        <IconLabel
          icon={<Bookmark className="h-5 w-5" />}
          label="Genre"
          value={<Badge variant="secondary">{results.genre}</Badge>}
        />
        <IconLabel
          icon={<Tag className="h-5 w-5" />}
          label="Topic"
          value={<Badge variant="secondary">{results.topic}</Badge>}
        />
      </CardContent>
    </Card>
  )
}
