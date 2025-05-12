import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/landingpage/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Edit } from 'react-feather';  // Import Feather icon
import Image from 'next/image';

export default function HeroSection({
  openSignUpDialog,
  user,
}: {
  openSignUpDialog: () => void;
  user?: any;
}) {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);

  const handleStartWriting = () => {
    if (user) {
      router.push('/writingspace');
    } else {
      setShowWarning(true);
      openSignUpDialog();
      setTimeout(() => setShowWarning(false), 3500);
    }
  };

  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-center justify-center bg-white overflow-hidden px-6 sm:px-12 lg:px-24">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center z-10 mt-16 md:mt-24 gap-y-12 md:gap-y-0 md:gap-x-24">
        {/* Left: Text Content */}
        <div className="flex-1 flex flex-col items-start justify-center text-left space-y-8 max-w-2xl w-full">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-sky-950 font-sans drop-shadow leading-tight whitespace-nowrap">
            Write, Achieve, and Level Up 
          </h1>
          <p className="text-black text-lg sm:text-xl leading-relaxed ml-2"> {/* Added margin-left here */}
            Transform your writing journey into an exciting adventure. Whether you're chasing a deadline or building a daily habit, iWrite keeps you motivated with gamified tools that track your growth and reward consistency.
          </p>
          <Button
            className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl shadow-lg px-8 py-4 text-lg transition-all flex items-center justify-center gap-3 ml-2" // Added margin-left here
            onClick={handleStartWriting}
          >
            <Edit className="text-white w-5 h-5" />
            Start Writing
          </Button>
          <AnimatePresence>
            {showWarning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                className="w-auto max-w-full flex items-center gap-2 bg-red-50 border border-red-300 rounded-lg px-4 py-2 shadow-lg text-center"
              >
                <AlertTriangle className="text-red-500 w-5 h-5 animate-bounce shrink-0" />
                <span className="text-red-700 font-semibold text-sm sm:text-base">
                  Please <span className="underline underline-offset-2">sign up</span> or <span className="underline underline-offset-2">log in</span> to start writing!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Image */}
        <div className="flex-1 flex items-center justify-center w-full md:w-auto md:ml-24">
          <Image
            src="https://img.freepik.com/premium-vector/game-colors-vector-icon-illustration-game-joystick-controler-brush-pencil-magic-tool-icon-concept-white-isolated-flat-cartoon-style-suitable-web-landing-page-banner-sticker-background_1033579-129269.jpg?w=740"
            alt="Creative Writing Illustration"
            className="w-full max-w-xs rounded-2xl shadow-xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
