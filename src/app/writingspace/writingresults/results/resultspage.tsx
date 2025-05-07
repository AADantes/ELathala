'use client'

import { useUuid } from "../../UUIDContext"
import ResultsHeader from "../../writingresults/results/results-header"
import ChallengeParametersCard from "../../writingresults/results/challenge-parameters-card"
import PromptCard from "../../writingresults/results/prompt-card"
import PerformanceCard from "../../writingresults/results/performance-card"
import ResultsActions from "../../writingresults/results/results-actions"
import { useState, useEffect} from 'react'
import { useResults } from "../../resultsContext"
import supabase from "../../../../../config/supabaseClient"

export default function ResultsPage() {
  const { workID } = useUuid()
  const { earnedExp, earnedCredits, currentWords } = useResults(); // include currentWords from context
  const [isLoading, setIsLoading] = useState(false);

  const results = {
    timelimitSet: "30 minutes",
    wordsSet: 500,
    workGenre: "Science Fiction",
    workTopic: "Space Exploration",
    prompt: "-.",
    wordsMade: currentWords, // use currentWords from context
    creditsGained: earnedCredits,
    experienceGained: earnedExp,
  };

  if (isLoading) return <div className="text-center">Loading...</div>

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <ResultsHeader />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ChallengeParametersCard />

        <PromptCard prompt={results.prompt} />
        <PerformanceCard 
          earnedExp={results.experienceGained}
          earnedCredits={results.creditsGained}
          noOfWordsSet={results.wordsSet}
          numberofWords={results.wordsMade} // this will now be currentWords
        />
      </div>

      <ResultsActions />
    </div>
  )
}
