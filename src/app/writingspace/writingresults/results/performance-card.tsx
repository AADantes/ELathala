'use client'

import { useEffect, useState } from 'react'
import { useUuid } from '../../UUIDContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import IconLabel from '../ui/icon-label'
import { Award, BookText, Star } from 'lucide-react'
import supabase from '../../../../../config/supabaseClient'

type PerformanceCardProps = {
  earnedExp: string;
  earnedCredits: string;
  noOfWordsSet: number;
  numberofWords: number;
};

export default function PerformanceCard({
  earnedExp,
  earnedCredits,
}: PerformanceCardProps) {
  const { generatedUuid } = useUuid()
  const [loading, setLoading] = useState(true)
  const [wordsSet, setWordsSet] = useState<number>(0)
  const [wordsWritten, setWordsWritten] = useState<number>(0)

  // Log exp and credits when they change
  useEffect(() => {
    console.log('earnedExp:', earnedExp)
    console.log('earnedCredits:', earnedCredits)
  }, [earnedExp, earnedCredits])

  useEffect(() => {
    if (!generatedUuid) return

    const fetchPerformanceData = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from('written_works')
        .select('noOfWordsSet, numberofWords')
        .eq('workID', generatedUuid)
        .single()

      if (error) {
        console.error('Error fetching performance data:', error.message)
        setLoading(false)
        return
      }

      if (data) {
        setWordsSet(data.noOfWordsSet)
        setWordsWritten(data.numberofWords)
      }

      setLoading(false)
    }

    fetchPerformanceData()
  }, [generatedUuid])

  if (loading) {
    return (
      <Card className="transition-transform transform hover:scale-105">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
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

  return (
    <Card className="transition-transform transform hover:scale-105">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          Your Performance
        </CardTitle>
        <CardDescription>How you did in this challenge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white rounded-md shadow-md transition-all hover:shadow-lg">
          <IconLabel 
            icon={<BookText className="h-5 w-5 text-green-500" />}
            label="Number of Words Set" 
            value={`${wordsSet ?? 0} words`} 
          />
        </div>
        <div className="p-4 bg-white rounded-md shadow-md transition-all hover:shadow-lg">
          <IconLabel 
            icon={<BookText className="h-5 w-5 text-green-500" />}
            label="Words Written" 
            value={`${wordsWritten ?? 0} words`} 
          />
        </div>
        <div className="p-4 bg-white rounded-md shadow-md transition-all hover:shadow-lg">
          <IconLabel 
            icon={<Award className="h-5 w-5 text-yellow-500" />}
            label="Credits Gained" 
            value={`${earnedCredits ?? '0'} credits`} 
          />
        </div>
        <div className="p-4 bg-white rounded-md shadow-md transition-all hover:shadow-lg">
          <IconLabel 
            icon={<Star className="h-5 w-5 text-purple-500" />}
            label="Experience Gained" 
            value={`${earnedExp ?? '0'} XP`} 
          />
        </div>
      </CardContent>
    </Card>
  )
}
