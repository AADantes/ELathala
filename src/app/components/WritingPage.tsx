import React, { useState, useEffect, useRef } from 'react'
import TextEditor from './TextEditor'
import Footer from './Footer'

interface WritingPageProps {
  timeLimit: number
  wordCount: number
  generatePrompt: boolean
  selectedPrompt: string
}

export default function WritingPage({ timeLimit, wordCount, selectedPrompt }: WritingPageProps) {
  const [currentWords, setCurrentWords] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setIsTimeUp(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLimit])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setCurrentWords(text.trim().split(/\s+/).length)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TextEditor
        ref={textAreaRef}
        onChange={handleTextChange}
        disabled={isTimeUp}
        placeholder={selectedPrompt || 'Start writing here...'}
      />
      <Footer currentWords={currentWords} targetWords={wordCount} timeLeft={timeLeft} />
    </div>
  )
}