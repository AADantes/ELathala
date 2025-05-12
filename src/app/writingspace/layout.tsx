// /app/writingspace/layout.tsx
'use client'

import { UuidProvider } from './UUIDContext' // adjust if path is different
import { ResultsProvider } from './resultsContext'
import { FontProvider } from './FontContext' // adjust if path is different
import { WritingProvider } from './WritingContext' // adjust if path is different

import { ReactNode } from 'react'

export default function WritingspaceLayout({ children }: { children: ReactNode }) {
  return (
    <WritingProvider>
      {/* This will render the pages inside writingspace */}
    <FontProvider>
      {/* This will render the pages inside writingspace */}
    <ResultsProvider>
    <UuidProvider>
      {children}  {/* This will render the pages inside writingspace */}
    </UuidProvider>
    </ResultsProvider>
    </FontProvider>
    </WritingProvider>

  )
}
