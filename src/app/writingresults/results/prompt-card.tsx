'use client'

import { useEffect, useState } from 'react'
import { MessageSquareText } from 'lucide-react'
import { Card } from '../ui/card'
import { CardHeader } from '../ui/card-header'
import { CardTitle } from '../ui/card-title'
import { CardDescription } from '../ui/card-description'
import { CardContent } from '../ui/card-content'
import { useUuid } from '../../writingpage/components/UUIDContext'
import supabase from '../../../../config/supabaseClient'

// Define the prop type
type PromptCardProps = {
  prompt: string;
};

export default function PromptCard({ prompt }: PromptCardProps) {
  const { generatedUuid } = useUuid()
  const [workPrompt, setWorkPrompt] = useState<string | null>(null)

  useEffect(() => {
    if (!generatedUuid) return

    const fetchPrompt = async () => {
      const { data, error } = await supabase
        .from('written_works')
        .select('workPrompt')
        .eq('workID', generatedUuid)
        .single()

      if (error) {
        console.error('Error fetching prompt:', error.message)
        return
      }

      setWorkPrompt(data?.workPrompt ?? null)
    }

    fetchPrompt()
  }, [generatedUuid])

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
          <p className="italic">{workPrompt ?? prompt ?? '—'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
