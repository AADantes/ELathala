'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { Button } from '@/app/writingpage/ui/Button';

interface WritingPageProps {
  timeLimit: number;
  wordCount: number;
  selectedPrompt: string;
  generatePrompt: boolean; // ✅ Added this line
}

export default function WritingPage({
  timeLimit,
  wordCount,
  selectedPrompt,
  generatePrompt, // ✅ Destructure it too
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
        setCurrentWords(wordArray.length);
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
      console.error('Grammar check failed:', error);
    }
  };

  const getParaphrasingSuggestions = async (text: string) => {
    try {
      const response = await axios.post('https://paraphrasing-api.com/api/v1/paraphrase', { text });
      setParaphrasingSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Paraphrasing failed:', error);
    }
  };

  useEffect(() => {
    if (text.trim()) {
      checkGrammar(text);
      getParaphrasingSuggestions(text);
      blurCensoredWords(text);
    }
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const prevText = text;

    setText(newText);

    const newWords = newText.trim().split(/\s+/);
    setCurrentWords(newText.trim() === '' ? 0 : newWords.length);
    setIsTyping(true);

    const foundBadWords = containsBadWords(newText);
    if (foundBadWords.length > 0) {
      setWarning(`⚠️ Please avoid using inappropriate words like: ${foundBadWords.join(', ')}`);
    } else {
      setWarning(null);
    }

    const prevWords = prevText.trim().split(/\s+/);
    if (newWords.length < prevWords.length) {
      const deletedWord = prevWords[prevWords.length - 1];
      setDeletedWords((prev) => [...prev, deletedWord]);
      setWarning(`Oops! You deleted "${deletedWord}".`);
      setShakeEffect(true);

      setTimeout(() => {
        setWarning(null);
        setShakeEffect(false);
      }, 2000);
    }
  };

  const handleKeyPress = () => setIsTyping(true);
  const handleKeyUp = () => setIsTyping(false);
  const handleCopy = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handleCut = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handleColorChange = (color: string) => setTextColor(color);

  const toggleBlurEffect = (word: string) => {
    setBlurredWords((prev) => {
      if (prev.includes(word)) {
        return prev.filter((w) => w !== word);
      } else {
        return [...prev, word];
      }
    });
  };

  const splitTextWithEffects = () => {
    return text.split(/\s+/).map((word, index) => {
      const isDeleted = deletedWords.includes(word);
      const isBlurred = blurredWords.includes(word);

      return (
        <span
          key={index}
          onClick={() => toggleBlurEffect(word)}
          className={`${isDeleted ? 'blink-text text-red-500' : ''} ${shakeEffect ? 'animate-shake' : ''}`}
          style={{
            marginRight: '0.5rem',
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

  const applyCorrection = (index: number, suggestion: string) => {
    const newText =
      text.slice(0, grammarErrors[index].offset) +
      suggestion +
      text.slice(grammarErrors[index].offset + grammarErrors[index].length);
    setText(newText);
  };

  const applyParaphrase = (suggestion: string) => setText(suggestion);

  const isGoalMet = currentWords >= wordCount;
  const disabled = true; // Suggestions are locked

  if (isTimeUp && currentWords >= wordCount) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f0f7fe] z-50 p-6">
        <div className="text-center bg-white rounded-2xl shadow-xl p-10 max-w-md w-full border border-gray-200 animate-fadeIn">
          {/* Glowing Check Icon */}
          <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] rounded-full flex items-center justify-center shadow-lg animate-pop">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
  
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            You’re done writing!
          </h1>
          <p className="text-gray-600 mb-6">Your progress has been saved.</p>
  
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-[#0c4a6e] hover:bg-[#0369a1] text-white px-6 py-3 text-md rounded-full mb-8 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Back to Home
          </Button>
  
          <div className="flex justify-center gap-4">
            <div className="bg-gradient-to-b from-[#dbeafe] to-[#bfdbfe] rounded-xl shadow-md px-5 py-4 text-center border border-blue-200 w-36">
              <div className="text-[#0c4a6e] text-xl font-bold flex items-center justify-center gap-1 mb-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.943a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.444a1 1 0 00-.364 1.118l1.287 3.943c.3.921-.755 1.688-1.54 1.118l-3.36-2.444a1 1 0 00-1.176 0l-3.36 2.444c-.784.57-1.838-.197-1.54-1.118l1.287-3.943a1 1 0 00-.364-1.118L2.075 9.37c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.95-.69l1.286-3.943z" />
                </svg>
                +120
              </div>
              <div className="text-sm font-medium text-gray-800">XP Earned</div>
            </div>
  
            <div className="bg-gradient-to-b from-[#dbeafe] to-[#bfdbfe] rounded-xl shadow-md px-5 py-4 text-center border border-blue-200 w-36">
              <div className="text-[#0c4a6e] text-xl font-bold flex items-center justify-center gap-1 mb-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.25 3.438 10.74 9 12 5.563-1.26 9-6.75 9-12V5l-9-4zM9 12.75V9.25L14.25 12 9 14.75z" />
                </svg>
                +40
              </div>
              <div className="text-sm font-medium text-gray-800">Credits Earned</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (isTimeUp && currentWords < wordCount) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#fee2e2] z-50 p-6">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full border border-gray-200 animate-fadeIn">
          {/* Clock X Icon */}
          <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-xl animate-pop">
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
  
          {/* Heading */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            Time is Up!
          </h1>
  
          {/* Word count info */}
          <p className="text-gray-700 mb-6">You wrote <strong>{currentWords}</strong> words.</p>
  
          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-center sm:gap-4 mb-6">
            {/* Continue button with slightly darker Sky Blue */}
            <Button
              onClick={() => alert('Continue (Buy with Credits) clicked')}
              className="bg-[#0c4a6e] hover:bg-[#0369a1] text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Continue (Buy with Credits)
            </Button>
            {/* Save button with slightly darker Sky Blue */}
            <Button
              onClick={() => alert('Save (Credits) clicked')}
              className="bg-[#0c4a6e] hover:bg-[#0369a1] text-white px-6 py-3 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Save (Credits)
            </Button>
          </div>
  
          {/* Centered Delete Session Button */}
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => alert('Delete Session clicked')}
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18M9 6v12m6-12v12M10 6l1-2h2l1 2" />
              </svg>
              Delete Session
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  
  
  
  return (
    <div className="container mx-auto px-6 py-8 bg-white text-black min-h-screen flex flex-col relative pb-24">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          {/* Font style */}
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

          {/* Font size */}
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

          {/* Color picker */}
          <div className="relative">
            <input
              type="color"
              value={textColor}
              onChange={(e) => handleColorChange(e.target.value)}
              disabled
              className="w-12 h-12 rounded-lg cursor-pointer bg-gray-100 opacity-60 cursor-not-allowed"
            />
            <div className="absolute top-1 right-1 text-gray-500 text-xl pointer-events-none">🔒</div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex gap-8 flex-grow">
        <div className="w-full md:w-2/3 bg-white p-6 border rounded-lg shadow-lg flex flex-col">
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
              minHeight: '40vh',
              height: '40vh',
              resize: 'none',
              overflow: 'auto',
              color: textColor,
            }}
            className="w-full p-4 focus:outline-none border-2 border-skyblue rounded-lg shadow-md bg-white"
          />

          <div
            className="mt-4 text-lg overflow-y-auto h-[160px] break-words whitespace-pre-wrap p-4 border border-gray-300 rounded-lg bg-gray-50"
            style={{ fontSize: `${fontSize}px`, color: textColor }}
          >
            {splitTextWithEffects()}
          </div>

          {warning && <div className="mt-4 text-red-500 text-center font-semibold">{warning}</div>}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-gradient-to-b from-skyblue to-blue-700 text-white p-6 border-l-2 h-[500px] overflow-auto rounded-lg shadow-lg">
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2 text-sky-700">
              Grammar Suggestions <span className="text-gray-500">🔒</span>
            </h4>
            <p className="text-black">Grammar Suggestions are locked.</p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-2 text-sky-700">
              Paraphrasing Suggestions <span className="text-gray-500">🔒</span>
            </h4>
            <p className="text-black">Paraphrasing Suggestions are locked.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full bg-white text-center z-10 shadow-md py-4">
        <Footer currentWords={currentWords} targetWords={wordCount} timeLeft={timeLeft} />
      </div>
    </div>
  );
}
