import React, { useState } from 'react';
import { Button } from '@/app/writingpage/ui/Button';
import { Input } from '@/app/writingpage/ui/Input';
import { Checkbox } from '@/app/writingpage/ui/CheckBox';
import { useRouter } from 'next/navigation';

// New Professional Icons
import { HiOutlineClock } from 'react-icons/hi';
import { TbWriting } from 'react-icons/tb';
import { Edit } from 'react-feather'; // Importing Feather Edit icon

interface StartPromptProps {
  onStart: (time: number, words: number, prompt: boolean, selectedPrompt: string) => void;
}

const prompts = [
  "Write about a time when you surprised yourself with your own strength.",
  "If you could revisit one moment from your past, what would it be and why?",
  "Imagine meeting a version of yourself from 10 years in the future—what advice would you give them?",
  "Write about a habit you want to break and how it’s affected your life.",
  "What does happiness mean to you? Has your definition changed over time?",
];

export default function StartPrompt({ onStart }: StartPromptProps) {
  const [timeLimit, setTimeLimit] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [generatePrompt, setGeneratePrompt] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    if (Number(timeLimit) < 1 || Number(wordCount) < 50) return;
    const finalPrompt = generatePrompt
      ? prompts[Math.floor(Math.random() * prompts.length)]
      : '';
    onStart(Number(timeLimit), Number(wordCount), generatePrompt, finalPrompt);
    setTimeout(() => {
      setTimeIsUp(true);
    }, Number(timeLimit) * 60 * 1000);
  };

  if (timeIsUp) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white z-50">
        <div className="text-center bg-white text-black p-10 rounded-xl shadow-lg w-96">
          <h1 className="text-3xl font-bold mb-4">Your Time is Up!</h1>
          <Button
            onClick={() => router.push('/homepage')}
            className="bg-[#0077b6] hover:bg-[#005f73] text-white px-6 py-3 text-lg rounded-xl transition-all duration-300"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  const isStartDisabled = !timeLimit || !wordCount || Number(timeLimit) < 1 || Number(wordCount) < 50;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 transition-transform transform hover:scale-105">
        <h2
          className="text-3xl font-bold mb-8 text-center text-[#0077b6]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Start Writing
        </h2>

        <div className="space-y-8">
          {/* Time Limit Section */}
          <div>
            <label htmlFor="timeLimit" className="block text-sm font-semibold text-[#0077b6] flex items-center">
              <HiOutlineClock className="text-[#0077b6] mr-2" /> Time Limit (minutes)
            </label>
            <Input
              type="number"
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="mt-2 p-4 border-2 border-[#0077b6] rounded-xl w-full shadow-md focus:ring-2 focus:ring-[#0077b6] focus:outline-none transition-all duration-300"
              min={1}
            />
          </div>

          {/* Word Count Section */}
          <div>
            <label htmlFor="wordCount" className="block text-sm font-semibold text-[#0077b6] flex items-center">
              <TbWriting className="text-[#0077b6] mr-2" /> Word Count
            </label>
            <Input
              type="number"
              id="wordCount"
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
              className="mt-2 p-4 border-2 border-[#0077b6] rounded-xl w-full shadow-md focus:ring-2 focus:ring-[#0077b6] focus:outline-none transition-all duration-300"
              min={50}
            />
            {Number(wordCount) > 0 && Number(wordCount) < 50 && (
              <p className="text-red-500 text-sm font-semibold mt-2">
                Minimum of 50 words required!
              </p>
            )}
          </div>

          {/* Checkbox Section */}
          <div className="flex items-center">
            <Checkbox
              id="generatePrompt"
              checked={generatePrompt}
              onCheckedChange={(checked) => setGeneratePrompt(checked as boolean)}
            />
            <label htmlFor="generatePrompt" className="ml-2 text-sm font-semibold text-[#0077b6]">
              Generate Random Prompt?
            </label>
          </div>

          {/* Start Button with Feather Icon */}
          <Button
            onClick={handleStart}
            disabled={isStartDisabled}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center ${
              isStartDisabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#0077b6] hover:bg-[#005f73] text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <Edit className="mr-2 text-white transform hover:scale-110 transition-all duration-200" size={20} />
            Start Writing
          </Button>
        </div>
      </div>
    </div>
  );
}
