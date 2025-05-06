'use client'

import { useEffect, useState } from 'react'
import { Clock, Tag, Bookmark } from 'lucide-react'
import { Card } from '../ui/card'
import { CardHeader } from '../ui/card-header'
import { CardTitle } from '../ui/card-title'
import { CardDescription } from '../ui/card-description'
import { CardContent } from '../ui/card-content'
import { Badge } from '../ui/badge'
import IconLabel from '../ui/icon-label'
import { useUuid } from '../../writingpage/components/UUIDContext'
import supabase from '../../../../config/supabaseClient'

type ChallengeParametersCardProps = {
  results: {
    timelimitSet: string;
    workGenre: string;
    workTopic: string;
  };
};


export default function ChallengeParametersCard({ results }: ChallengeParametersCardProps) {
  const { generatedUuid } = useUuid()
  const [loading, setLoading] = useState<boolean>(true) // Add loading state

  useEffect(() => {
    if (!generatedUuid) return // If there's no UUID, don't fetch

    const fetchChallengeParams = async () => {
      setLoading(true) // Start loading

      const { data, error } = await supabase
        .from('written_works')
        .select('timelimitSet, workGenre, workTopic')
        .eq('workID', generatedUuid)
        .single()

      if (error) {
        console.error('Error fetching challenge parameters:', error.message)
        setLoading(false) // Stop loading if there's an error
        return
      }

      // Optionally update state with fetched data
      setLoading(false) // Stop loading after data is fetched
    }

    fetchChallengeParams()
  }, [generatedUuid])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Challenge Parameters
          </CardTitle>
          <CardDescription>Your writing challenge settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-16">Loading...</div>
        </CardContent>
      </Card>
    )
  }

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
        <IconLabel icon={<Clock className="h-5 w-5" />} label="Time Set" value={results.timelimitSet ?? '—'} />
        <IconLabel
          icon={<Bookmark className="h-5 w-5" />}
          label="Genre"
          value={<Badge variant="secondary">{results.workGenre ?? '—'}</Badge>}
        />
        <IconLabel
          icon={<Tag className="h-5 w-5" />}
          label="Topic"
          value={<Badge variant="secondary">{results.workTopic ?? '—'}</Badge>}
        />
      </CardContent>
    </Card>
  )
}
