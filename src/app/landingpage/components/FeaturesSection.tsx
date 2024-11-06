'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/landingpage/ui/card"
import { Zap, Trophy, Users, Sparkles, BookOpen, Star } from 'lucide-react'

const features = [
  { icon: Zap, title: 'Daily Challenges', description: 'Engage in exciting writing prompts and challenges to keep your creativity flowing.' },
  { icon: Trophy, title: 'Achievement System', description: 'Earn badges and trophies as you hit milestones and improve your writing skills.' },
  { icon: Users, title: 'Community Feedback', description: 'Share your work and get constructive feedback from a supportive writing community.' },
  { icon: Sparkles, title: 'Gamified Experience', description: 'Level up, unlock new features, and watch your progress soar as you write.' },
  { icon: BookOpen, title: 'Writing Courses', description: 'Access curated courses to enhance your writing skills across various genres.' },
  { icon: Star, title: 'Personalized Goals', description: 'Set and track custom writing goals tailored to your aspirations.' },
]

export default function FeaturesSection() {
    return (
        <motion.section 
          id="features" 
          className="w-full py-12 md:py-24 lg:py-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container px-4 md:px-6">
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Features that Inspire
            </motion.h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <feature.icon className="h-8 w-8 mb-2 text-primary" />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {feature.description}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )
}