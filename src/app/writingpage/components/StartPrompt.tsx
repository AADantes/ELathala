'use client';

import React, { useState } from 'react';
import supabase from '../../../../config/supabaseClient';
import { Button } from '../../writingpage/ui/Button';
import { Input } from '../..//writingpage/ui/Input';
import { Checkbox } from '../../writingpage/ui/CheckBox';
import { useRouter } from 'next/navigation';
import { useUuid } from './UUIDContext';

interface StartPromptProps {
  onStart: (
    time: number,
    words: number,
    prompt: boolean,
    selectedPrompt: string,
    genre: string,
    topic: string,
    title: string
  ) => void;
}

const prompts = [
  "Write about a time when you surprised yourself with your own strength.",
  "If you could revisit one moment from your past, what would it be and why?",
  "Imagine meeting a version of yourself from 10 years in the future—what advice would you give them?",
  "Write about a habit you want to break and how it’s affected your life.",
  "What does happiness mean to you? Has your definition changed over time?",
];

const genres = [
  'Fiction',
  'Non-Fiction',
  'Poetry',
  'Journal Entry',
  'Creative Writing',
  'Memoir',
];

const genreTopics: { [key: string]: string[] } = {
  Fiction: [
    'Fantasy Worlds',
    'Superheroes',
    'Mystery',
    'Time Travel',
    'Alternate Realities',
  ],
  'Non-Fiction': [
    'Personal Growth',
    'True Stories',
    'History',
    'Self-Improvement',
    'Social Issues',
  ],
  Poetry: ['Love', 'Nature', 'Emotion', 'Dreams', 'Time'],
  Memoir: [
    'Life Lessons',
    'Family Stories',
    'Travel Experiences',
    'Overcoming Challenges',
    'Personal Milestones',
  ],
  'Creative Writing': [
    'Imagination Unleashed',
    'The Unknown',
    'What if...',
    'Inner Journeys',
    'Strange Adventures',
  ],
  'Journal Entry': [
    'Daily Reflections',
    'Personal Growth',
    'Current Events',
    'Dreams and Goals',
    'Thoughts on Society',
  ],
};

