import { MessageSquareText } from "lucide-react"
import { Card } from "../ui/card"
import { CardHeader } from "../ui/card-header"
import { CardTitle } from "../ui/card-title"
import { CardDescription } from "../ui/card-description"
import { CardContent } from "../ui/card-content"

interface PromptCardProps {
  prompt: string
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5" />
          Writing Prompt
        </CardTitle>
        <CardDescription>The prompt you were given</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-muted p-4">
          <p className="italic">{prompt}</p>
        </div>
      </CardContent>
    </Card>
  )
}
