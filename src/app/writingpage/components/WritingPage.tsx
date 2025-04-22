'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { Button } from '@/app/writingpage/ui/Button';

interface WritingPageProps {
  timeLimit: number;
  wordCount: number;
  selectedPrompt: string;
  generatePrompt: boolean;
}

export default function WritingPage({
  timeLimit,
  wordCount,
  selectedPrompt,
  generatePrompt,
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
      checkRepeatedWords(text);
    }
  }, [text]);

  const updateWordCount = (textValue: string) => {
    const rawWords = textValue.trim().split(/\s+/);
    const filteredWords = rawWords.filter((word, index, arr) => {
      return index === 0 || word.toLowerCase() !== arr[index - 1].toLowerCase();
    });
    setCurrentWords(textValue.trim() === '' ? 0 : filteredWords.length);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const prevText = text;

    setText(newText);
    updateWordCount(newText);
    setIsTyping(true);

    const foundBadWords = containsBadWords(newText);
    if (foundBadWords.length > 0) {
      setWarning(`⚠️ Please avoid using inappropriate words like: ${foundBadWords.join(', ')}`);
    } else {
      setWarning(null);
    }

    const prevWords = prevText.trim().split(/\s+/);
    const newWords = newText.trim().split(/\s+/);

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
          className={`inline-block mr-2 transition-all duration-200 ${
            isDeleted ? 'blink-text text-red-500' : ''
          } ${isRepeated ? 'bg-yellow-200 text-yellow-800 font-bold underline animate-pulse px-1 rounded-sm' : ''} ${
            shakeEffect ? 'animate-shake' : ''
          }`}
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

  return (
    <div className="container mx-auto px-6 py-8 bg-white text-black min-h-screen flex flex-col relative pb-24">
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
