'use client'

import ResultsPage from './results/resultspage'
import { Suspense, useEffect, useState } from 'react';
import { getUserSession } from '@/utils/getUserSession'; // Import the getUserSession function

export default function Page() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getUserSession();
      
      if (sessionData?.token) {
        setToken(sessionData.token);  // Set the token if it exists
        console.log('Session token found:', sessionData.token);
      } else {
        setError('No session token found');
        console.log('No session token found');
      }
    };
    
    fetchSession();  // Call the function to fetch the session on mount
  }, []);

  return (
    <Suspense fallback={<div>Loading results...</div>}>
      <ResultsPage />
      {error && <div>{error}</div>}  {/* Display an error message if token is not found */}
    </Suspense>
  );
}
