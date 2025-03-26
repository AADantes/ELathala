'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/app/landingpage/ui/button"
import { Feather } from 'lucide-react'

// Custom Hook for managing daily streaks
const useDailyStreak = () => {
  const [streak, setStreak] = useState(0)
  const [reward, setReward] = useState('')

  const getToday = () => new Date().toDateString()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStreak = parseInt(localStorage.getItem('streak') || '0', 10)
      const savedDate = localStorage.getItem('lastDate') || ''
      const today = getToday()

      if (savedDate === today) {
        setStreak(savedStreak)
      } else if (new Date(savedDate).getTime() === new Date(today).getTime() - 86400000) {
        const newStreak = savedStreak + 1
        setStreak(newStreak)
        localStorage.setItem('streak', newStreak.toString())
        localStorage.setItem('lastDate', today)
      } else {
        setStreak(1)
        localStorage.setItem('streak', '1')
        localStorage.setItem('lastDate', today)
      }
    }
  }, [])

  useEffect(() => {
    if (streak === 5) {
      setReward('Great job! You earned a badge! 🏅')
    } else if (streak === 10) {
      setReward('Awesome! 10 days streak! 🎉')
    } else {
      setReward('')
    }
  }, [streak])

  return { streak, reward }
}

const DailyStreak = () => {
  const { streak, reward } = useDailyStreak()
  const progressPercentage = Math.min((streak % 5) * 20, 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-md mt-12 rounded-2xl shadow-lg p-6 backdrop-blur-md bg-white/70"
    >
      <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
        Daily Streak: {streak} Days 
        <motion.span
          animate={{
            y: [-2, 2, -2], // Bouncing up and down
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🔥
        </motion.span>
      </h2>
      <p className="text-gray-600">
        Keep your streak alive to earn rewards!
      </p>
      <div className="w-full bg-sky-600 rounded-full h-4 mt-4 overflow-hidden">
        <motion.div
          className="bg-sky-300 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
      {reward && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-green-600 font-semibold"
        >
          {reward}
        </motion.div>
      )}
    </motion.div>
  )
}

export default function HeroSection() {
  const [clicked, setClicked] = useState(false)

  const handleButtonClick = () => {
    setClicked(true)
    setTimeout(() => setClicked(false), 1000) // Reset after animation
  }

  return (
    <section className="w-full pt-32 md:pt-40 lg:pt-48 xl:pt-56 pb-12 md:pb-24 lg:pb-32 xl:pb-48">
      <div className="container px-4 md:px-0">
        <div className="flex flex-col items-center space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-sky-950">
              Write, Achieve, and Level Up with Elathala
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 md:text-lg">
              Unleash your creativity and boost your writing skills with our gamified writing experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              onClick={handleButtonClick}
              className="bg-sky-800 text-white hover:bg-sky-900 font-bold rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center gap-3 px-8 py-4 text-lg"
            >
              Start Writing
              <motion.div
                animate={clicked ? { x: [0, 10, -10, 0], rotate: [0, 5, -5, 0] } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <Feather className="w-6 h-6" />
              </motion.div>
            </Button>
          </motion.div>

          <DailyStreak />
        </div>
      </div>
    </section>
  )
}
