// /app/writingspace/layout.tsx
'use client'

import { UuidProvider } from './UUIDContext' // adjust if path is different
import { ResultsProvider } from './resultsContext'

import { ReactNode } from 'react'

export default function WritingspaceLayout({ children }: { children: ReactNode }) {
  return (
    <ResultsProvider>
    <UuidProvider>
      {children}  {/* This will render the pages inside writingspace */}
    </UuidProvider>
    </ResultsProvider>


  )
}
