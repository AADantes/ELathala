'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/landingpage/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/landingpage/ui/tabs"
import { FaPen, FaTrophy, FaRocket } from 'react-icons/fa' // Import icons

export default function HowItWorksSection() {
    return (
        <motion.section 
          id="how-it-works" 
          className="w-full py-14 md:py-24 lg:py-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container px-5 md:px-6">
            <motion.h2 
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-10 text-sky-950"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              How IWrite Works
            </motion.h2>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Tabs defaultValue="write" className="w-full max-w-3xl mx-auto">
                <TabsList className="grid w-full grid-cols-3 gap-3">
                  <TabsTrigger 
                    value="write" 
                    className="flex items-center justify-center text-lg font-bold rounded-md py-2 transition-transform duration-300 hover:scale-105 active:scale-110 active:transition-transform active:duration-100 bg-sky-700 text-white data-[state=active]:bg-sky-900 data-[state=active]:text-white"
                  >
                    <FaPen className="mr-2" /> {/* Icon for Write */}
                    Write
                  </TabsTrigger>
                  <TabsTrigger 
                    value="achieve" 
                    className="flex items-center justify-center text-lg font-bold rounded-md py-2 transition-transform duration-300 hover:scale-105 active:scale-110 active:transition-transform active:duration-100 bg-sky-700 text-white data-[state=active]:bg-sky-900 data-[state=active]:text-white"
                  >
                    <FaTrophy className="mr-2" /> {/* Icon for Achieve */}
                    Achieve
                  </TabsTrigger>
                  <TabsTrigger 
                    value="level-up" 
                    className="flex items-center justify-center text-lg font-bold rounded-md py-2 transition-transform duration-300 hover:scale-105 active:scale-110 active:transition-transform active:duration-100 bg-sky-700 text-white data-[state=active]:bg-sky-900 data-[state=active]:text-white"
                  >
                    <FaRocket className="mr-2" /> {/* Icon for Level Up */}
                    Level Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="write" className="mt-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  >
                    <Card className="transition-transform duration-300 bg-white rounded-lg border-none w-full h-[150px] shadow-md shadow-[#003366] hover:shadow-lg hover:shadow-[#002244]">
                      <CardHeader className="px-6 py-4">
                        <CardTitle className="text-2xl text-sky-600 font-bold">Write Daily</CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 text-base text-slate-700 leading-relaxed">
                        Engage in daily writing challenges, prompts, and exercises designed to spark your creativity and improve your skills.
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="achieve" className="mt-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  >
                    <Card className="transition-transform duration-300 bg-white rounded-lg border-none w-full h-[150px] shadow-md shadow-[#003366] hover:shadow-lg hover:shadow-[#002244]">
                      <CardHeader className="px-6 py-4">
                        <CardTitle className="text-2xl text-sky-600 font-bold">Complete Quests</CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 text-base text-slate-700 leading-relaxed">
                        Tackle writing quests and earn achievements as you progress. Watch your virtual trophy case fill up with badges of honor.
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="level-up" className="mt-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  >
                    <Card className="transition-transform duration-300 bg-white rounded-lg border-none w-full h-[150px] shadow-md shadow-[#003366] hover:shadow-lg hover:shadow-[#002244]">
                      <CardHeader className="px-6 py-4">
                        <CardTitle className="text-2xl text-sky-600 font-bold">Grow Your Skills</CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 text-base text-slate-700 leading-relaxed">
                        As you write and complete challenges, you will level up your writing abilities, unlocking new features and opportunities.
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.section>
    )
}
