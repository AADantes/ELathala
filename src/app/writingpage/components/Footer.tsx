import React from 'react'
import { Timer, Edit, Medal, SkipForward } from 'lucide-react'

interface FooterProps {
  currentWords: number
  targetWords: number
  timeLeft: number // in seconds
}

export default function Footer({ currentWords, targetWords, timeLeft }: FooterProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const wordProgress = Math.min(Math.max((currentWords / targetWords) * 100, 0), 100)

  const totalTime = 60 * 60 // assuming 1 hour session

  const timeProgress = Math.min(Math.max(((totalTime - timeLeft) / totalTime) * 100, 0), 100)

  const getMotivation = () => {
    if (wordProgress === 100) return "Mission Accomplished!"
    if (wordProgress >= 75) return "Almost there! Keep going!"
    if (wordProgress >= 50) return "Halfway done! You got this!"
    if (wordProgress >= 25) return "Good start! Keep the momentum!"
    return "Let's get writing!"
  }

  const timeDisplay =
    timeLeft >= 3600 ? '1 hour' : `${minutes}m ${seconds.toString().padStart(2, '0')}s`

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-transparent text-black p-3 flex justify-between items-center z-10">
      {/* Timer Section */}
      <div className="flex flex-col items-center w-1/3 space-y-1">
        <div className="flex items-center space-x-2 text-xl font-bold text-black">
          <Timer className="w-6 h-6 text-black hover:scale-110 transition-transform animate-pulse" />
          <span className="font-mono text-xl text-black">{timeDisplay}</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${100 - timeProgress}%`,
              backgroundColor:
                timeProgress < 33
                  ? '#22C55E'
                  : timeProgress < 66
                  ? '#FACC15'
                  : '#EF4444',
            }}
          />
        </div>
      </div>

      {/* Motivation Section */}
      <div className="flex flex-col items-center w-1/3 space-y-1 text-center">
        <Medal className="w-6 h-6 text-yellow-400 animate-bounce hover:scale-110 transition-transform" />
        <span className="font-mono text-md text-black font-bold">{getMotivation()}</span>
        {wordProgress === 100 && (
          <div className="text-green-400 font-mono text-lg mt-2 animate-bounce">
            <span>🎉 You did it! 🎉</span>
          </div>
        )}
        
        {/* Skip Button */}
        {wordProgress === 100 && (
      <button
      className="mt-2 flex items-center justify-center space-x-2 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 w-32 rounded-full transition-transform hover:scale-105 animate-pulse"
      onClick={() => alert('Skipped!')}
    >
      <SkipForward className="w-5 h-5" />
      <span>Skip</span>
    </button>
    
       
        
        )}
      </div>

      {/* Word Count Section */}
      <div className="flex flex-col items-center w-1/3 space-y-1">
        <div className="flex items-center space-x-2 text-xl font-bold text-black">
          <Edit className="w-6 h-6 text-black hover:scale-110 transition-transform animate-bounce" />
          <span className="font-mono text-xl text-black">
            {currentWords} / {targetWords} words
          </span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${wordProgress}%`,
              backgroundColor:
                wordProgress >= 100
                  ? '#22C55E'
                  : wordProgress >= 66
                  ? '#22C55E'
                  : wordProgress >= 33
                  ? '#FACC15'
                  : '#EF4444',
            }}
          />
        </div>
      </div>
    </div>
  )
}
