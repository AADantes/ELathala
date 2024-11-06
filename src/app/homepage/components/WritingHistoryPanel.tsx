import { Card, CardContent, CardHeader, CardTitle } from "@/app/homepage/ui/card"

interface Work {
  id: number
  title: string
  wordCount: number
  timeSpent: number
}

interface WritingHistoryProps {
  works: Work[]
}

export function WritingHistoryPanel({ works }: WritingHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Writing History</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Total Works: {works.length}</p>
        <ul className="space-y-2">
          {works.map((work) => (
            <li key={work.id} className="flex justify-between items-center">
              <span>{work.title}</span>
              <span className="text-sm text-muted-foreground">
                {work.wordCount} words | {work.timeSpent} mins
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}