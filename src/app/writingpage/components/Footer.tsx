import React from 'react'
import { Clock, Pencil, Trophy } from 'lucide-react'

interface FooterProps {
  currentWords: number
  targetWords: number
  timeLeft: number
}

export default function Footer({ currentWords, targetWords, timeLeft }: FooterProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const wordProgress = Math.min((currentWords / targetWords) * 100, 100)
  const timeProgress = Math.min((timeLeft / (60 * 60)) * 100, 100) // Assuming 1 hour max

  // Motivational messages
  const getMotivation = () => {
    if (wordProgress === 100) return "Mission Accomplished! 🎉"
    if (wordProgress >= 75) return "Almost there! Keep going! 🚀"
    if (wordProgress >= 50) return "Halfway done! You got this! 💪"
    if (wordProgress >= 25) return "Good start! Keep the momentum! ✍️"
    return "Let's get writing! ⏳"
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2C3E50] text-white p-3 flex justify-between items-center">
      {/* Timer */}
      <div className="flex flex-col items-start w-1/3">
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <Clock className="w-5 h-5 text-[#00B5B8] mr-1" />
          <span className="font-mono text-lg tracking-tight text-[#00B5B8]">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="w-full bg-[#34495E] rounded-full mt-1 h-2">
          <div
            className="h-full bg-[#00B5B8] transition-all duration-300"
            style={{ width: `${timeProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Motivation (Center) */}
      <div className="flex flex-col items-center w-1/3 text-center">
        <Trophy className="w-7 h-7 text-[#FFD700] animate-bounce" />
        <span className="font-mono text-md tracking-tight text-[#FFD700]">
          {getMotivation()}
        </span>
      </div>

      {/* Word Count */}
      <div className="flex flex-col items-end w-1/3">
        <div
          className={`flex items-center space-x-2 text-lg font-semibold ${
            currentWords >= targetWords ? 'text-[#00FF85]' : 'text-[#FF4F4F]'
          }`}
        >
          <Pencil className="w-5 h-5 mr-1" />
          <span className="font-mono text-lg tracking-tight">
            {currentWords} / {targetWords} words
          </span>
        </div>
        <div className="w-full bg-[#7F8C8D] rounded-full mt-1 h-2">
          <div
            className={`h-full transition-all duration-300 ${
              currentWords >= targetWords ? 'bg-[#00FF85]' : 'bg-[#FF4F4F]'
            }`}
            style={{ width: `${wordProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
