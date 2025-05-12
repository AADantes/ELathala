'use client';

import { useUuid } from "../../UUIDContext";
import ResultsHeader from "../../writingresults/results/results-header";
import ChallengeParametersCard from "../../writingresults/results/challenge-parameters-card";
import PromptCard from "../../writingresults/results/prompt-card";
import PerformanceCard from "../../writingresults/results/performance-card";
import ResultsActions from "../../writingresults/results/results-actions";
import { useState, useEffect } from 'react';
import { useResults } from "../../resultsContext";
import supabase from "../../../../../config/supabaseClient";
import SentimentAnalysisCard from "./SentimentAnalysisCard";

export default function ResultsPage() {
  const { workID } = useUuid();
  const { earnedExp, earnedCredits, currentWords } = useResults(); // include currentWords from context
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session?.user) {
        console.error("Session error:", error);
        return;
      }

      const token = data.session.access_token; // This is the token
      setUserToken(token);
      // console.log("User token:", token); // Log the token to console
    };

    fetchSession();
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  if (isLoading) return <div className="text-center">Loading...</div>;

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

      <SentimentAnalysisCard>
        
      </SentimentAnalysisCard>

      <ResultsActions />

    </div>
  );
}
