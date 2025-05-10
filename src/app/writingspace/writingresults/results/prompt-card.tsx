'use client'

import { useEffect, useState } from 'react'
import { MessageSquareText, Sparkles, Info } from 'lucide-react'
import { Card } from '../ui/card'
import { CardHeader } from '../ui/card-header'
import { CardTitle } from '../ui/card-title'
import { CardDescription } from '../ui/card-description'
import { CardContent } from '../ui/card-content'
import { Badge } from '../ui/badge'
import { useUuid } from '../../UUIDContext'
import supabase from '../../../../../config/supabaseClient'

type PromptCardProps = {
  prompt: string;
};

type AnalysisResult = {
  genre: string;
  topic: string;
  confidence?: number;
  explanation?: string;
};

export default function PromptCard({ prompt }: PromptCardProps) {
  const { workID } = useUuid()
  const [workPrompt, setWorkPrompt] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch prompt from DB if workID is present
  useEffect(() => {
    if (!workID) return

    const fetchPrompt = async () => {
      const { data, error } = await supabase
        .from('written_works')
        .select('workPrompt')
        .eq('workID', workID)
        .single()

      if (error) {
        console.error('Error fetching prompt:', error.message)
        return
      }

      setWorkPrompt(data?.workPrompt ?? null)
    }

    fetchPrompt()
  }, [workID])

  // Auto-analyze prompt when it changes
  useEffect(() => {
    const analyzePrompt = async () => {
      setAnalyzing(true)
      setAnalysis(null)
      setError(null)
      const text = workPrompt ?? prompt
      if (!text) {
        setAnalyzing(false)
        return
      }
      try {
        // Try advanced API route first (with explanation and confidence)
        const res = await fetch("/api/analyze-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: text, explain: true }),
        })
        const data = await res.json()
        if (data.error) {
          setError(data.error)
          setAnalysis({ genre: "Unknown", topic: "Unknown" })
        } else {
          setAnalysis({
            genre: data.genre,
            topic: data.topic,
            confidence: data.confidence,
            explanation: data.explanation,
          })
        }
      } catch (e) {
        setError("AI analysis failed. Please try again.")
        setAnalysis({ genre: "Unknown", topic: "Unknown" })
      }
      setAnalyzing(false)
    }
    analyzePrompt()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workPrompt, prompt])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-sky-500" />
          Writing Prompt
        </CardTitle>
        <CardDescription>The prompt you were given</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-muted p-4 mb-4 border border-sky-100 shadow-sm">
          <p className="italic text-lg text-gray-800">{workPrompt ?? prompt ?? '—'}</p>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className={`h-5 w-5 ${analyzing ? "animate-spin text-yellow-400" : "text-green-500"}`} />
          <span className="font-semibold text-gray-700">
            {analyzing ? "Analyzing genre and topic..." : "AI Smart Analysis"}
          </span>
        </div>
        {error && (
          <div className="text-red-500 text-sm flex items-center gap-1 mb-2">
            <Info className="h-4 w-4" /> {error}
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-2">
          <div>
            <span className="font-semibold text-green-700 mr-1">Genre:</span>
            <Badge className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 text-base rounded-full">
              {analysis?.genre ? analysis.genre : analyzing ? "Detecting..." : "—"}
            </Badge>
          </div>
          <div>
            <span className="font-semibold text-blue-700 mr-1">Topic:</span>
            <Badge className="bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 text-base rounded-full">
              {analysis?.topic ? analysis.topic : analyzing ? "Detecting..." : "—"}
            </Badge>
          </div>
          {typeof analysis?.confidence === "number" && (
            <div>
              <span className="font-semibold text-yellow-700 mr-1">Confidence:</span>
              <Badge className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 text-base rounded-full">
                {(analysis.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
          )}
        </div>
        {analysis?.explanation && (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700 flex items-start gap-2">
            <Info className="h-4 w-4 text-sky-400 mt-0.5" />
            <span>
              <span className="font-semibold text-sky-700">AI Reasoning:</span> {analysis.explanation}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
