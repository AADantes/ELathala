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
import { useUuid } from '../../UUIDContext'
import supabase from '../../../../../config/supabaseClient'

export default function ChallengeParametersCard() {
  const { generatedUuid } = useUuid()
  const [loading, setLoading] = useState(true)
  const [timelimitSet, setTimelimitSet] = useState('—')
  const [workGenre, setWorkGenre] = useState('—')
  const [workTopic, setWorkTopic] = useState('—')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!generatedUuid) return

    const fetchChallengeParams = async () => {
      setLoading(true)
      setError(null) // Reset error state when starting a new fetch

      const { data, error } = await supabase
        .from('written_works')
        .select('timelimitSet, workGenre, workTopic')
        .eq('workID', generatedUuid)
        .single()

      if (error) {
        console.error('Error fetching challenge parameters:', error.message)
        setError('Failed to load challenge parameters. Please try again.')
      } else if (data) {
        setTimelimitSet(data.timelimitSet || '—')
        setWorkGenre(data.workGenre || '—')
        setWorkTopic(data.workTopic || '—')
      }

      setLoading(false)
    }

    fetchChallengeParams()
  }, [generatedUuid])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-indigo-600" />
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-indigo-600" />
            Challenge Parameters
          </CardTitle>
          <CardDescription>Your writing challenge settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-16 text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-indigo-600" />
          Challenge Parameters
        </CardTitle>
        <CardDescription>Your writing challenge settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Time Set Section */}
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <IconLabel icon={<Clock className="h-5 w-5 text-blue-600" />} label="Time Set" value={timelimitSet} />
        </div>

        {/* Genre Section */}
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <IconLabel
            icon={<Bookmark className="h-5 w-5 text-green-600" />}
            label="Genre"
            value={<Badge variant="secondary">{workGenre}</Badge>}
          />
        </div>

        {/* Topic Section */}
        <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
          <IconLabel
            icon={<Tag className="h-5 w-5 text-purple-600" />}
            label="Topic"
            value={<Badge variant="secondary">{workTopic}</Badge>}
          />
        </div>
      </CardContent>
    </Card>
  )
}
