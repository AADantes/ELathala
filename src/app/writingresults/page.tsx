import ResultsHeader from "../writingresults/results/results-header"
import ChallengeParametersCard from "../writingresults/results/challenge-parameters-card"
import PromptCard from "../writingresults/results/prompt-card"
import PerformanceCard from "../writingresults/results/performance-card"
import ResultsActions from "../writingresults/results/results-actions"
import type { ResultsData } from "../writingresults/types/results"

export default function ResultsPage() {
  // This would typically come from your database or state management
  // For demonstration, I'm using mock data
  const results: ResultsData = {
    timeSet: "30 minutes",
    wordsSet: 500,
    genre: "Science Fiction",
    topic: "Space Exploration",
    prompt: "Write a short story about a team of astronauts who discover an ancient alien artifact on a distant moon.",
    timeRemaining: "12 minutes 45 seconds",
    wordsMade: 523,
    creditsGained: 150,
    experienceGained: 75,
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <ResultsHeader />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ChallengeParametersCard results={results} />
        <PromptCard prompt={results.prompt} />
        <PerformanceCard results={results} />
      </div>

      <ResultsActions />
    </div>
  )
}
