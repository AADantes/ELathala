'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { Button } from '../../writingpage/ui/Button';
import supabase from '../../../../../config/supabaseClient';
import { useRouter } from 'next/navigation';
import { useUuid } from '../../UUIDContext';
import { Home, BarChart2 } from "lucide-react";

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
  const [invalidWordIndexes, setInvalidWordIndexes] = useState<number[]>([]);
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
      const response = await axios.post(
        'https://api.languagetool.org/v2/check',
        null,
        {
          params: {
            text: text,
            language: 'en-US',
            enabledOnly: false,
          },
        }
      );
      setGrammarErrors(response.data.matches || []);

      // Use LanguageTool's tokenization for accurate word count (API-based)
      let tokens: { token: string; isWord: boolean; start: number; end: number }[] = [];
      if (response.data && response.data.tokens) {
        response.data.tokens.forEach((t: any) => {
          tokens.push({
            token: t.token,
            isWord: t.isWord,
            start: t.offset,
            end: t.offset + t.token.length,
          });
        });
      } else {
        // Fallback: use regex as before
        const wordRegex = /\b[a-zA-Z]{2,}\b/g;
        let match;
        while ((match = wordRegex.exec(text)) !== null) {
          tokens.push({
            token: match[0],
            isWord: true,
            start: match.index,
            end: match.index + match[0].length,
          });
        }
      }

      // Mark invalid words by overlap with ANY grammar error span (not just spelling)
      const invalidIndexes: number[] = [];
      (response.data.matches || []).forEach((err: any) => {
        const errStart = err.context.offset;
        const errEnd = errStart + err.context.length;
        tokens.forEach((w, idx) => {
          if (w.isWord && w.start < errEnd && w.end > errStart && !invalidIndexes.includes(idx)) {
            invalidIndexes.push(idx);
          }
        });
      });

      // Remove repeated words (case-insensitive, consecutive only)
      const validWords: typeof tokens = [];
      let lastWord = '';
      for (let idx = 0; idx < tokens.length; idx++) {
        const w = tokens[idx];
        if (
          w.isWord &&
          !invalidIndexes.includes(idx) &&
          w.token.toLowerCase() !== lastWord
        ) {
          validWords.push(w);
          lastWord = w.token.toLowerCase();
        } else if (w.isWord) {
          lastWord = w.token.toLowerCase();
        }
      }

      setInvalidWordIndexes(invalidIndexes);
      setCurrentWords(validWords.length);
    } catch (error) {
      setGrammarErrors([]);
      setInvalidWordIndexes([]);
      setCurrentWords(0);
    }
  };

  useEffect(() => {
    if (text.trim()) {
      checkGrammar(text);
      blurCensoredWords(text);
      checkRepeatedWords(text);
    } else {
      setGrammarErrors([]);
      setInvalidWordIndexes([]);
      setCurrentWords(0);
    }
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
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
      // Calculate earned EXP and Credits
      const earnedExp = currentWords;
      const earnedCredits = currentWords * 0.5;
  
      // Call the function to update the written_works table
      await updateWrittenWorks(earnedExp);
  
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
  
      // Call the function to handle EXP and Credits gain
      await HandleExpCreditGain(earnedExp, earnedCredits);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };
  
  const updateWrittenWorks = async (earnedExp: number) => {
    try {
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
    } catch (err) {
      console.error('Error updating written_works:', err);
    }
  };
  
  const HandleExpCreditGain = async (earnedExp: number, earnedCredits: number) => {
    try {
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
  
      const { data: userData, error: userDataError } = await supabase
        .from('User')
        .select('usercurrentExp, userCredits')
        .eq('id', user.id)
        .single();
  
      if (userDataError) {
        console.error('Error fetching user data from User table:', userDataError.message);
        return;
      }
  
      if (!userData) {
        console.warn('No user data found.');
        return;
      }
  
      const newExp = (userData.usercurrentExp || 0) + earnedExp;
      const newCredits = (userData.userCredits || 0) + earnedCredits;
  
      const { error: userUpdateError } = await supabase
        .from('User')
        .update({
          usercurrentExp: newExp,
          userCredits: newCredits,
        })
        .eq('id', user.id);
  
      if (userUpdateError) {
        console.error('Error updating User in Supabase:', userUpdateError.message);
        return;
      }
  
      console.log('User updated successfully.');
  
      const searchParams = new URLSearchParams({
        earnedExp: earnedExp.toString(),
        earnedCredits: earnedCredits.toString(),
      }).toString();
  
      router.push(`/writingresults?${searchParams}`);
  
      console.log(`User gained ${earnedExp} EXP and ${earnedCredits} Credits.`);
    } catch (err) {
      console.error('Unexpected error:', err);
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
      {/* --- ENHANCED TITLE, GENRE, TOPIC BOXES (GREEN, BOLD LABELS) --- */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="bg-white border border-gray-300 rounded-lg px-5 py-2 shadow-sm flex items-center gap-2 min-w-[160px]">
          <span className="uppercase text-xs text-green-600 font-bold tracking-wider">Title:</span>
          <span className="text-black font-normal text-base truncate">{title || 'Untitled'}</span>
        </div>
        {genre && (
          <div className="bg-white border border-gray-300 rounded-lg px-5 py-2 shadow-sm flex items-center gap-2 min-w-[120px]">
            <span className="uppercase text-xs text-green-600 font-bold tracking-wider">Genre:</span>
            <span className="text-black font-normal text-base truncate">{genre}</span>
          </div>
        )}
        {topics.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg px-5 py-2 shadow-sm flex items-center gap-2 min-w-[120px]">
            <span className="uppercase text-xs text-green-600 font-bold tracking-wider">Topic:</span>
            <span className="text-black font-normal text-base truncate">
              {topics.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* --- FONT STYLE, SIZE, COLOR CONTROLS --- */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <div className="relative">
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value)}
              className="p-3 border rounded-lg shadow-md bg-white text-gray-700 border-gray-300"
            >
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="p-3 border rounded-lg shadow-md bg-white text-gray-700 border-gray-300"
            >
              {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                <option key={size} value={size}>
                  {size}px
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-12 rounded-lg bg-white border border-gray-300"
              title="Pick text color"
            />
          </div>
        </div>
      </div>

      {showDoneModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-200 z-50 p-0 overflow-hidden">
          <div
            className="relative text-center bg-white rounded-2xl shadow-2xl p-12 w-full max-w-2xl border border-sky-200 animate-fadeIn flex flex-col items-center"
            style={{
              maxHeight: "92vh",
              justifyContent: "center",
            }}
          >
            {/* Decorative Confetti */}
            <div className="absolute left-0 top-0 w-full flex justify-center pointer-events-none select-none">
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                <circle cx="10" cy="10" r="3" fill="#38bdf8" />
                <circle cx="40" cy="20" r="2" fill="#facc15" />
                <circle cx="80" cy="12" r="2.5" fill="#f472b6" />
                <circle cx="110" cy="8" r="2" fill="#34d399" />
                <circle cx="60" cy="30" r="2.5" fill="#f59e42" />
              </svg>
            </div>

            <div className="mx-auto mb-8 w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center shadow-lg animate-pop border-4 border-white">
              <svg
                className="w-10 h-10 text-white"
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

            <h1 className="text-3xl md:text-4xl font-extrabold text-sky-900 mb-6 drop-shadow">
              🎉 You're Done Writing!
            </h1>
            <p className="text-lg text-gray-700 mb-10">
              Congratulations on finishing your writing session. You can now view your results or return home.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-8 w-full">
              <Button
                onClick={() => router.push('/homepage')}
                className="bg-sky-900 hover:bg-sky-700 text-white px-10 py-5 text-lg rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 w-full sm:w-80 font-semibold shadow"
              >
                <Home className="h-6 w-6 mr-2" />
                Back to Home
              </Button>

              <Button
                onClick={async () => {
                  await HandleResult();
                  router.push('/writingspace/writingresults');
                }}
                className="bg-yellow-400 text-sky-900 px-10 py-5 text-lg rounded-full transition-all duration-400 transform hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:bg-yellow-300 focus:ring-4 focus:ring-yellow-200 focus:outline-none flex items-center gap-2 w-full sm:w-80 font-semibold shadow"
              >
                <BarChart2 className="h-6 w-6 mr-2" />
                View Results
              </Button>
            </div>
          </div>
        </div>
      )}

{isTimeUp && currentWords < wordCount && (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200 z-50 p-0 overflow-hidden">
    <div
      className="relative text-center bg-white rounded-2xl shadow-2xl p-12 w-full max-w-2xl border border-red-200 animate-fadeIn flex flex-col items-center"
      style={{
        maxHeight: "92vh",
        justifyContent: "center",
      }}
    >
      {/* Decorative Confetti */}
      <div className="absolute left-0 top-0 w-full flex justify-center pointer-events-none select-none">
        <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
          <circle cx="10" cy="10" r="3" fill="#f87171" />
          <circle cx="40" cy="20" r="2" fill="#facc15" />
          <circle cx="80" cy="12" r="2.5" fill="#f472b6" />
          <circle cx="110" cy="8" r="2" fill="#34d399" />
          <circle cx="60" cy="30" r="2.5" fill="#f59e42" />
        </svg>
      </div>

      <div className="mx-auto mb-8 w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pop border-4 border-white">
        <svg
          className="w-10 h-10 text-white"
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

      <h1 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-6 drop-shadow">
        ⏰ Time’s Up!
      </h1>
      <p className="text-lg text-gray-700 mb-10">
        You wrote <span className="font-bold text-red-600">{currentWords}</span> words.<br />
        You didn’t finish your writing in time.<br />
        Try again or keep practicing!
      </p>

      <div className="flex flex-col gap-5 mt-8 w-full items-center">
  <Button
    onClick={() => alert('Continue writing with credits.')}
    className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 text-lg rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2 font-semibold shadow w-full sm:w-[440px] justify-center"
  >
    Continue (Buy with Credits)
  </Button>
  <div className="flex flex-row justify-center gap-5 w-full">
    <Button
      onClick={() => {
        const confirmed = window.confirm('Do you want to save your progress using credits?');
        if (confirmed) {
          alert('Progress saved!');
        }
      }}
      className="bg-white text-gray-600 border-2 border-gray-400 text-lg rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full sm:w-[220px] py-5 font-semibold flex items-center justify-center"
      title="Save Credits"
    >
      {/* Save icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Save Credits
    </Button>
    <Button
      onClick={async () => {
        const confirmed = window.confirm('Are you sure you want to delete this session? This action cannot be undone.');
        if (confirmed) {
          await HandleResult();
          alert('Session deleted!');
          router.push('/writingspace/writingresults');
        }
      }}
      className="bg-white text-red-600 border-2 border-red-600 text-lg rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-full sm:w-[220px] py-5 font-semibold flex items-center justify-center"
      title="Delete Session"
    >
      {/* Delete/Trash icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10" />
      </svg>
      Delete Session
    </Button>
  </div>
</div>
    </div>
  </div>
)}

      {/* --- WRITING AREA AND GRAMMAR SUGGESTION --- */}
      <div className="flex flex-col flex-grow items-center">
        <div className="w-full max-w-[1800px] flex flex-col gap-2">
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
              background: '#fff',
              border: '2px solid #e5e7eb',
              borderRadius: '0.4rem',
              boxShadow: '0 4px 18px 0 rgba(0,0,0,0.10)',
              padding: '1rem',
              marginBottom: '0.25rem'
            }}
            className="focus:outline-none"
          />

          {repeatedWordsWarning && (
            <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 p-2 flex items-center gap-2 rounded shadow-sm">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold">Repeated word detected:</p>
                <p>
                  You repeated "<span className="font-bold">{repeatedWordsWarning}</span>". Try using a synonym or remove it.
                </p>
              </div>
            </div>
          )}

          {warning && <div className="mt-2 text-red-500 text-center font-semibold">{warning}</div>}

          {/* --- ENHANCED GRAMMAR SUGGESTION BOX --- */}
          <div
            className="mt-2 bg-white border border-gray-200 rounded-lg shadow flex flex-col"
            style={{
              maxHeight: 220,
              overflowY: 'auto',
              padding: '0.75rem 1.25rem',
              marginBottom: '0.25rem'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg text-green-700">Grammar Suggestions</span>
            </div>
            <ul className="list-disc pl-6 text-base space-y-1">
              {grammarErrors.length > 0 ? (
                grammarErrors.map((err, idx) => (
                  <li key={idx} className="mb-1">
                    <span className="font-semibold text-green-800">{err.context.text}</span>
                    <span className="ml-2">{err.message}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-base pl-1">No grammar suggestions.</li>
              )}
            </ul>
          </div>

          <div
            className="mt-2 text-lg overflow-y-auto flex-grow break-words whitespace-pre-wrap p-2 border border-gray-200 bg-gray-50 rounded"
            style={{ fontSize: `${fontSize}px`, color: textColor, maxHeight: '320px' }}
          >
            {splitTextWithEffects()}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-white text-center z-10 shadow-md py-4">
        <Footer
          currentWords={currentWords}
          targetWords={wordCount}
          timeLeft={timeLeft}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
}