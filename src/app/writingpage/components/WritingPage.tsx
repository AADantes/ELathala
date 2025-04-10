import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/writingpage/ui/Button';

interface WritingPageProps {
  timeLimit: number;
  wordCount: number;
  generatePrompt: boolean;
  selectedPrompt: string;
}

export default function WritingPage({ timeLimit, wordCount, selectedPrompt }: WritingPageProps) {
  const [currentWords, setCurrentWords] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [text, setText] = useState('');
  const [isIdle, setIsIdle] = useState(false);
  const [idleWarning, setIdleWarning] = useState(false);
  const [grammarErrors, setGrammarErrors] = useState<any[]>([]);
  const [paraphrasingSuggestions, setParaphrasingSuggestions] = useState<string[]>([]);
  const [language, setLanguage] = useState('en-US');
  const [fontStyle, setFontStyle] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [deletedWords, setDeletedWords] = useState<string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [shakeEffect, setShakeEffect] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const idleTimeLimit = 30000;
  const warningTimeLimit = 2500;

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

  const checkGrammar = async (text: string, language: string) => {
    try {
      const response = await axios.post('https://api.languagetool.org/v2/check', null, {
        params: { text: text, language: language },
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
      checkGrammar(text, language);
      getParaphrasingSuggestions(text);
    }
  }, [text, language]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const prevText = text;
    setText(newText);
    setCurrentWords(newText.trim().split(/\s+/).length);
    setIsTyping(true);

    if (currentWords >= wordCount) return;

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

  const splitTextWithEffects = () => {
    return text.split(/\s+/).map((word, index) => {
      const isDeleted = deletedWords.includes(word);
      const error = grammarErrors.find((err) =>
        err.context.text.includes(word)
      );
      return (
        <span
          key={index}
          className={`${isDeleted ? 'blink-text text-red-500' : ''} ${error ? 'bg-yellow-300 text-black p-1 rounded' : ''} ${shakeEffect ? 'animate-shake' : ''}`}
          style={{ marginRight: '0.5rem' }}
        >
          {word}
        </span>
      );
    });
  };

  const applyCorrection = (index: number, suggestion: string) => {
    const newText = text.slice(0, grammarErrors[index].offset) + suggestion + text.slice(grammarErrors[index].offset + grammarErrors[index].length);
    setText(newText);
  };

  const applyParaphrase = (suggestion: string) => {
    setText(suggestion);
  };

  const handleCopy = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handleCut = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();

  if (isTimeUp) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white text-black z-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-dark-blue">Your Time is Up!</h1>
          <Button
            onClick={() => router.push('/homepage')}
            className="bg-dark-blue hover:bg-blue-700 text-white px-6 py-3 text-lg rounded"
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  const totalTime = timeLimit * 60;
  const timeProgress = Math.min(Math.max(((totalTime - timeLeft) / totalTime) * 100, 0), 100);

  return (
    <div className="container mx-auto px-6 py-8 bg-white text-black min-h-screen flex flex-col relative pb-24">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-3 border border-skyblue rounded-lg bg-white shadow-md text-black"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (GB)</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="tl">Filipino (Tagalog)</option>
          </select>

          <select
            value={fontStyle}
            onChange={(e) => setFontStyle(e.target.value)}
            className="p-3 border border-skyblue rounded-lg bg-white shadow-md text-black"
          >
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Verdana">Verdana</option>
          </select>

          <select
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="p-3 border border-skyblue rounded-lg bg-white shadow-md text-black"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
            <option value={20}>20px</option>
            <option value={22}>22px</option>
            <option value={24}>24px</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main Content Area */}
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
              height: '40vh',
              resize: 'none',
              overflow: 'auto',
            }}
            className="w-full p-4 focus:outline-none focus:ring-2 border-2 border-skyblue rounded-lg shadow-md bg-white text-black"
          />

          <div
            className="mt-4 text-lg overflow-y-auto h-[160px] break-words whitespace-pre-wrap p-4 border border-gray-300 rounded-lg shadow-inner bg-gray-50"
            style={{
              fontSize: `${fontSize}px`,
              overflowWrap: 'break-word',
              wordWrap: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            {splitTextWithEffects()}
          </div>

          {warning && (
            <div className="mt-4 text-red-500 text-center font-semibold">
              {warning}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-gradient-to-b from-skyblue to-blue-700 text-white p-6 border-l-2 border-skyblue h-[500px] overflow-auto rounded-lg shadow-lg">
          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2 text-sky-700">Grammar Suggestions</h4>
            {grammarErrors.length > 0 ? (
              <ul className="space-y-2">
                {grammarErrors.map((error, index) => (
                  <li key={index} className="p-3 bg-white text-black rounded-lg shadow-sm hover:bg-gray-200 transition">
                    <div className="text-sm font-bold text-black">{error.message}</div>
                    <div className="text-sm text-black">
                      Suggested Correction:{' '}
                      {error.replacements?.map((replacement: any) => (
                        <button
                          key={replacement.value}
                          className="text-black"  // Removed link style here
                          onClick={() => applyCorrection(index, replacement.value)}
                        >
                          {replacement.value}
                        </button>
                      ))}
                    </div>
                    <div className="text-sm text-black">
                      <em>{error.context.text}</em>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">No grammar errors found!</p>
            )}
          </div>

          <div className="mb-6">
            <h4 className="text-xl font-semibold mb-2 text-sky-700">Paraphrasing Suggestions</h4>
            {paraphrasingSuggestions.length > 0 ? (
              <ul className="space-y-2">
                {paraphrasingSuggestions.map((suggestion, index) => (
                  <li key={index} className="p-3 bg-white text-black rounded-lg shadow-sm hover:bg-gray-200 transition">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => applyParaphrase(suggestion)}
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-black">No paraphrasing suggestions found!</p>
            )}
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
