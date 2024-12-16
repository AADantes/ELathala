import React, { useState, useEffect, useRef } from 'react'
import TextEditor from './TextEditor'
import Footer from './Footer'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/writingpage/ui/Button'

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
  const router = useRouter()

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

  if (isTimeUp) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 text-white z-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Your Time is Up!</h1>
          <Button
            onClick={() => router.push('/homepage')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-lg rounded"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    )
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
