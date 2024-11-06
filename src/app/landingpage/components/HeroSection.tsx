'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/app/landingpage/ui/button"
import { Input } from "@/app/landingpage/ui/input"

export default function HeroSection() {
  const [email, setEmail] = useState('')

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Write, Achieve, and Level Up with Elathala
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Unleash your creativity and boost your writing skills with our gamified writing experience.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-sm space-y-2"
          >
            <form className="flex space-x-2 mb-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Get Started</Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}