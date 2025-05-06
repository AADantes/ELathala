// page.tsx
'use client'

import ResultsPage from './results/resultspage'
import { UuidProvider } from '../../app/writingpage/components/UUIDContext'

export default function Page() {
  return (
    <UuidProvider>
      <ResultsPage />
    </UuidProvider>
  )
}
