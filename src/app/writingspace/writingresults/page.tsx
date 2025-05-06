
'use client'

import ResultsPage from './results/resultspage'
import { Suspense } from 'react';


export default function Page() {
  return (
       <Suspense fallback={<div>Loading results...</div>}>
             <ResultsPage />
       </Suspense>

  )
}
