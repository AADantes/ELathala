
import React, { useState, useEffect } from 'react'
import { Button } from '@/app/writingpage/ui/Button'
import { Input } from '@/app/writingpage/ui/Input'
import { Checkbox } from '@/app/writingpage/ui/CheckBox'
import { useRouter } from 'next/navigation'

interface StartPromptProps {
  onStart: (time: number, words: number, prompt: boolean, selectedPrompt: string) => void
}

const prompts = [
  "Write about a time when you surprised yourself with your own strength.",
  "If you could revisit one moment from your past, what would it be and why?",
  "Imagine meeting a version of yourself from 10 years in the future—what advice would you give them?",
  "Write about a habit you want to break and how it’s affected your life.",
  "What does happiness mean to you? Has your definition changed over time?",
  "Write about an encounter with a stranger that left a lasting impact on you.",
  "Create a letter to your younger self, sharing what you’ve learned.",
  "Two strangers meet at an airport when their flights are delayed for 24 hours",
  "Write about a character who falls in love with someone through anonymous letters.",
  "Two childhood rivals are forced to collaborate on a project and uncover hidden feelings.",
  "Your character finds a photograph of themselves in a place they’ve never visited.",
  "The protagonist receives anonymous letters with cryptic messages leading to an abandoned house.",
  "A detective investigates a murder where every suspect has a perfect alibi.",
  "A dragon visits your small village, but instead of destruction, it asks for help.",
  "In a future where memories are sold as commodities, your character loses their most cherished memory.",
  "Magic is real, but it’s slowly disappearing from the world—why?",
  "Write about a moment in your life when you felt truly brave.",
  "Reflect on a lesson you learned from a major failure.",
  "What’s a tradition from your culture or family that you cherish the most? Why?",
  "A mysterious package arrives at your door with no return address. Inside is an object that changes your life.",
  "Write a story where the protagonist wakes up in a world where their deepest fears are real.",
  "Your character discovers they have the power to rewind time by 10 seconds—how do they use it?",
]

export default function StartPrompt({ onStart }: StartPromptProps) {
  const [timeLimit, setTimeLimit] = useState('')
  const [wordCount, setWordCount] = useState('')
  const [generatePrompt, setGeneratePrompt] = useState(false)
  const [timeIsUp, setTimeIsUp] = useState(false)
  const router = useRouter()

  const handleStart = () => {
    if (Number(timeLimit) < 1 || Number(wordCount) < 50) return
    const finalPrompt = generatePrompt
      ? prompts[Math.floor(Math.random() * prompts.length)]
      : ''
    onStart(Number(timeLimit), Number(wordCount), generatePrompt, finalPrompt)
    setTimeout(() => {
      setTimeIsUp(true)
    }, Number(timeLimit) * 60 * 1000) // Convert minutes to milliseconds
  }

  const incrementWordCount = () => {
    setWordCount((prev) => (prev ? (Number(prev) + 50).toString() : '50'))
  }

  const decrementWordCount = () => {
    setWordCount((prev) => (prev && Number(prev) > 50 ? (Number(prev) - 50).toString() : '50'))
  }

  if (timeIsUp) {
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

  const isStartDisabled = !timeLimit || !wordCount || Number(timeLimit) < 1 || Number(wordCount) < 50

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 20 }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Start Writing</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
              Time Limit (minutes)
            </label>
            <Input
              type="number"
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="mt-1"
              min={1}
            />
            {Number(timeLimit) < 1 && (
              <p className="text-red-500 text-sm">Time must be at least 1 minute.</p>
            )}
          </div>
          <div>
            <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700">
              Word Count
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={decrementWordCount}
                className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded"
              >
                -
              </button>
              <Input
                type="number"
                id="wordCount"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
                className="mt-1"
                min={50}
              />
              <button
                onClick={incrementWordCount}
                className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded"
              >
                +
              </button>
            </div>
            {Number(wordCount) < 50 && (
              <p className="text-red-500 text-sm">Word count must be at least 50.</p>
            )}
          </div>
          <div className="flex items-center">
            <Checkbox
              id="generatePrompt"
              checked={generatePrompt}
              onCheckedChange={(checked) => setGeneratePrompt(checked as boolean)}
            />
            <label htmlFor="generatePrompt" className="ml-2 block text-sm text-gray-700">
              Generate Random Prompt?
            </label>
          </div>
          <Button
            onClick={handleStart}
            disabled={isStartDisabled}
            className={`w-full ${
              isStartDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Start Writing
          </Button>
        </div>
      </div>
    </div>
  )
}
