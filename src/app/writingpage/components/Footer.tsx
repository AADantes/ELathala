import React from 'react'
import { Timer, Edit, Medal } from 'lucide-react'

interface FooterProps {
  currentWords: number
  targetWords: number
  timeLeft: number // in seconds
}

export default function Footer({ currentWords, targetWords, timeLeft }: FooterProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  // Clamp progress between 0 and 100
  const wordProgress = Math.min(Math.max((currentWords / targetWords) * 100, 0), 100)
  const totalTime = 60 * 60 // assuming 1 hour session
  const timeProgress = Math.min(Math.max((timeLeft / totalTime) * 100, 0), 100)

  const getMotivation = () => {
    if (wordProgress === 100) return "Mission Accomplished!"
    if (wordProgress >= 75) return "Almost there! Keep going!"
    if (wordProgress >= 50) return "Halfway done! You got this!"
    if (wordProgress >= 25) return "Good start! Keep the momentum!"
    return "Let's get writing!"
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent text-white p-3 flex justify-between items-center z-10">
      {/* Timer Section */}
      <div className="flex flex-col items-start w-1/3 space-y-1">
        <div className="flex items-center space-x-2 text-xl font-bold">
          <Timer className="w-6 h-6 text-sky-400 hover:scale-110 transition-transform" />
          <span className="font-mono text-xl text-sky-400">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="w-full bg-sky-900 rounded-full h-3 overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${timeProgress}%`,
              backgroundColor:
                timeProgress > 66 ? '#38BDF8' : timeProgress > 33 ? '#0EA5E9' : '#0284C7',
            }}
          />
        </div>
      </div>

      {/* Motivation */}
      <div className="flex flex-col items-center w-1/3 space-y-1 text-center">
        <Medal className="w-6 h-6 text-sky-300 animate-bounce hover:scale-110 transition-transform" />
        <span className="font-mono text-md text-sky-300 font-semibold">{getMotivation()}</span>
      </div>

      {/* Word Count */}
      <div className="flex flex-col items-end w-1/3 space-y-1">
        <div
          className={`flex items-center space-x-2 text-xl font-bold ${
            currentWords >= targetWords ? 'text-sky-200' : 'text-sky-400'
          }`}
        >
          <Edit className="w-6 h-6 hover:scale-110 transition-transform" />
          <span className="font-mono text-xl">
            {currentWords} / {targetWords} words
          </span>
        </div>
        <div className="w-full bg-sky-900 rounded-full h-3 overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${wordProgress}%`,
              backgroundColor:
                wordProgress >= 100 ? '#7DD3FC' : wordProgress > 50 ? '#0EA5E9' : '#0284C7',
            }}
          />
        </div>
      </div>
    </div>
  )
}
