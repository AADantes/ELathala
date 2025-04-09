'use client'

import { motion } from 'framer-motion'
import { Button } from "@/app/landingpage/ui/button"
import { Feather } from 'lucide-react'

export default function HeroSection() {
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
              className="bg-sky-800 text-white hover:bg-sky-900 font-bold rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center gap-3 px-8 py-4 text-lg"
            >
              Start Writing
              <motion.div
                animate={{
                  y: [0, -10, 5, 0], // Creating bounce on the Y-axis
                  rotate: [0, 10, -10, 0], // Slight rotation for effect
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                  duration: 0.6,
                  repeat: Infinity,  // Loop the animation infinitely
                  repeatType: "loop", // Make it repeat continuously
                }}
              >
                <Feather className="w-6 h-6" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
