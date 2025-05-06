
'use client'

import ResultsPage from './results/resultspage'
import { UuidProvider } from '../../app/writingpage/components/UUIDContext'
import { Suspense } from 'react';


export default function Page() {
  return (
    <UuidProvider>
       <Suspense fallback={<div>Loading results...</div>}>
             <ResultsPage />
       </Suspense>

    </UuidProvider>
  )
}
