'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { Button } from '../../writingpage/ui/Button';
import supabase from '../../../../../config/supabaseClient';
import { useRouter } from 'next/navigation';
import { useUuid } from '../../UUIDContext';
import { jsPDF } from "jspdf";
import { useResults } from '../../resultsContext';
import { Home, BarChart2 } from 'lucide-react';
import englishWords from 'an-array-of-english-words';

const GRAMMAR_TABS = [
  { key: 'grammar', label: 'Grammar', icon: '📝' },
  { key: 'style', label: 'Style', icon: '🎨' },
  { key: 'rephrase', label: 'Rephrase', icon: '🔄' },
];

interface WritingPageProps {
  timeLimit: number;
  wordCount: number;
  selectedPrompt: string;
  generatePrompt: boolean;
  title: string;
  genre: string;
  topics: string[];
}

const countRealWords = (input: string) => {
  const words = input
    .replace(/[^\w\s']/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && englishWords.includes(w.toLowerCase()));
  return words.length;
};

export default function WritingPage(props: WritingPageProps) {
  const [currentWords, setCurrentWords] = useState(0);

  const {
    timeLimit,
    wordCount,
    selectedPrompt,
    generatePrompt,
    title,
    genre,
    topics,
  } = props;

  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);
  const [isTimeUp, setIsTimeUp] = useState(false);
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
  const [showDoneModal, setShowDoneModal] = useState(false);
  const router = useRouter();
  const [content, setContent] = useState('');
  const { userID, workID } = useUuid();
  const [uploading, setUploading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const safeUserID = userID || "unknown";
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const idleTimeLimit = 30000;
  const badWords = ['fuck', 'shit', 'bitch', 'asshole', 'damn', 'crap'];
  const [userCredits, setUserCredits] = useState<number>(0);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setEarnedExp, setEarnedCredits } = useResults();
  const [localWords, setLocalWords] = useState(currentWords);
  const [selectedError, setSelectedError] = useState<any | null>(null);
  const [highlightedErrorIdx, setHighlightedErrorIdx] = useState<number | null>(null);
  const [ignoredErrorIdxs, setIgnoredErrorIdxs] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'grammar' | 'style' | 'rephrase'>('grammar');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const getErrorIcon = (type: string) => {
    if (type.includes('Spelling')) return '📝';
    if (type.includes('Grammar')) return '✏️';
    if (type.includes('Style')) return '🎨';
    return '❗';
  };

  const checkGrammar = async (text: string) => {
    try {
      const response = await axios.post(
        
        'https://api.languagetool.org/v2/check',
        null,
        {
          params: {
            text,
            language: 'en-US',
            enabledOnly: false,
          },
        }
      );
      setGrammarErrors(response.data.matches || []);
      setInvalidWordIndexes([]);
      setCurrentWords(countRealWords(text));
    } catch (error) {
      setGrammarErrors([]);
      setInvalidWordIndexes([]);
      setCurrentWords(0);
    }
  };

  const fetchAiSuggestions = async (input: string) => {
    setLoadingAi(true);
    try {
      const res = await axios.post('/api/grammar', { text: input });
      setAiSuggestions(res.data.suggestions || []);
    } catch (e) {
      setAiSuggestions([]);
    }
    setLoadingAi(false);
  };

  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const { data, error } = await supabase
          .from("User")
          .select("userCredits")
          .eq("id", userID)
          .single();

        if (error) {
          setError("Error fetching user credits: " + error.message);
          return;
        }

        const credits = data?.userCredits || 0;
        setUserCredits(credits);
        setCanSave(credits >= 5000);
      } catch (err) {
        if (err instanceof Error) {
          setError("Error fetching user credits: " + err.message);
        } else {
          setError("An unknown error occurred while fetching user credits.");
        }
      }
    };

    if (userID) {
      fetchUserCredits();
    }
  }, [userID]);

  const HandleSaveClick = async () => {
    if (canSave) {
      saveWork();
    } else {
      console.log("User does not have enough credits to save work.");
    }
  };

  const saveWork = async () => {
    try {
      const writtenContent = textAreaRef.current?.value || "";

      const doc = new jsPDF();
      const marginLeft = 10;
      const marginTop = 30;
      const pageHeight = doc.internal.pageSize.height;
      const lineHeight = 10;
      const maxLineWidth = 180;

      doc.setFontSize(18);
      doc.text(title || "Untitled Work", marginLeft, 20);
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(writtenContent, maxLineWidth);
      let currentY = marginTop;

      for (let i = 0; i < lines.length; i++) {
        if (currentY + lineHeight > pageHeight - 10) {
          doc.addPage();
          currentY = 20;
        }
        doc.text(lines[i], marginLeft, currentY);
        currentY += lineHeight;
      }

      const pdfBlob = doc.output("blob");
      const fileName = `${title || "Untitled Work"}-${workID}-${userID}.pdf`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("written-works")
        .upload(`Saved Works/${fileName}`, pdfBlob, {
          cacheControl: "3600",
          upsert: true,
          contentType: "application/pdf",
        });

      if (uploadError) {
        console.error("Upload error:", uploadError.message);
        return;
      }

      alert("Progress saved!");

      const { data: signedUrlData } = await supabase
        .storage
        .from("written-works")
        .getPublicUrl(uploadData?.path || '');

      const fileUrl = signedUrlData?.publicUrl || '';
      if (!fileUrl) {
        console.error("File URL not available.");
        return;
      }

      const { data, error: insertError } = await supabase
        .from("worksFolder")
        .insert([
          {
            workID,
            userID,
            title,
            filename: fileName,
            fileUrl,
          },
        ]);

      if (insertError) {
        console.error("Insert error:", insertError.message);
        return;
      }

      const { data: updateData, error: updateError } = await supabase
        .from("User")
        .update({
          userCredits: userCredits - 5000,
        })
        .eq("id", userID);

      if (updateError) {
        console.error("Error updating credits:", updateError.message);
      }
    } catch (err) {
      console.error("Error saving work:", err);
    }
  };

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

  const applyGrammarCorrection = (errorIdx: number) => {
    if (
      !grammarErrors ||
      !Array.isArray(grammarErrors) ||
      errorIdx < 0 ||
      errorIdx >= grammarErrors.length
    ) return;

    const err = grammarErrors[errorIdx];
    if (!err || !err.replacements || err.replacements.length === 0) return;
    const replacement = err.replacements[0].value;
    const before = text;
    const errorStart = err.offset;
    const errorEnd = err.offset + err.length;
    if (errorStart < 0 || errorEnd > before.length) return;
    const corrected =
      before.slice(0, errorStart) +
      replacement +
      before.slice(errorEnd);
    setText(corrected);
    setSelectedError(null);
    setHighlightedErrorIdx(null);
  };

  const applyAllCorrections = () => {
    let newText = text;
    let offsetDiff = 0;
    grammarErrors.forEach((err, idx) => {
      if (
        !ignoredErrorIdxs.includes(idx) &&
        err.replacements &&
        err.replacements.length > 0
      ) {
        const replacement = err.replacements[0].value;
        const start = err.offset + offsetDiff;
        const end = start + err.length;
        newText =
          newText.slice(0, start) +
          replacement +
          newText.slice(end);
        offsetDiff += replacement.length - err.length;
      }
    });
    setText(newText);
    setSelectedError(null);
    setHighlightedErrorIdx(null);
  };

  const getHighlightedText = () => {
    if (!text || !grammarErrors.length) return text;

    const sortedErrors = [...grammarErrors].sort((a, b) => a.offset - b.offset);

    let lastIdx = 0;
    const elements = [];

    for (let i = 0; i < sortedErrors.length; i++) {
      if (ignoredErrorIdxs.includes(i)) continue;
      const err = sortedErrors[i];
      const start = err.offset;
      const end = err.offset + err.length;

      if (lastIdx < start) {
        elements.push(
          <span key={`text-${lastIdx}`}>{text.slice(lastIdx, start)}</span>
        );
      }

      elements.push(
        <span
          key={`error-${i}`}
          className={`bg-yellow-300 text-red-800 font-bold px-1 rounded transition-all duration-200 cursor-pointer`}
          onClick={() => {
            setSelectedError(err);
            setHighlightedErrorIdx(i);
          }}
          style={{
            boxShadow: highlightedErrorIdx === i ? '0 0 0 2px #0077b6' : undefined,
          }}
          title={err.message}
        >
          {text.slice(start, end)}
        </span>
      );

      lastIdx = end;
    }

    if (lastIdx < text.length) {
      elements.push(
        <span key={`text-end`}>{text.slice(lastIdx)}</span>
      );
    }

    return elements;
  };

  useEffect(() => {
    if (text.trim().length > 0) {
      checkGrammar(text);
      blurCensoredWords(text);
      checkRepeatedWords(text);
      setCurrentWords(countRealWords(text));
      fetchAiSuggestions(text);
    } else {
      setGrammarErrors([]);
      setInvalidWordIndexes([]);
      setCurrentWords(0);
      setAiSuggestions([]);
    }
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    const foundBadWords = containsBadWords(newText);
    if (foundBadWords.length > 0) {
      setWarning(`⚠️ Please avoid using inappropriate words like: ${foundBadWords.join(', ')}`);
    } else {
      setWarning(null);
    }
  };

  const toggleBlurEffect = (word: string) => {
    setBlurredWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  const handleCopy = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handleCut = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handleColorChange = (color: string) => setTextColor(color);

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
      if (currentWords > 0 && !idleWarning && currentWords < wordCount && !isTimeUp) {
        setIdleWarning(true);
        const wordArray = text.trim().split(/\s+/);
        wordArray.pop();
        setText(wordArray.join(' '));
        setIsIdle(true);
      } else if (currentWords >= wordCount || isTimeUp) {
        setIdleWarning(false);
      }
    }, idleTimeLimit);

    return () => {
      clearTimeout(typingTimer);
      setIsIdle(false);
      setIdleWarning(false);
    };
  }, [text, currentWords, idleWarning, wordCount, isTimeUp]);

  useEffect(() => {
    setLocalWords(currentWords);
  }, [currentWords]);

  const HandleResult = async () => {
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

      const userId = user.id;

      const { data: multiplierData, error: multiplierError } = await supabase
        .from('User')
        .select('userExpMultiplier, userCreditMultiplier, usercurrentExp, userCredits')
        .eq('id', userId)
        .single();

      if (multiplierError) {
        console.error('Error fetching multipliers:', multiplierError.message);
        return;
      }

      const {
        userExpMultiplier,
        userCreditMultiplier,
        usercurrentExp,
        userCredits,
      } = multiplierData;

      const earnedExp = currentWords * userExpMultiplier;
      const earnedCredits = currentWords * userCreditMultiplier;

      const { error: updateWordsError } = await supabase
        .from('written_works')
        .update({ numberofWords: currentWords })
        .eq('workID', workID);

      if (updateWordsError) {
        console.error('Error updating numberofWords in written_works:', updateWordsError.message);
        return;
      }

      setEarnedExp(earnedExp);
      setEarnedCredits(earnedCredits);
      setCurrentWords(currentWords);

      const newExp = (usercurrentExp || 0) + earnedExp;
      const newCredits = (userCredits || 0) + earnedCredits;

      const { error: userUpdateError } = await supabase
        .from('User')
        .update({
          usercurrentExp: newExp,
          userCredits: newCredits,
        })
        .eq('id', userId);

      if (userUpdateError) {
        console.error('Error updating User:', userUpdateError.message);
        return;
      }

      console.log(`User gained ${earnedExp} EXP and ${earnedCredits} Credits.`);
    } catch (error) {
      console.error('Error in HandleResult:', error);
    }
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
      {/* --- ENHANCED TITLE, GENRE, TOPIC BOXES --- */}
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
          {/* ...modal content... */}
        </div>
      )}

      {isTimeUp && currentWords < wordCount && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-red-100 via-white to-red-200 z-50 p-0 overflow-hidden">
          {/* ...modal content... */}
        </div>
      )}

      {/* --- WRITING AREA AND GRAMMAR SUGGESTION --- */}
      <div className="flex flex-col flex-grow items-center">
        <div className="w-full max-w-[1800px] flex flex-col gap-2">
          <textarea
            ref={textAreaRef}
            onChange={handleTextChange}
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

          {/* --- Enhanced Grammar Suggestion Box --- */}
          <div
            className="mt-2 bg-white border border-green-200 rounded-xl shadow flex flex-col animate-fadeIn"
            style={{
              maxHeight: 320,
              overflowY: 'auto',
              padding: '1.5rem 2rem',
              marginBottom: '0.5rem',
              borderWidth: 2
            }}
          >
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <span className="font-bold text-xl text-green-700 flex items-center gap-2">📝 Grammar Suggestions</span>
              <span className="ml-2 text-sm text-gray-500">
                {grammarErrors.length - ignoredErrorIdxs.length} issues found
              </span>
              {grammarErrors.length > 0 && (
                <Button
                  className="ml-auto px-4 py-1 text-xs bg-green-700 hover:bg-green-800 text-white rounded shadow"
                  onClick={applyAllCorrections}
                >
                  <span className="mr-1">✔️</span>Apply All
                </Button>
              )}
            </div>
            <ul className="list-none pl-0 text-base space-y-3">
              {grammarErrors && grammarErrors.length > 0 ? (
                grammarErrors.map((err, idx) =>
                  ignoredErrorIdxs.includes(idx) ? null : (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-green-300 transition-colors shadow-sm
                        ${highlightedErrorIdx === idx ? 'bg-green-50 border-green-400' : ''}`}
                      onClick={() => {
                        setSelectedError(err);
                        setHighlightedErrorIdx(idx);
                      }}
                    >
                      <span className="text-2xl mt-1">{getErrorIcon(err.rule?.category?.name || '')}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-green-900">{err.sentence || ''}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded font-semibold
                            ${err.rule?.issueType === 'misspelling'
                              ? 'bg-red-200 text-red-800'
                              : err.rule?.issueType === 'typographical'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-green-200 text-green-800'
                            }`}>
                            {err.rule?.issueType || 'Grammar'}
                          </span>
                          {err.rule?.category?.id && (
                            <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                              {err.rule?.category?.id}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-700 mb-1">{err.message || ''}</div>
                        {err.replacements && err.replacements.length > 0 && (
                          <div className="flex gap-2 flex-wrap mb-1">
                            <span className="text-xs text-gray-500">Suggestion:</span>
                            {err.replacements.slice(0, 3).map((r: any, i: number) => (
                              <span key={i} className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm font-mono">{r.value}</span>
                            ))}
                            <span className="ml-2 text-xs text-gray-400">
                              <span className="font-semibold">Preview:</span> <span className="italic">{err.sentence.replace(
                                text.slice(err.offset, err.offset + err.length),
                                err.replacements[0]?.value || ''
                              )}</span>
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          {err.replacements && err.replacements.length > 0 && (
                            <Button
                              className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
                              onClick={e => {
                                e.stopPropagation();
                                applyGrammarCorrection(idx);
                              }}
                            >
                              <span className="mr-1">✔️</span>Apply
                            </Button>
                          )}
                          <Button
                            className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                            onClick={e => {
                              e.stopPropagation();
                              setIgnoredErrorIdxs(prev => [...prev, idx]);
                            }}
                          >
                            Ignore
                          </Button>
                          <Button
                            className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 rounded relative group"
                            onClick={e => {
                              e.stopPropagation();
                            }}
                          >
                            Why?
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-white border border-blue-300 text-blue-900 text-xs rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                              {err.rule?.description || 'No explanation available.'}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </li>
                  )
                )
              ) : (
                <li className="text-gray-400 text-base pl-1">No grammar suggestions.</li>
              )}
            </ul>
          </div>

          {/* --- Error Details Modal/Popup --- */}
          {selectedError && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center relative border-2 border-green-200 animate-fadeIn">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-green-700 text-2xl transition-colors"
                  onClick={() => {
                    setSelectedError(null);
                    setHighlightedErrorIdx(null);
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-2xl font-extrabold mb-3 text-green-700 flex items-center justify-center gap-2">
                  <span>📝</span> Grammar Issue
                </h2>
                <div className="mb-2 text-lg text-green-900 font-semibold bg-green-50 rounded p-2 border border-green-100">
                  {selectedError.sentence}
                </div>
                <div className="mb-2 text-gray-700 text-base">{selectedError.message}</div>
                <div className="mb-2 text-gray-500 text-sm">
                  <span className="font-mono">{selectedError.replacements?.map((r: any) => r.value).join(', ')}</span>
                </div>
                {selectedError.replacements && selectedError.replacements.length > 0 && (
                  <Button
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                    onClick={() => {
                      const idx = grammarErrors.findIndex(e => e === selectedError);
                      applyGrammarCorrection(idx);
                    }}
                  >
                    <span className="mr-2">✔️</span>Apply Correction
                  </Button>
                )}
                <Button
                  className="mt-2 ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  onClick={() => {
                    const idx = grammarErrors.findIndex(e => e === selectedError);
                    setIgnoredErrorIdxs(prev => [...prev, idx]);
                    setSelectedError(null);
                    setHighlightedErrorIdx(null);
                  }}
                >
                  Ignore
                </Button>
                <Button
                  className="mt-2 ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                  onClick={() => {
                    setSelectedError(null);
                    setHighlightedErrorIdx(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
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