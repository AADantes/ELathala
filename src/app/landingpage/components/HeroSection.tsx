'use client';

import { motion } from 'framer-motion';
import { Button } from '@/app/landingpage/ui/button';
import { Feather } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen pt-32 md:pt-40 lg:pt-48 xl:pt-56 pb-12 md:pb-24 lg:pb-32 xl:pb-48 overflow-hidden bg-transparent">
      {/* Background Logo and Feathers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* Central Logo (replace Feather) */}
        <Image
          src="/logos/Logo.png"
          alt="E-Lathala Logo"
          width={500}
          height={500}
          className="opacity-10 w-[300px] sm:w-[400px] md:w-[500px] h-auto object-contain"
        />

        {/* Floating Feathers with Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          className="absolute text-black opacity-50 w-8 h-8 top-[10%] left-[30%]"
        >
          <Feather className="rotate-45" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 0.5,
            ease: 'easeInOut',
          }}
          className="absolute text-black opacity-50 w-7 h-7 top-[20%] right-[25%]"
        >
          <Feather className="-rotate-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 1,
            ease: 'easeInOut',
          }}
          className="absolute text-black opacity-50 w-6 h-6 bottom-[15%] left-[20%]"
        >
          <Feather className="rotate-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 1.5,
            ease: 'easeInOut',
          }}
          className="absolute text-black opacity-50 w-7 h-7 bottom-[25%] right-[30%]"
        >
          <Feather className="rotate-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -5, 0],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 2,
            ease: 'easeInOut',
          }}
          className="absolute text-black opacity-50 w-6 h-6 top-[30%] left-[10%]"
        >
          <Feather className="-rotate-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 2.5,
            ease: 'easeInOut',
          }}
          className="absolute text-black opacity-50 w-8 h-8 bottom-[10%] right-[10%]"
        >
          <Feather className="rotate-45" />
        </motion.div>
      </div>

      {/* Foreground Content */}
      <div className="container px-4 md:px-0 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-sky-950 leading-tight">
              Write, Achieve, and Level Up with <span className="text-sky-700">E-Lathala</span>
            </h1>
            <p className="mx-auto max-w-2xl text-black md:text-lg">
              Transform your writing journey into an exciting adventure. Whether you're chasing a deadline or building a daily habit, E-Lathala keeps you motivated with gamified tools that track your growth and reward consistency.
            </p>
            <p className="mx-auto max-w-xl text-black text-sm italic">
              "Your words have power — and now, they can earn you points too."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              className="bg-sky-800 text-white hover:bg-sky-900 font-bold rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-3 px-8 py-4 text-lg border-none"
            >
              Start Writing
              <motion.div
                animate={{
                  x: [0, 10, -10, 0],  // Writing motion sideways
                  y: [0, -5, 5, 0], // Pen up and down movement
                  rotate: [0, 5, -5, 0], // Slight rotation for a more realistic writing feel
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
              >
                <Feather className="w-4 h-4" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
