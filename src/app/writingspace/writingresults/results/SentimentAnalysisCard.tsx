'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { useWritingContext } from '../../WritingContext';
import supabase from '../../../../../config/supabaseClient'; // ✅ Use your existing client

interface SentimentResponse {
  output: {
    sentiment: string;
  };
}

interface ThoughtResponse {
  analysis: string;
}

export default function SentimentAnalysisCard() {
  const { writtenText } = useWritingContext();
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [thought, setThought] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserID = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user?.id) {
        console.log("User ID fetched:", data.user.id);
        setUserID(data.user.id);
      } else {
        console.error('Failed to get user', error);
        setError('User not authenticated');
      }
    };

    fetchUserID();
  }, []);

  useEffect(() => {
    const analyzeText = async () => {
      console.log("Checking conditions before making API call...");
      console.log("Written text:", writtenText);
      console.log("User ID:", userID);

      if (!writtenText || !userID || writtenText.trim() === '') {
        console.error('Missing required data: writtenText or userID');
        setError('Written text or user ID is missing');
        return;
      }

      setLoading(true);
      setError(null);

      console.log("Sending data to API:", { text: writtenText, userID });

      try {
        // 1. Sentiment API
        const sentimentRes = await fetch('/api/google-cloud-nlp-api/generateAnalysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: writtenText, userID }),
        });

        if (!sentimentRes.ok) {
          const sentimentError = await sentimentRes.json();
          console.error("Sentiment API Error Response:", sentimentError);
          throw new Error('Failed to analyze sentiment');
        }

        const sentimentData: SentimentResponse = await sentimentRes.json();
        console.log("Sentiment analysis result:", sentimentData);
        setSentiment(sentimentData.output.sentiment);

        // 2. Gemini Thought API
        const thoughtRes = await fetch('/api/gemini-api/generateThought', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: writtenText, userID }),
        });

        if (!thoughtRes.ok) {
          const errorResponse = await thoughtRes.json();
          console.error("Gemini Thought API Error Response:", errorResponse);
          throw new Error('Failed to generate thought analysis');
        }

        const thoughtData: ThoughtResponse = await thoughtRes.json();
        console.log("Thought analysis result:", thoughtData);
        setThought(thoughtData.analysis);

      } catch (err) {
        console.error("Error in API call:", err);
        setError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        setLoading(false);
      }
    };

    analyzeText();
  }, [writtenText, userID]);

  const displaySentiment = sentiment
    ? sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase()
    : null;

  return (
    <Card className="mt-4 p-4 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-xl font-bold mb-2">Analysis</h2>
        {loading && <p className="text-muted">Analyzing your writing...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {sentiment && (
          <p><strong>Sentiment:</strong> {displaySentiment}</p>
        )}

        {thought && (
          <p className="mt-2"><strong>Thought Analysis:</strong> {thought}</p>
        )}

        {!loading && !error && !sentiment && !thought && (
          <p className="text-muted">No analysis available yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
