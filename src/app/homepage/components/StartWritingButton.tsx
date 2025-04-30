import Link from 'next/link';
import { Button } from "@/app/homepage/ui/button";
import { Feather } from 'lucide-react';
import { motion } from 'framer-motion';

export function StartWritingButton() {
  return (
    <div className="mt-8 text-center">
      <Link href="/writingpage">
        <Button
          size="lg"
          className="bg-sky-800 hover:bg-sky-900 text-white font-bold shadow-lg hover:shadow-3xl transition-all transform hover:scale-110 duration-300 ease-in-out"
        >
          Start Writing 
          <motion.div
            animate={{
              x: [0, 10, -10, 0],  // Writing motion sideways
              y: [0, -5, 5, 0],    // Pen up and down movement
              rotate: [0, 5, -5, 0], // Slight rotation for a more realistic writing feel
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          >
            <Feather className="ml-2 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:translate-x-2" />
          </motion.div>
        </Button>
      </Link>
    </div>
  );
}