export default function StartPrompt({ onStart }: StartPromptProps) {
  const [step, setStep] = useState(1);
  const [genre, setGenre] = useState<string>('');
  const [timeLimit, setTimeLimit] = useState<string>('');
  const [wordCount, setWordCount] = useState<string>('');
  const [generatePrompt, setGeneratePrompt] = useState(false);
  const [topic, setTopic] = useState<string>('');
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [showStepMessage, setShowStepMessage] = useState(false);
  const [title, setTitle] = useState<string>(''); // Title state
  const { setGeneratedUuid } = useUuid()
  const router = useRouter();


  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
      setShowStepMessage(true);
      setTimeout(() => setShowStepMessage(false), 1000);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };



  const handleStart = async () => {
    const time = Number(timeLimit);
    const words = Number(wordCount);
    if (time < 1 || time > 60 || words < 50 || !genre || !topic || !title) return;
  
    const finalPrompt = generatePrompt
      ? prompts[Math.floor(Math.random() * prompts.length)]
      : '';
  
    // Call onStart function for starting the process
    onStart(time, words, generatePrompt, finalPrompt, genre, topic, title);
  
    // Set a timeout for when time is up
    setTimeout(() => {
      setTimeIsUp(true);
    }, time * 60 * 1000);
  
    // Insert the record into Supabase and retrieve the UUID
    try {
      const { data, error } = await supabase
        .from('written_works')
        .insert([
          {
            timelimitSet: time,
            noOfWordsSet: words,
            workPrompt: finalPrompt,
            workGenre: genre,
            workTopic: topic,
            workTitle: title,
          },
        ])
        .select('workID');
  
        if (error) {
          console.error('Error inserting data into Supabase:', error);
          return;
        }
    
        const generatedUuid = data?.[0]?.workID;
        console.log('Inserted new written work with UUID:', generatedUuid);
    
        // Save the UUID to context
        if (generatedUuid) {
          setGeneratedUuid(generatedUuid);
          console.log("UUID of Work: ", generatedUuid);
        }
    
      } catch (err) {
        console.error('Unexpected error inserting data into Supabase:', err);
      }
    };

  const isNextDisabled = () => {
    const isTimeInvalid = Number(timeLimit) < 1 || Number(timeLimit) > 60;
    const isWordCountInvalid = Number(wordCount) < 50;

    switch (step) {
      case 1:
        return !title || title.length < 3; // Title check
      case 2:
        return !genre; // Genre check
      case 3:
        return !topic; // Topic check
      case 4:
        return isTimeInvalid || isWordCountInvalid || !timeLimit || !wordCount; // Time & Word Count check
      case 5:
        return false; // Step 5 can always move forward if the other fields are validated
      case 6:
        return false; // Step 6 is final step, no need to validate
      default:
        return false;
    }
  };

  if (timeIsUp) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white z-50">
        <div className="text-center bg-white text-black p-10 rounded-xl shadow-lg w-96">
          <h1 className="text-3xl font-bold mb-4">Time’s Up!</h1>
          <Button
            onClick={() => router.push('/homepage')}
            className="bg-[#0077b6] hover:bg-[#005f73] text-white px-6 py-3 text-lg rounded-xl"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 z-50 font-poppins">
      <div className="bg-white p-6 rounded-3xl shadow-2xl w-[90%] max-w-md border-4 border-[#0077b6] transition-all">

        {/* Progress Bar */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex-1 px-1">
              <div
                className={`h-2 rounded-full ${step >= s ? 'bg-[#0077b6]' : 'bg-gray-300'} transition-all`}
              />
            </div>
          ))}
        </div>

        {/* Step Title */}
        <h2 className="text-2xl font-bold mb-2 text-center text-[#0077b6]">
          {step === 1 && 'Enter Your Title'}
          {step === 2 && 'Choose Your Genre'}
          {step === 3 && 'Choose Your Topic'}
          {step === 4 && 'Set Your Challenge'}
          {step === 5 && 'Prompt Option'}
          {step === 6 && 'Ready to Start'}
        </h2>
        <p className="text-center text-sm text-[#023e8a] mb-4">Step {step} of 6</p>

        {showStepMessage && (
          <div className="text-green-600 text-sm mb-2 text-center transition-opacity duration-500">
            Step {step - 1} complete!
          </div>
        )}

        {/* STEP 1: Title */}
        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold mb-1 text-[#0077b6]">
              Title of Your Work
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your title"
            />
            {title && title.length < 3 && (
              <p className="text-red-500 text-sm mt-2">
                Title must be at least 3 characters long.
              </p>
            )}
          </div>
        )}

        {/* STEP 2: Genre */}
        {step === 2 && (
          <div className="space-y-3">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`w-full py-2 text-sm rounded-xl font-semibold border-2 transition-all transform hover:scale-105 ${genre === g ? 'bg-[#0077b6] text-white border-[#0077b6]' : 'bg-white text-[#0077b6] border-[#0077b6]'}`}
              >
                {g}
              </button>
            ))}
            <button
              onClick={() => {
                setGenre('None');
                setTopic('None');
              }}
              className={`w-full py-2 text-sm rounded-xl font-semibold border-2 transition-all transform hover:scale-105 ${genre === 'None' ? 'bg-[#0077b6] text-white border-[#0077b6]' : 'bg-white text-[#0077b6] border-[#0077b6]'}`}
            >
              None
            </button>
          </div>
        )}

        {/* STEP 3: Topic */}
        {step === 3 && genre && (
          <div className="space-y-3">
            {genre !== 'None' &&
              genreTopics[genre]?.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`w-full py-2 text-sm rounded-xl font-semibold border-2 transition-all transform hover:scale-105 ${topic === t ? 'bg-[#0077b6] text-white border-[#0077b6]' : 'bg-white text-[#0077b6] border-[#0077b6]'}`}
                >
                  {t}
                </button>
              ))}
            {genre !== 'None' && (
              <button
                onClick={() => setTopic('None')}
                className={`w-full py-2 text-sm rounded-xl font-semibold border-2 transition-all transform hover:scale-105 ${topic === 'None' ? 'bg-[#0077b6] text-white border-[#0077b6]' : 'bg-white text-[#0077b6] border-[#0077b6]'}`}
              >
                None
              </button>
            )}
          </div>
        )}

        {/* STEP 4: Time & Word Limit */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#0077b6]">
                Time Limit (1–60 mins)
              </label>
              <Input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                min={1}
                max={60}
              />
              {timeLimit && (Number(timeLimit) < 1 || Number(timeLimit) > 60) && (
                <p className="text-red-500 text-sm mt-2">
                  Time limit must be between 1 and 60 minutes.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#0077b6]">
                Word Count (min 50)
              </label>
              <Input
                type="number"
                value={wordCount}
                onChange={(e) => setWordCount(e.target.value)}
                min={50}
              />
              {wordCount && Number(wordCount) < 50 && (
                <p className="text-red-500 text-sm mt-2">
                  Word count must be at least 50 words.
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Prompt Option */}
        {step === 5 && (
          <div className="flex items-center mt-4">
            <Checkbox
              id="generatePrompt"
              checked={generatePrompt}
              onCheckedChange={(checked) => setGeneratePrompt(!!checked)}
            />
            <label htmlFor="generatePrompt" className="ml-3 text-sm font-semibold text-[#0077b6]">
              Yes, give me a random prompt
            </label>
          </div>
        )}

        {/* STEP 6: Review */}
        {step === 6 && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Title:</span>
              <span className="text-gray-900 font-semibold">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Genre:</span>
              <span className="text-gray-900 font-semibold">{genre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Topic:</span>
              <span className="text-gray-900 font-semibold">{topic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Time Limit:</span>
              <span className="text-gray-900 font-semibold">{timeLimit} mins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Word Count:</span>
              <span className="text-gray-900 font-semibold">{wordCount} words</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Use Prompt:</span>
              <span className="text-gray-900 font-semibold">{generatePrompt ? 'Yes' : 'No'}</span>
            </div>
            <p className="text-center text-xs text-gray-500 pt-2">
              You're ready to begin your writing challenge!
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex justify-between items-center">
          {step === 1 ? (
            <Button
              onClick={() => router.push('/homepage')}
              className="bg-[#f0f4f8] text-[#0077b6] font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:bg-[#d1e6f1] hover:scale-105 active:scale-95"
            >
              Back to Homepage
            </Button>
          ) : (
            <Button
              onClick={handleBack}
              className="bg-[#0077b6] hover:bg-[#005f73] text-white px-6 py-3 rounded-xl transition hover:scale-105"
            >
              Back
            </Button>
          )}

          {step < 6 ? (
            <Button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className={`px-4 py-2 rounded-xl transition transform ${isNextDisabled() ? 'bg-gray-300 text-gray-500' : 'bg-[#0077b6] hover:bg-[#005f73] text-white hover:scale-105'}`}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleStart}
              className="bg-[#0077b6] hover:bg-[#005f73] text-white px-6 py-3 rounded-xl transition hover:scale-105"
            >
              Start Writing
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  }
