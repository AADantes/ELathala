'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/landingpage/ui/button';
import { Feather, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HeroSection({
  openSignUpDialog,
  user,
}: {
  openSignUpDialog: () => void;
  user?: any;
}) {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);

  const handleStartWriting = () => {
    if (user) {
      router.push('/writingspace');
    } else {
      setShowWarning(true);
      openSignUpDialog();
      setTimeout(() => setShowWarning(false), 3500);
    }
  };

  return (
    <section className="relative w-full min-h-screen pt-24 md:pt-32 lg:pt-40 xl:pt-56 pb-8 md:pb-16 lg:pb-24 xl:pb-40 overflow-hidden bg-white flex items-center justify-center">
      {/* Background Feathers */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* Central Feather Icon as Background */}
        <Feather className="w-[180px] sm:w-[300px] md:w-[400px] lg:w-[500px] h-auto text-sky-600 opacity-10" />

        {/* Floating Feathers with Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          className="absolute text-sky-800 opacity-50 w-8 h-8 top-[10%] left-[30%]"
        >
          <Feather className="rotate-45" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 0.5,
            ease: 'easeInOut',
          }}
          className="absolute text-sky-800 opacity-50 w-7 h-7 top-[20%] right-[25%]"
        >
          <Feather className="-rotate-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 1,
            ease: 'easeInOut',
          }}
          className="absolute text-sky-800 opacity-50 w-6 h-6 bottom-[15%] left-[20%]"
        >
          <Feather className="rotate-12" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -25, 0],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 1.5,
            ease: 'easeInOut',
          }}
          className="absolute text-sky-800 opacity-50 w-7 h-7 bottom-[25%] right-[30%]"
        >
          <Feather className="rotate-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 2,
            ease: 'easeInOut',
          }}
          className="absolute text-sky-800 opacity-50 w-6 h-6 top-[30%] left-[10%]"
        >
          <Feather className="-rotate-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            y: [0, -35, 0],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'loop',
            delay: 2.5,
            ease: 'easeInOut',
          }}
          className="absolute text-sky-800 opacity-50 w-8 h-8 bottom-[10%] right-[10%]"
        >
          <Feather className="rotate-45" />
        </motion.div>
      </div>

      {/* Foreground Content */}
      <div className="container px-4 md:px-0 relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center w-full max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 sm:space-y-5 flex flex-col items-center justify-center text-center w-full"
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-sky-950 leading-tight text-center w-full">
              Write, Achieve, and Level Up with <span className="text-sky-700">E-Lathala</span>
            </h1>
            <p className="mx-auto max-w-xl text-black text-base sm:text-lg leading-relaxed text-center">
              Transform your writing journey into an exciting adventure. Whether you're chasing a deadline or building a daily habit, E-Lathala keeps you motivated with gamified tools that track your growth and reward consistency.
            </p>
            <p className="mx-auto max-w-lg text-black text-xs sm:text-sm italic text-center">
              "Your words have power — and now, they can earn you points too."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full flex flex-col items-center justify-center"
          >
            <div className="relative w-full flex flex-col items-center justify-center">
              <Button
                className="bg-gradient-to-r from-sky-800 to-sky-900 text-white hover:bg-sky-900 font-bold rounded-lg shadow-lg transform transition-all hover:scale-105 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg border-none flex items-center gap-3 mx-auto"
                onClick={handleStartWriting}
              >
                Start Writing
                <motion.div
                  animate={{
                    x: [0, 10, -10, 0],
                    y: [0, -5, 5, 0],
                    rotate: [0, 5, -5, 0],
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
              <AnimatePresence>
                {showWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                    className="absolute left-1/2 top-full -translate-x-1/2 mt-3 w-auto max-w-full flex items-center justify-center gap-2 bg-red-50 border border-red-300 rounded-lg px-3 py-2 shadow-lg z-[100] text-center"
                  >
                    <AlertTriangle className="text-red-500 w-5 h-5 animate-bounce shrink-0" />
                    <span className="text-red-700 font-semibold text-xs sm:text-sm text-center whitespace-nowrap">
                      Please <span className="underline underline-offset-2">sign up</span> or <span className="underline underline-offset-2">log in</span> to start writing!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
