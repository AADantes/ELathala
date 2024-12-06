'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/app/landingpage/ui/button"
import { Input } from "@/app/landingpage/ui/input"
import supabase from '../../../../config/supabaseClient'

export default function HeroSection() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('') // For success or error messages

  const handleRegister = async (e) => {
    e.preventDefault()

    // Call Supabase's signUp method
    const { data, error } = await supabase.auth.signUp({
      email,  
      password,
    })

    if (error) {
      console.error('Error during registration:', error.message)
      setMessage(`Error: ${error.message}`)
    } else {
      console.log('Registration successful:', data)
      setMessage('Registration successful! Please check your email to confirm your account.')
    }

    // Clear form fields
    setEmail('')
    setPassword('')
  }

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
            <form onSubmit={handleRegister} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
              <Button type="submit" className="w-full">Sign Up</Button>
            </form>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </motion.div>
        </div>
      </div>
    </section>
  )
}