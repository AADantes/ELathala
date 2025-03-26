'use client'

import { motion } from 'framer-motion'
import { Button } from "@/app/landingpage/ui/button"
import { ChevronRight } from 'lucide-react'

export default function CallToActionSection() {
  return (
    <motion.section 
      className="w-full py-8 md:py-20 lg:py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div 
            className="space-y-1" 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-sky-950 mb-4">
              Ready to Level Up Your Writing?
            </h2>

            <p className="mx-auto max-w-[600px] text-gray-700 md:text-xl mb-6">
              Join Elathala today and start your journey to becoming a master wordsmith.
            </p>
          </motion.div>

          <motion.div
            className="mt-6"
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button size="lg" className="bg-sky-900 text-white font-bold hover:bg-sky-700 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <span>Get Started Now</span> 
              <ChevronRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
