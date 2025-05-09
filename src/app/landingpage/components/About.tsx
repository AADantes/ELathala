'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <motion.section
      id="about" // ✅ Anchor target for header link
      className="w-full py-12 md:py-28 lg:py-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <motion.div
            className="space-y-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-sky-950">
              About Us
            </h2>

            <div className="mx-auto max-w-3xl text-justify text-gray-700 md:text-lg leading-loose space-y-6">
              <p>
                <strong>iWrite</strong> is a web-based writing system designed to help users develop consistent writing habits through gamification. By combining writing prompts, customizable challenges, and a progression-based reward system, the platform turns writing into an engaging and motivating experience.
              </p>

              <p>
                Users earn experience points (EXP), unlock badges, and gain in-game currency as they complete tasks. These features encourage creativity, focus, and productivity. The system also tracks writing performance over time, helping users monitor their growth and reach personal goals.
              </p>

              <p>
                Whether you're a student, writer, educator, or professional, iWrite offers a space to build your writing skills in a fun, interactive, and user-friendly environment.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
