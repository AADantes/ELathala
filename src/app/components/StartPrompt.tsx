import React, { useState } from 'react'
import { Button } from '../writingspace/writingresults/ui/button'
import { Input } from '../writingspace/writingresults/ui/input'
import { Checkbox } from '../writingspace/writingresults/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../writingspace/writingresults/ui/select'

interface StartPromptProps {
  onStart: (time: number, words: number, prompt: boolean, selectedPrompt: string) => void
}

const prompts = [
  "Write about your favorite childhood memory.",
  "Describe a place you've never been to but would love to visit.",
  "Write a story that begins with the line: 'The door creaked open...'",
  "Imagine you could have any superpower. What would it be and why?",
  "Random"
]

export default function StartPrompt({ onStart }: StartPromptProps) {
  const [timeLimit, setTimeLimit] = useState('')
  const [wordCount, setWordCount] = useState('')
  const [generatePrompt, setGeneratePrompt] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState('')

  const handleStart = () => {
    const finalPrompt = selectedPrompt === 'Random' ? prompts[Math.floor(Math.random() * (prompts.length - 1))] : selectedPrompt
    onStart(Number(timeLimit), Number(wordCount), generatePrompt, finalPrompt)
  }

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
            />
          </div>
          <div>
            <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700">
              Word Count
            </label>
            <Input
              type="number"
              id="wordCount"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center">
            <Checkbox
              id="generatePrompt"
              checked={generatePrompt}
              onCheckedChange={(checked) => setGeneratePrompt(checked as boolean)}
            />
            <label htmlFor="generatePrompt" className="ml-2 block text-sm text-gray-700">
              Generate Prompt?
            </label>
          </div>
          <div>
            <Select
              disabled={!generatePrompt}
              value={selectedPrompt}
              onValueChange={setSelectedPrompt}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a prompt" />
              </SelectTrigger>
              <SelectContent>
                {prompts.map((prompt, index) => (
                  <SelectItem key={index} value={prompt}>
                    {prompt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleStart} className="w-full bg-green-500 hover:bg-green-600 text-white">
            Start Writing
          </Button>
        </div>
      </div>
    </div>
  )
}