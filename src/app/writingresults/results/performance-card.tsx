'use client'

import { useEffect, useState } from 'react'
import { useUuid } from '../../writingpage/components/UUIDContext' // Adjust path based on your structure
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import IconLabel from '../ui/icon-label'
import { Award, BookText, Star } from 'lucide-react'
import supabase from '../../../../config/supabaseClient'

// Type definition for the props
type PerformanceCardProps = {
  earnedExp: string;
  earnedCredits: string;
  wordsSet: number;
  wordsWritten: number;
};

export default function PerformanceCard({
  earnedExp, // These will be passed as props
  earnedCredits,
  wordsSet,
  wordsWritten,
}: PerformanceCardProps) {
  const { generatedUuid } = useUuid() // Get UUID from context
  const [loading, setLoading] = useState<boolean>(true) // Loading state for data fetch

  useEffect(() => {
    if (!generatedUuid) return // Don't fetch if UUID is not available

    const fetchPerformanceData = async () => {
      setLoading(true) // Start loading

      const { data, error } = await supabase
        .from('written_works')
        .select('noOfWordsSet, numberofWords')
        .eq('workID', generatedUuid)
        .single()

      if (error) {
        console.error('Error fetching performance data:', error.message)
        setLoading(false) // Stop loading on error
        return
      }

      // Optionally, update any state here if needed (e.g., wordsSet, wordsWritten)
      setLoading(false) // Stop loading when data is fetched
    }

    fetchPerformanceData()
  }, [generatedUuid]) // Re-run the effect if generatedUuid changes

  // If the data is still loading, show the loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Performance
          </CardTitle>
          <CardDescription>How you did in this challenge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-16">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  // If data has loaded, show performance information
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
        <IconLabel icon={<BookText className="h-5 w-5" />} label="Number of Words Set" value={`${wordsSet} words`} />
        <IconLabel icon={<BookText className="h-5 w-5" />} label="Words Written" value={`${wordsWritten} words`} />
        <IconLabel icon={<Award className="h-5 w-5" />} label="Credits Gained" value={`${earnedCredits || '—'} credits`} />
        <IconLabel icon={<Star className="h-5 w-5" />} label="Experience Gained" value={`${earnedExp || '—'} XP`} />
      </CardContent>
    </Card>
  )
}
