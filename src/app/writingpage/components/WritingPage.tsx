'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { Button } from '../../writingpage/ui/Button';
import supabase from '../../../../config/supabaseClient';
import { useRouter } from 'next/navigation';
import { useUuid } from './UUIDContext';

interface WritingPageProps {
  timeLimit: number;
  wordCount: number;
  selectedPrompt: string;
  generatePrompt: boolean;
  title: string;
  genre: string;
  topics: string[];
}

export default function WritingPage({
  timeLimit,
  wordCount,
  selectedPrompt,
  generatePrompt,
  title,
  genre,
  topics,
}: WritingPageProps) {
  const [currentWords, setCurrentWords] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [text, setText] = useState('');
  const [isIdle, setIsIdle] = useState(false);
  const [idleWarning, setIdleWarning] = useState(false);
  const [grammarErrors, setGrammarErrors] = useState<any[]>([]);
  const [paraphrasingSuggestions, setParaphrasingSuggestions] = useState<string[]>([]);
  const [fontStyle, setFontStyle] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('black');
  const [deletedWords, setDeletedWords] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [shakeEffect, setShakeEffect] = useState(false);
  const [blurredWords, setBlurredWords] = useState<string[]>([]);
  const [repeatedWordsWarning, setRepeatedWordsWarning] = useState<string | null>(null);
  const [showDoneModal, setShowDoneModal] = useState(false); // Track when writing is done
  const router = useRouter();
  const { generatedUuid } = useUuid();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const idleTimeLimit = 30000;
  const badWords = ['fuck', 'shit', 'bitch', 'asshole', 'damn', 'crap'];

  const containsBadWords = (text: string): string[] => {
    const words = text.toLowerCase().split(/\s+/);
    return words.filter((word) => badWords.includes(word));
  };

  const blurCensoredWords = (text: string) => {
    const censoredWords = containsBadWords(text);
    setBlurredWords(censoredWords);
  };

  const checkRepeatedWords = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length >= 2) {
      const lastWord = words[words.length - 1];
      const secondLastWord = words[words.length - 2];
      if (lastWord.toLowerCase() === secondLastWord.toLowerCase()) {
        setRepeatedWordsWarning(lastWord.toLowerCase());
      } else {
        setRepeatedWordsWarning(null);
      }
    } else {
      setRepeatedWordsWarning(null);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLimit]);

  useEffect(() => {
    const typingTimer = setTimeout(() => {
      if (!isTyping && currentWords > 0 && !idleWarning && currentWords < wordCount && !isTimeUp) {
        setIdleWarning(true);
        const wordArray = text.trim().split(/\s+/);
        wordArray.pop();
        setText(wordArray.join(' '));
        updateWordCount(wordArray.join(' '));
        setIsIdle(true);
      } else if (isTyping || currentWords >= wordCount || isTimeUp) {
        setIdleWarning(false);
      }
    }, idleTimeLimit);

    return () => {
      clearTimeout(typingTimer);
      setIsIdle(false);
      setIdleWarning(false);
    };
  }, [text, isTyping, currentWords, idleWarning, wordCount, isTimeUp]);

  const checkGrammar = async (text: string) => {
    try {
      const response = await axios.post('https://api.languagetool.org/v2/check', null, {
        params: { text: text },
      });
      setGrammarErrors(response.data.matches);
    } catch (error) {
      // Handle error silently
    }
  };

  const getParaphrasingSuggestions = async (text: string) => {
    try {
      const response = await axios.post('https://paraphrasing-api.com/api/v1/paraphrase', { text });
      setParaphrasingSuggestions(response.data.suggestions);
    } catch (error) {
      // Handle error silently
    }
  };

  useEffect(() => {
    if (text.trim()) {
      checkGrammar(text);
      getParaphrasingSuggestions(text);
      blurCensoredWords(text);
      checkRepeatedWords(text);
    }
  }, [text]);

  // Function to validate words
  const isValidWord = (word: string): boolean => {
    const regex = /^[a-zA-Z]+$/; // Only allow alphabetic words
    return word.length > 1 && regex.test(word);
  };

  // Update word count to exclude invalid words
  const updateWordCount = (textValue: string) => {
    const rawWords = textValue.trim().split(/\s+/).filter((word) => word !== '');
    const validWords = rawWords.filter(isValidWord);
    const totalWords = validWords.length;
    setCurrentWords(totalWords);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    updateWordCount(newText);
    setIsTyping(true);

    const foundBadWords = containsBadWords(newText);
    if (foundBadWords.length > 0) {
      setWarning(`⚠️ Please avoid using inappropriate words like: ${foundBadWords.join(', ')}`);
    } else {
      setWarning(null);
    }
  };

  const handleKeyPress = () => setIsTyping(true);
  const handleKeyUp = () => setIsTyping(false);
  const handleCopy = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handleCut = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handleColorChange = (color: string) => setTextColor(color);

  const HandleResult = async () => {
    try {
      // Update written_works table
      const { error: writtenWorksError } = await supabase
        .from('written_works')
        .update({
          numberofWords: currentWords,
        })
        .eq('workID', generatedUuid);

      if (writtenWorksError) {
        console.error('Error updating written_works in Supabase:', writtenWorksError.message);
      } else {
        console.log('written_works updated successfully.');
      }

      // Get current authenticated user
      const {
        data: { user },
        error: userFetchError,
      } = await supabase.auth.getUser();

      if (userFetchError) {
        console.error('Error fetching user from Supabase auth:', userFetchError.message);
        return;
      }

      if (!user) {
        console.warn('No authenticated user found.');
        return;
      }

      // Update User table with usercurrentExp and userCredits using user.id
      const { error: userError } = await supabase
        .from('User')
        .update({
          usercurrentExp: currentWords,
          userCredits: currentWords * 0.5,
        })
        .eq('id', user.id);

      if (userError) {
        console.error('Error updating User in Supabase:', userError.message);
      } else {
        console.log('User updated successfully.');
      }
    } catch (err) {
      console.error('Unexpected error updating data in Supabase:', err);
    }
  };

  const toggleBlurEffect = (word: string) => {
    setBlurredWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const splitTextWithEffects = () => {
    return text.split(/\s+/).map((word, index) => {
      const isDeleted = deletedWords.includes(word);
      const isBlurred = blurredWords.includes(word);
      const isRepeated = word.toLowerCase() === repeatedWordsWarning?.toLowerCase();

      return (
        <span
          key={index}
          onClick={() => toggleBlurEffect(word)}
          className={`inline-block mr-2 transition-all duration-200 ${isDeleted ? 'blink-text text-red-500' : ''} ${
            isRepeated ? 'bg-yellow-200 text-yellow-800 font-bold underline animate-pulse px-1 rounded-sm' : ''
          } ${shakeEffect ? 'animate-shake' : ''}`}
          style={{
            color: textColor,
            filter: isBlurred ? 'blur(5px)' : 'none',
            cursor: 'pointer',
          }}
        >
          {word}
        </span>
      );
    });
  };

  useEffect(() => {
    if (isTimeUp && currentWords >= wordCount) {
      setShowDoneModal(true);
    }
  }, [isTimeUp, currentWords, wordCount]);

  const handleSkip = () => {
    setShowDoneModal(true);
  };

  return (
    <div className="container mx-auto px-6 py-8 bg-white text-black min-h-screen flex flex-col relative pb-24">
    {/* Display Title, Genre, and Topic */}
<div className="mb-6">
  <h1 className="text-3xl font-bold text-black mb-4">{title || 'Untitled'}</h1>
  {genre && (
    <p className="text-lg text-gray-700">
      <strong>Genre:</strong> {genre}
    </p>
  )}
  {topics.length > 0 && (
    <p className="text-lg text-gray-700">
      <strong>Topic:</strong> {topics.join(', ')}
    </p>
  )}
</div>


      {/* You're Done Writing Modal */}
      {showDoneModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-sky-100 z-50 p-6">
          <div className="text-center bg-white rounded-2xl shadow-xl p-10 max-w-md w-full border border-sky-200 animate-fadeIn">
            {/* Done Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center shadow-lg animate-pop">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-black mb-2">
              You're Done Writing!
            </h1>
            <p className="text-black mb-6">Your progress has been saved</p>

            <div className="flex justify-center gap-4">
              {/* Back to Home Button */}
              <Button
                onClick={() => (router.push('/homepage'))}
                className="bg-sky-900 hover:bg-sky-700 text-white px-6 py-3 text-md rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Back to Home
              </Button>

              {/* New Button - Next Level */}
              <Button
                onClick={async () => {
                  await HandleResult()
                  router.push('/writingresults');
                }}
                className="bg-sky-900 text-white px-6 py-3 text-md rounded-full transition-all duration-400 transform hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:bg-sky-600 focus:ring-4 focus:ring-sky-300 focus:outline-none"
              >
                View Results
              </Button>
            </div>

     
            <div className="mt-10 flex justify-center gap-5 flex-wrap">
              {/* XP Earned */}


              {/* Credits Earned */}

            </div>
          </div>
        </div>
      )}

      {/* Time’s Up Modal */}
      {isTimeUp && currentWords < wordCount && (
        <div className="fixed inset-0 flex items-center justify-center bg-red-50 z-50 p-6">
          <div className="text-center bg-white rounded-2xl shadow-xl p-10 max-w-md w-full border border-red-200 animate-fadeIn">
            {/* Time’s Up Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pop">
              <svg
                className="w-8 h-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              Time’s up!
            </h1>
            <p className="text-gray-600 mb-6">
              You wrote {currentWords} words. You didn’t finish your writing in time. Try again or keep practicing!
            </p>

            {/* Continue Button (Buy with Credits) */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={() => alert('Continue writing with credits.')}
                className="bg-sky-700 hover:bg-sky-800 text-white text-md font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl w-64 py-3"
              >
                Continue (Buy with Credits)
              </Button>
            </div>

            {/* Save and Delete Buttons - Side by Side */}
            <div className="flex justify-center space-x-4 mb-6">
              {/* Save Button with Confirmation */}
              <Button
                onClick={() => {
                  const confirmed = window.confirm('Do you want to save your progress using credits?');
                  if (confirmed) {
                    alert('Progress saved!');
                    // Add your save logic here
                  }
                }}
                className="bg-white text-sky-600 border-2 border-sky-600 text-md rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-36 py-3"
              >
                Save (Credits)
              </Button>

              {/* Delete Button with Confirmation */}
              <Button
                onClick={async () => {
                  const confirmed = window.confirm('Are you sure you want to delete this session? This action cannot be undone.');
                  if (confirmed) {
                    await HandleResult();
                    alert('Session deleted!');
                    router.push('/homepage');
                  }
                }}
                className="bg-white text-red-600 border-2 border-red-600 text-md rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-36 py-3"
              >
                Delete Session
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          {/* Locked Font Selectors */}
          <div className="relative">
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value)}
              disabled
              className="p-3 border rounded-lg shadow-md bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
            >
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
            </select>
            <div className="absolute top-2 right-2 text-gray-500 text-xl pointer-events-none">🔒</div>
          </div>

          <div className="relative">
            <select
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              disabled
              className="p-3 border rounded-lg shadow-md bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
            >
              {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
            <div className="absolute top-2 right-2 text-gray-500 text-xl pointer-events-none">🔒</div>
          </div>

          <div className="relative">
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleColorChange(e.target.value)}
              disabled
              className="w-12 h-12 rounded-lg bg-gray-100 opacity-60 cursor-not-allowed"
            />
            <div className="absolute top-1 right-1 text-gray-500 text-xl pointer-events-none">🔒</div>
          </div>
        </div>
      </div>

  {/* Writing & Preview Section */}
  <div className="flex gap-8 flex-grow h-[550px]">
        {/* Writing Area */}
        <div className="w-full md:w-2/3 bg-white p-6 border rounded-lg shadow-lg flex flex-col h-full">
          <textarea
            ref={textAreaRef}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            onKeyUp={handleKeyUp}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onCut={handleCut}
            disabled={isTimeUp}
            placeholder={selectedPrompt || 'Start writing here...'}
            value={text}
            style={{
              fontFamily: fontStyle,
              fontSize: `${fontSize}px`,
              height: '200px',
              maxHeight: '200px',
              resize: 'none',
              overflowY: 'auto',
              overflowX: 'hidden',
              color: textColor,
              lineHeight: 1.6,
              width: '100%',
              boxSizing: 'border-box',
            }}
            className="w-full p-4 focus:outline-none border-2 border-skyblue rounded-lg shadow-md bg-white"
          />

          {/* Alert for repeated word */}
          {repeatedWordsWarning && (
            <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow-md flex items-center gap-2 animate-fade-in-down">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold">Repeated word detected:</p>
                <p>
                  You repeated "<span className="font-bold">{repeatedWordsWarning}</span>". Try using a synonym or remove it.
                </p>
              </div>
            </div>
          )}

          {warning && <div className="mt-4 text-red-500 text-center font-semibold">{warning}</div>}

          <div
            className="mt-4 text-lg overflow-y-auto flex-grow break-words whitespace-pre-wrap p-4 border border-gray-300 rounded-lg bg-gray-50"
            style={{ fontSize: `${fontSize}px`, color: textColor, maxHeight: '200px' }}
          >
            {splitTextWithEffects()}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-gradient-to-b from-skyblue to-blue-700 text-white p-6 border-l-2 h-full overflow-auto rounded-lg shadow-lg">
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2 text-black">
              Grammar Suggestions <span className="text-gray-500">🔒</span>
            </h4>
            <p className="text-black">Grammar Suggestions are locked.</p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2 text-black">
              Paraphrasing Suggestions <span className="text-gray-500">🔒</span>
            </h4>
            <p className="text-black">Paraphrasing Suggestions are locked.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full bg-white text-center z-10 shadow-md py-4">
        <Footer
          currentWords={currentWords}
          targetWords={wordCount}
          timeLeft={timeLeft}
          onSkip={handleSkip} // Pass the callback here
        />
      </div>
    </div>
  );
}