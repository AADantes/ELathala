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
  const { workID } = useUuid()
  const [loading, setLoading] = useState(true)
  const [timelimitSet, setTimelimitSet] = useState('—')
  const [workGenre, setWorkGenre] = useState('—')
  const [workTopic, setWorkTopic] = useState('—')

  useEffect(() => {
    if (!workID) return

    const fetchChallengeParams = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('written_works')
        .select('timelimitSet, workGenre, workTopic')
        .eq('workID', workID)
        .single()

      if (error) {
        console.error('Error fetching challenge parameters:', error.message)
      } else if (data) {
        setTimelimitSet(data.timelimitSet || '—')
        setWorkGenre(data.workGenre || '—')
        setWorkTopic(data.workTopic || '—')
      }

      setLoading(false)
    }

    fetchChallengeParams()
  }, [workID])

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
        <IconLabel icon={<Clock className="h-5 w-5" />} label="Time Set" value={timelimitSet} />
        <IconLabel
          icon={<Bookmark className="h-5 w-5" />}
          label="Genre"
          value={<Badge variant="secondary">{workGenre}</Badge>}
        />
        <IconLabel
          icon={<Tag className="h-5 w-5" />}
          label="Topic"
          value={<Badge variant="secondary">{workTopic}</Badge>}
        />
      </CardContent>
    </Card>
  )
}
