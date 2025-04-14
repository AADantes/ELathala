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

  if (isTimeUp) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-300 z-50 p-6">
        <div className="text-center bg-white rounded-xl shadow-2xl p-10 max-w-md w-full animate-fadeIn">
          <div className="text-5xl mb-4">{isGoalMet ? '🎉' : '⏰'}</div>
          <h1 className={`text-3xl font-bold mb-4 ${isGoalMet ? 'text-green-600' : 'text-red-600'}`}>
            {isGoalMet ? "You're Done Writing!" : 'Your Time is Up!'}
          </h1>
          <p className="text-gray-700">
            {isGoalMet
              ? 'Nice work! You’ve reached your word goal.'
              : 'Time’s up! You can still review your writing.'}
          </p>
          {!isGoalMet && (
            <Button
              onClick={() => setIsTimeUp(false)}
              className="bg-gray-700 hover:bg-gray-900 text-white px-6 py-3 text-lg rounded mt-6"
            >
              Review Writing
            </Button>
          )}
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
