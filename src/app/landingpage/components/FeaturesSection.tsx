'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/landingpage/ui/card"
import { Zap, Trophy, Users, Sparkles, BookOpen, Star } from 'lucide-react'

const features = [
  { icon: Zap, color: 'text-yellow-500', title: 'Daily Challenges', description: 'Engage in exciting writing prompts and challenges to keep your creativity flowing.' },
  { icon: Trophy, color: 'text-amber-600', title: 'Achievement System', description: 'Earn badges and trophies as you hit milestones and improve your writing skills.' },
  { icon: Users, color: 'text-blue-600', title: 'Community Feedback', description: 'Share your work and get constructive feedback from a supportive writing community.' },
  { icon: Sparkles, color: 'text-purple-600', title: 'Gamified Experience', description: 'Level up, unlock new features, and watch your progress soar as you write.' },
  { icon: BookOpen, color: 'text-green-600', title: 'Writing Courses', description: 'Access curated courses to enhance your writing skills across various genres.' },
  { icon: Star, color: 'text-pink-600', title: 'Personalized Goals', description: 'Set and track custom writing goals tailored to your aspirations.' },
]

export default function FeaturesSection() {
  return (
    <motion.section 
      id="features" 
      className="w-full py-16 md:py-24 lg:py-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6">
      <motion.h2 
  className="text-[2.2rem] font-semibold tracking-tight sm:text-[2.5rem] md:text-[2.8rem] text-center mb-8 text-sky-950"
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ delay: 0.2, duration: 0.5 }}
>
  Features that Inspire
</motion.h2>
        <div className="grid gap-4 md:gap-6 lg:gap-8 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col justify-between rounded-2xl bg-white shadow-[0_10px_20px_-5px_rgba(30,64,175,0.4),_0_4px_10px_-2px_rgba(30,64,175,0.2)] hover:shadow-[0_15px_25px_-5px_rgba(30,64,175,0.5),_0_6px_12px_-2px_rgba(30,64,175,0.3)] transition-shadow duration-300 transform hover:scale-[1.04] hover:-translate-y-2 border border-gray-100">
                  <CardHeader className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <IconComponent className={`h-8 w-8 ${feature.color}`} />
                      <CardTitle className="text-xl font-bold text-sky-950">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-8 pb-6 text-base text-gray-700 leading-relaxed">
                    {feature.description}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
