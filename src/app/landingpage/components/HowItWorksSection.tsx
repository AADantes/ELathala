'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/app/landingpage/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/landingpage/ui/tabs"
import { FaPen, FaTrophy, FaRocket } from 'react-icons/fa' // Import icons

export default function HowItWorksSection() {
    return (
        <motion.section 
          id="how-it-works" 
          className="w-full pt-20 pb-8 flex items-start" // mas maliit na top at bottom padding, walang min-h-screen
        >
          <div className="container px-5 md:px-6 flex flex-col items-center"> 
            {/* container: max width at center, padding-x, flex column, center items */}
            <motion.h2 
              className="text-5xl font-extrabold mb-6 text-sky-950 drop-shadow"
            >
              How iWrite Works
            </motion.h2>

            <motion.div
              className="w-full flex justify-center"
              // full width, flex container, center horizontally
            >
              <Tabs defaultValue="write" className="w-full max-w-3xl mx-auto">
                {/* Tabs container: full width, max width 3xl, center horizontally */}
                <TabsList className="grid w-full grid-cols-3 gap-3">
                  {/* grid layout, 3 columns, gap between buttons */}
                  <TabsTrigger 
                    value="write" 
                    className="flex items-center justify-center text-lg font-bold rounded-md py-2 transition-transform duration-300 hover:scale-105 active:scale-110 active:transition-transform active:duration-100 bg-sky-700 text-white data-[state=active]:bg-sky-900 data-[state=active]:text-white"
                    // flex center, large bold text, rounded, vertical padding, smooth scale on hover/active, blue bg, white text, darker blue if active
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
                  {/* margin-top for spacing */}
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}>
                    <Card className="transition-transform duration-300 bg-white rounded-lg border-none w-full h-[150px] shadow-md shadow-[#003366] hover:shadow-lg hover:shadow-[#002244]">
                      {/* white bg, rounded, no border, full width, fixed height, blue shadow, bigger shadow on hover */}
                      <CardHeader className="px-6 py-4">
                        {/* padding x and y */}
                        <CardTitle className="text-2xl text-sky-600 font-bold">
                          {/* large, blue, bold */}
                          Write Daily
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 text-base text-slate-700 leading-relaxed">
                        {/* padding, base text, slate color, relaxed line height */}
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
