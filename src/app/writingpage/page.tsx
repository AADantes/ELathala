'use client'

import React, { useState } from 'react'
import StartPrompt from '@/app/writingpage/components/StartPrompt'
import WritingPage from '@/app/writingpage/components/WritingPage'
import Header from '@/app/writingpage/components/Header'
import Sidebar from '@/app/writingpage/components/Sidebar'




export default function Writingpage() {
    const [isWriting, setIsWriting] = useState(false)
    const [timeLimit, setTimeLimit] = useState(0)
    const [wordCount, setWordCount] = useState(0)
    const [generatePrompt, setGeneratePrompt] = useState(false)
    const [selectedPrompt, setSelectedPrompt] = useState('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
    const handleStart = (time: number, words: number, prompt: boolean, selectedPrompt: string) => {
      setTimeLimit(time)
      setWordCount(words)
      setGeneratePrompt(prompt)
      setSelectedPrompt(selectedPrompt)
      setIsWriting(true)
    }
  
    return (
      <div className="min-h-screen bg-green-50 flex flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-grow relative">
          {!isWriting ? (
            <StartPrompt onStart={handleStart} />
          ) : (
            <WritingPage
              timeLimit={timeLimit}
              wordCount={wordCount}
              generatePrompt={generatePrompt}
              selectedPrompt={selectedPrompt}
            />
          )}
          {!isWriting && (
            <div className="absolute inset-0 bg-blue-200 opacity-50" style={{ zIndex: 10 }}></div>
          )}
        </div>
      </div>
    )
  }