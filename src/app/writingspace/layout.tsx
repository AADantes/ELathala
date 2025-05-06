// /app/writingspace/layout.tsx
'use client'

import { UuidProvider } from './UUIDContext' // adjust if path is different
import { ReactNode } from 'react'

export default function WritingspaceLayout({ children }: { children: ReactNode }) {
  return (
    <UuidProvider>
      {children}  {/* This will render the pages inside writingspace */}
    </UuidProvider>
  )
}
