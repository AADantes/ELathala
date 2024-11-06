'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/landingpage/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/landingpage/ui/tabs"

export default function HowItWorksSection() {
    return (
        <motion.section 
          id="how-it-works" 
          className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50"
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
              How Elathala Works
            </motion.h2>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Tabs defaultValue="write" className="w-full max-w-3xl mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="achieve">Achieve</TabsTrigger>
                  <TabsTrigger value="level-up">Level Up</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Write Daily</CardTitle>
                    </CardHeader>
                    <CardContent>
                      Engage in daily writing challenges, prompts, and exercises designed to spark your creativity and improve your skills.
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="achieve" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Complete Quests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      Tackle writing quests and earn achievements as you progress. Watch your virtual trophy case fill up with badges of honor.
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="level-up" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Grow Your Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      As you write and complete challenges, you will level up your writing abilities, unlocking new features and opportunities.
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.section>
      )
}