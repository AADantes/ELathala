'use client'

import { motion } from 'framer-motion'
import { Button } from "@/app/landingpage/ui/button"
import { ChevronRight } from 'lucide-react'

export default function CallToActionSection() {
  return (
    <motion.section 
      className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div 
            className="space-y-2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Level Up Your Writing?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
              Join Elathala today and start your journey to becoming a master wordsmith.
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
              Get Started Now <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}