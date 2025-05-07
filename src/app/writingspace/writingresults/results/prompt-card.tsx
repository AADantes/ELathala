'use client'

import { useEffect, useState } from 'react'
import { MessageSquareText } from 'lucide-react'
import { Card } from '../ui/card'
import { CardHeader } from '../ui/card-header'
import { CardTitle } from '../ui/card-title'
import { CardDescription } from '../ui/card-description'
import { CardContent } from '../ui/card-content'
import { useUuid } from '../../UUIDContext'
import supabase from '../../../../../config/supabaseClient'

// Define the prop type
type PromptCardProps = {
  prompt: string;
};

export default function PromptCard({ prompt }: PromptCardProps) {
  const { generatedUuid } = useUuid()
  const [workPrompt, setWorkPrompt] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!generatedUuid) return

    const fetchPrompt = async () => {
      setIsLoading(true)
      setError(null) // Reset error state before fetching
      try {
        const { data, error } = await supabase
          .from('written_works')
          .select('workPrompt')
          .eq('workID', generatedUuid)
          .single()

        if (error) throw new Error(error.message)

        console.log('Fetched data from written_works:', data) // Log fetched data

        setWorkPrompt(data?.workPrompt ?? null)
      } catch (err) {
        setError('Failed to load the prompt.')
        console.error('Error fetching prompt:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrompt()
  }, [generatedUuid])

  return (
    <Card className="transition-transform transform hover:scale-105">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <MessageSquareText className="h-5 w-5 text-primary" />
          Writing Prompt
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">The prompt you were given</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4 shadow-md transition-all hover:shadow-lg">
          {isLoading ? (
            <div className="flex justify-center items-center space-x-2">
              <span className="animate-spin h-5 w-5 border-4 border-t-transparent border-primary rounded-full"></span>
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="italic text-gray-700">{workPrompt ?? prompt ?? '—'}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
