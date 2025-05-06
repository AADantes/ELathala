'use client'

import { useUuid } from "../../UUIDContext"
import ResultsHeader from "../../writingresults/results/results-header"
import ChallengeParametersCard from "../../writingresults/results/challenge-parameters-card"
import PromptCard from "../../writingresults/results/prompt-card"
import PerformanceCard from "../../writingresults/results/performance-card"
import ResultsActions from "../../writingresults/results/results-actions"
import { useSearchParams } from "next/navigation"

export default function ResultsPage() {
  const { generatedUuid } = useUuid()
  const searchParams = useSearchParams()
  const earnedExp = searchParams.get('earnedExp') || '0'
  const earnedCredits = searchParams.get('earnedCredits') || '0'

  // Still needed for other components, but NOT passed to ChallengeParametersCard
  const results = {
    timelimitSet: "30 minutes",
    wordsSet: 500,
    workGenre: "Science Fiction",
    workTopic: "Space Exploration",
    prompt: "-.",
    wordsMade: 523,
    creditsGained: 150,
    experienceGained: 75,
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <ResultsHeader />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* ✅ Don't pass props to ChallengeParametersCard anymore */}
        <ChallengeParametersCard />

        {/* These still use the results object */}
        <PromptCard prompt={results.prompt} />
        <PerformanceCard 
          earnedExp={earnedExp} 
          earnedCredits={earnedCredits} 
          noOfWordsSet={results.wordsSet} 
          numberofWords={results.wordsMade} 
        />
      </div>

      <ResultsActions />
    </div>
  )
}
