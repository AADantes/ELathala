import React from 'react'

interface FooterProps {
  currentWords: number
  targetWords: number
  timeLeft: number
}

export default function Footer({ currentWords, targetWords, timeLeft }: FooterProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div
        className={`text-xl font-bold ${
          currentWords >= targetWords ? 'text-green-300' : 'text-red-300'
        }`}
      >
        {currentWords} / {targetWords} words
      </div>
    </div>
  )
}