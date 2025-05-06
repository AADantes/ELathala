import React from 'react'
import { Timer, Edit, Medal, SkipForward } from 'lucide-react'

interface FooterProps {
  currentWords: number;
  targetWords: number;
  timeLeft: number;
  onSkip: () => void;
}

export default function Footer({ currentWords, targetWords, timeLeft, onSkip }: FooterProps) {
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 text-black p-3 flex justify-between items-center z-10 shadow-lg">
      {/* Timer Section */}
      <div className="flex flex-col items-center w-1/3 space-y-1">
        <div className="flex items-center space-x-2 text-xl font-extrabold text-black">
          <Timer
            className="w-6 h-6"
            style={{
              color: '#FF2D2D', // red
              animation: 'pulse-timer 1.2s infinite alternate'
            }}
          />
          <span className="font-mono text-xl text-black">{timeDisplay}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-400">
          <div
            className="h-full transition-all duration-500 bg-black"
            style={{
              width: `${100 - timeProgress}%`,
            }}
          />
        </div>
      </div>

      {/* Motivation Section */}
      <div className="flex flex-col items-center w-1/3 space-y-1 text-center">
        <Medal
          className="w-8 h-8"
          style={{
            color: '#FFD600', // yellow
            animation: 'medal-bounce 1.2s infinite alternate'
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
            @keyframes pulse-timer {
              0% { transform: scale(1);}
              100% { transform: scale(1.18);}
            }
            @keyframes pulse-edit {
              0% { transform: scale(1) rotate(-8deg);}
              50% { transform: scale(1.15) rotate(8deg);}
              100% { transform: scale(1) rotate(-8deg);}
            }
            @keyframes pop {
              0% { transform: scale(0.8);}
              60% { transform: scale(1.1);}
              100% { transform: scale(1);}
            }
            @keyframes medal-bounce {
              0% { transform: scale(1) translateY(0);}
              50% { transform: scale(1.15) translateY(-8px);}
              100% { transform: scale(1) translateY(0);}
            }
          `}
        </style>
        <span className="font-mono text-md text-black font-extrabold animate-pulse">{getMotivation()}</span>
        {wordProgress === 100 && (
          <div className="text-black font-mono text-lg mt-2 animate-bounce">
            <span>🎉 You did it! 🎉</span>
          </div>
        )}
        {/* Skip Button */}
        {wordProgress === 100 && (
          <button
            className="mt-2 flex items-center justify-center space-x-2 bg-black text-white font-bold py-2 px-4 w-32 rounded-full border border-black transition-transform hover:scale-105 animate-pop"
            onClick={onSkip}
            style={{ animation: 'pop 0.5s' }}
          >
            <SkipForward className="w-5 h-5" />
            <span>Done</span>
          </button>
        )}
      </div>

      {/* Word Count Section */}
      <div className="flex flex-col items-center w-1/3 space-y-1">
        <div className="flex items-center space-x-2 text-xl font-extrabold text-black">
          <Edit
            className="w-6 h-6"
            style={{
              color: '#22c55e', // green
              animation: 'pulse-edit 1.5s infinite'
            }}
          />
          <span className="font-mono text-xl text-black">
            {currentWords} / {targetWords} words
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-400">
          <div
            className="h-full transition-all duration-500 bg-black"
            style={{
              width: `${wordProgress}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
