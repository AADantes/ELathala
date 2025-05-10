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
import { useFontContext } from '../../FontContext';

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
  const { availableFonts } = useFontContext();

  // Default font options
  const defaultFonts = [
    "Arial",
    "Georgia",
    "Times New Roman",
    "Courier New",
    "Verdana",
  ];

   const combinedFonts = Array.from(new Set([...defaultFonts, ...availableFonts.map(font => font.fontName)]));

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
        setCanSave(credits >= 2500);
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

  // Helper: Split text into sentences with start/end indices
  function splitTextWithIndices(text: string) {
    const regex = /[^.!?]+[.!?]*/g;
    let match;
    let sentences: { sentence: string; start: number; end: number }[] = [];
    let lastIndex = 0;
    while ((match = regex.exec(text)) !== null) {
      const sentence = match[0];
      const start = match.index;
      const end = start + sentence.length;
      sentences.push({ sentence, start, end });
      lastIndex = end;
    }
    if (lastIndex < text.length) {
      sentences.push({
        sentence: text.slice(lastIndex),
        start: lastIndex,
        end: text.length,
      });
    }
    return sentences;
  }

  // Replace your applySentenceCorrections with this:
  function applySentenceCorrectionsByOffset(sentenceStart: number, sentenceEnd: number) {
    // Find all errors within this sentence's offset range
    const errorsInSentence = grammarErrors
      .filter(
        (err, idx) =>
          err.offset >= sentenceStart &&
          err.offset + err.length <= sentenceEnd &&
          err.replacements &&
          err.replacements.length > 0 &&
          !ignoredErrorIdxs.includes(idx)
      )
      .sort((a, b) => a.offset - b.offset);

    let newText = text;
    let offsetDiff = 0;

    errorsInSentence.forEach((err) => {
      const replacement = err.replacements[0].value;
      const start = err.offset + offsetDiff;
      const end = start + err.length;
      newText = newText.slice(0, start) + replacement + newText.slice(end);
      offsetDiff += replacement.length - err.length;
    });

    setText(newText);
    setSelectedError(null);
    setHighlightedErrorIdx(null);
  }

  // Replace your renderHighlightedText with this:
  const renderHighlightedText = () => {
    if (!text) return text;

    const sentences = splitTextWithIndices(text);

    return sentences.map(({ sentence, start, end }, sIdx) => {
      // Find all errors in this sentence
      const errorsInSentence = grammarErrors
        .map((err, idx) => ({ ...err, idx }))
        .filter(
          (err) =>
            err.offset >= start &&
            err.offset + err.length <= end &&
            err.replacements &&
            err.replacements.length > 0 &&
            !ignoredErrorIdxs.includes(err.idx)
        )
        .sort((a, b) => a.offset - b.offset);

      if (errorsInSentence.length === 0) {
        return <span key={sIdx}>{sentence}</span>;
      }

      // Highlight only error words/phrases in the sentence
      let elements: React.ReactNode[] = [];
      let lastIdx = start;

      errorsInSentence.forEach((err, i) => {
        // Add normal text before the error
        if (lastIdx < err.offset) {
          elements.push(
            <span key={`${sIdx}-text-${i}`}>{text.slice(lastIdx, err.offset)}</span>
          );
        }
        // Highlight the error part
        elements.push(
          <span
            key={`err-${sIdx}-${i}`}
            className="relative font-semibold text-red-700 cursor-pointer transition-all group"
            style={{
              borderBottom: '2.5px solid #ef4444', // solid underline
              background: 'rgba(255, 237, 213, 0.7)',
              borderRadius: '0.25rem',
              padding: '0 2px',
              boxShadow: '0 1px 6px 0 rgba(255, 0, 0, 0.07)',
            }}
            title={err.message}
            tabIndex={0}
            onClick={() => applySentenceCorrectionsByOffset(start, end)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                applySentenceCorrectionsByOffset(start, end);
              }
            }}
          >
            {text.slice(err.offset, err.offset + err.length)}
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 max-w-[90vw] bg-white border border-red-300 text-red-900 text-xs rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto z-50"
              style={{
                minWidth: 180,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                boxSizing: 'border-box',
                right: 'auto',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <span className="font-semibold">Suggestion:</span>{" "}
              {err.replacements && err.replacements.length > 0
                ? err.replacements.slice(0, 3).map((r: any) => r.value).join(", ")
                : "No suggestion"}
              <br />
              <span className="text-gray-500">{err.message}</span>
              <br />
              <span className="italic text-gray-400">Click to auto-correct this sentence.</span>
              <div className="flex gap-2 mt-2 justify-center">
                <button
                  className="px-3 py-1 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded"
                  onClick={e => {
                    e.stopPropagation();
                    applyGrammarCorrection(err.idx);
                  }}
                >
                  Apply
                </button>
                <button
                  className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
                  onClick={e => {
                    e.stopPropagation();
                    setIgnoredErrorIdxs(prev => [...prev, err.idx]);
                  }}
                >
                  Ignore
                </button>
              </div>
            </span>
          </span>
        );
        lastIdx = err.offset + err.length;
      });

      // Add any remaining text after the last error
      if (lastIdx < end) {
        elements.push(
          <span key={`${sIdx}-text-end`}>{text.slice(lastIdx, end)}</span>
        );
      }
      return (
        <span
          key={sIdx}
          className="block mb-2 group cursor-pointer transition-all"
          style={{
            position: 'relative',
            // Para hindi mag-overlap ang underline ng error at sentence
            zIndex: 1,
          }}
        >
          <span
            className="group-hover:underline group-hover:decoration-dotted group-hover:decoration-2 group-hover:underline-offset-4 transition-all"
            style={{
              cursor: 'pointer',
            }}
          >
            {elements}
          </span>
        </span>
      );
    });
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
        const newText = wordArray.join(' ');
        if (newText !== text) {
          setText(newText); // Only update if changed
          setIsIdle(true);
        }
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


    router.push('/writingspace/writingresults');
  };

  useEffect(() => {
    if (isTimeUp && currentWords >= wordCount) {
      setShowDoneModal(true);
    }
  }, [isTimeUp, currentWords, wordCount]);

  const handleSkip = () => {
    setShowDoneModal(true);
  };

  function groupErrorsBySentence(errors: any[]) {
    const map: { [sentence: string]: any[] } = {};
    errors.forEach((err) => {
      if (!map[err.sentence]) map[err.sentence] = [];
      map[err.sentence].push(err);
    });
    return map;
  }





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
      {combinedFonts.map((font, index) => (
        <option key={index} value={font} style={{ fontFamily: font }}>
          {font}
        </option>
      ))}
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
        <div className="fixed inset-0 flex items-center justify-center bg-[#eaf6fb] z-50 p-0 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border-4 border-sky-300 animate-fadeIn">
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl text-sky-500 mb-2 animate-bounce">✔️</span>
              <h2 className="text-3xl font-extrabold mb-2 text-sky-700">You're Done Writing!</h2>
              <p className="mb-4 text-sky-700">
                Congratulations! You finished your writing with <span className="font-bold">{currentWords}</span> words.
              </p>
              <div className="w-full max-h-40 overflow-y-auto bg-white border border-sky-200 rounded p-3 mb-4 text-left text-sky-900 whitespace-pre-wrap break-words">
                {text}
              </div>
              <Button
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded mb-2"
                onClick={HandleResult}
                
              >
                View Results
              </Button>
              <Button
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
                onClick={HandleSaveClick}
                disabled={!canSave}
              >
                Save Work
              </Button>
            </div>
          </div>
        </div>
      )}

    {isTimeUp && currentWords < wordCount && (
  <div className="fixed inset-0 flex items-center justify-center bg-red-50 z-50 p-0 overflow-hidden">
    <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border-4 border-red-400 animate-fadeIn">
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl text-red-500 mb-2 animate-bounce">⏰</span>
        <h2 className="text-3xl font-extrabold mb-2 text-red-700">Time's Up!</h2>
        <p className="mb-4 text-red-700">
          You wrote <span className="font-bold">{currentWords}</span> words.<br />
          You didn't finish your writing in time.<br />
          Try again or keep practicing!
        </p>
       <div className="w-full max-h-40 overflow-y-auto bg-white border border-sky-200 rounded p-3 mb-4 text-left text-sky-900 whitespace-pre-wrap break-words">
  {text}
</div>

        <Button
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-2"
          onClick={HandleSaveClick}
          disabled={!canSave}
        >
          Save Work using Credits
        </Button>
        <Button
          className="w-full bg-gray-200 hover:bg-gray-300 text-red-700 font-bold py-2 px-4 rounded"
          onClick={HandleResult}
        >
          View Results
        </Button>
      </div>
    </div>
  </div>
)}

      {/* --- WRITING AREA AND GRAMMAR SUGGESTION --- */}
      <div className="flex flex-col flex-grow items-center">
        <div className="w-full max-w-[1800px] flex flex-col gap-2">
          {/* Highlighted text preview with blur for bad words and enhanced underline for grammar errors */}
          <div
            className="mb-4 p-4 border border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white min-h-[56px] max-h-56 overflow-y-scroll shadow-inner transition-all relative"
            style={{
              fontFamily: fontStyle,
              fontSize: `${fontSize}px`,
              color: textColor,
              lineHeight: 1.7,
              minHeight: '56px',
              letterSpacing: '0.01em',
              width: '100%',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              display: 'block',
            }}
          >
            {(() => {
              if (!text) return null;
              const sentences = splitTextWithIndices(text);

              // Render all sentences in one line, each sentence still hoverable
              return (
                <span style={{ width: '100%', display: 'inline' }}>
                  {sentences.map(({ sentence, start, end }, sIdx) => {
                    const errorsInSentence = grammarErrors
                      .map((err, idx) => ({ ...err, idx }))
                      .filter(
                        (err) =>
                          err.offset >= start &&
                          err.offset + err.length <= end &&
                          err.replacements &&
                          err.replacements.length > 0 &&
                          !ignoredErrorIdxs.includes(err.idx)
                      )
                      .sort((a, b) => a.offset - b.offset);

                    const words = sentence.split(/\b/);
                    let offset = start;
                    let elements: React.ReactNode[] = [];
                    let errorIdx = 0;

                    words.forEach((word, i) => {
                      const lowerWord = word.toLowerCase().trim();
                      const isBad = blurredWords.includes(lowerWord) && badWords.includes(lowerWord);

                      let isError = false;
                      let error = null;
                      if (
                        errorIdx < errorsInSentence.length &&
                        offset >= errorsInSentence[errorIdx].offset &&
                        offset < errorsInSentence[errorIdx].offset + errorsInSentence[errorIdx].length
                      ) {
                        isError = true;
                        error = errorsInSentence[errorIdx];
                      }

                      if (isBad) {
                        elements.push(
                          <span
                            key={`blur-${sIdx}-${i}`}
                            className="bg-gray-300 text-gray-300 rounded px-1 cursor-pointer select-none relative group transition-all"
                            style={{ filter: 'blur(4px)' }}
                            onClick={() => toggleBlurEffect(lowerWord)}
                            title="Click to reveal"
                          >
                            {word}
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                              Click to reveal
                            </span>
                          </span>
                        );
                      } else if (!isBad && blurredWords.includes(lowerWord)) {
                        elements.push(
                          <span
                            key={`unblur-${sIdx}-${i}`}
                            className="bg-yellow-100 text-red-700 rounded px-1 cursor-pointer underline decoration-wavy decoration-red-500"
                            onClick={() => toggleBlurEffect(lowerWord)}
                            title="Click to blur"
                          >
                            {word}
                          </span>
                        );
                      } else if (isError) {
                        elements.push(
                          <span
                            key={`err-${sIdx}-${i}`}
                            className="relative font-semibold text-red-700 cursor-pointer transition-all group"
                            style={{
                              borderBottom: '2.5px solid #ef4444',
                              background: 'rgba(255, 237, 213, 0.7)',
                              borderRadius: '0.25rem',
                              padding: '0 2px',
                              boxShadow: '0 1px 6px 0 rgba(255, 0, 0, 0.07)',
                              zIndex: 30, // bring to front
                            }}
                            title={error.message}
                            tabIndex={0}
                            onClick={() => applySentenceCorrectionsByOffset(start, end)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                applySentenceCorrectionsByOffset(start, end);
                              }
                            }}
                          >
                            {word}
                          </span>
                        );
                        errorIdx++;
                      } else {
                        elements.push(<span key={`text-${sIdx}-${i}`}>{word}</span>);
                      }
                      offset += word.length;
                    });

                    return (
                      <span
                        key={sIdx}
                        className="group cursor-pointer transition-all"
                        style={{
                          position: 'relative',
                          display: 'inline',
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="group-hover:underline group-hover:decoration-dotted group-hover:decoration-2 group-hover:underline-offset-4 transition-all"
                          style={{
                            cursor: 'pointer',
                            display: 'inline',
                          }}
                        >
                          {elements}
                        </span>
                      </span>
                    );
                  })}
                </span>
              );
            })()}
          </div>

          {/* The actual textarea for editing */}
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
              overflowY: 'scroll',
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

          {/* --- Warnings BELOW textarea --- */}
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

          {warning && (
            <div className="mb-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-2 rounded flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>
                <span className="font-semibold">Warning.</span>{" "}
                {warning.replace(/^⚠️\s*/, '').replace(/^Please avoid using inappropriate words like:/, 'Please avoid using inappropriate words like:')}
              </span>
            </div>
          )}

          {grammarErrors.length - ignoredErrorIdxs.length > 0 && (
            <div className="mb-2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-2 rounded flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>
                <span className="font-semibold">Grammar issues detected.</span> Click any highlighted text below to automatically correct the error.
              </span>
            </div>
          )}

          {/* --- Enhanced Grammar Suggestion Box --- */}
          <div
            className="mt-2 bg-white border border-sky-200 rounded-xl shadow flex flex-col animate-fadeIn"
            style={{
              maxHeight: 320,
              overflowY: 'auto',
              padding: '1.5rem 2rem',
              marginBottom: '0.5rem',
              borderWidth: 2
            }}
          >
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <span className="font-bold text-xl text-sky-700 flex items-center gap-2">📝 Grammar Suggestions</span>
              <span className="ml-2 text-sm text-gray-500">
                {grammarErrors.length - ignoredErrorIdxs.length} issues found
              </span>
              {grammarErrors.length > 0 && (
                <Button
                  className="ml-auto px-4 py-1 text-xs bg-sky-700 hover:bg-sky-800 text-white rounded shadow flex items-center"
                  onClick={applyAllCorrections}
                >
                  <span className="mr-1 flex items-center">
                    {/* White check SVG */}
                    <svg width="16" height="16" fill="white" viewBox="0 0 20 20">
                      <path fill="white" d="M7.629 15.314a1 1 0 0 1-1.415 0l-4.243-4.243a1 1 0 1 1 1.415-1.415l3.536 3.536 7.778-7.778a1 1 0 1 1 1.415 1.415l-8.486 8.485z"/>
                    </svg>
                  </span>
                  Apply All
                </Button>
              )}
            </div>
            <ul className="list-none pl-0 text-base space-y-3">
              {grammarErrors && grammarErrors.length > 0 ? (
                grammarErrors.map((err, idx) =>
                  ignoredErrorIdxs.includes(idx) ? null : (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-sky-300 transition-colors shadow-sm
                        ${highlightedErrorIdx === idx ? 'bg-sky-50 border-sky-400' : ''}`}
                      onClick={() => {
                        setSelectedError(err);
                        setHighlightedErrorIdx(idx);
                      }}
                    >
                      <span className="text-2xl mt-1">{getErrorIcon(err.rule?.category?.name || '')}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sky-900">{err.sentence || ''}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded font-semibold
                            ${err.rule?.issueType === 'misspelling'
                              ? 'bg-red-200 text-red-800'
                              : err.rule?.issueType === 'typographical'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-sky-200 text-sky-800'
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
                              <span key={i} className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-sm font-mono">{r.value}</span>
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
                              className="px-3 py-1 text-xs bg-sky-600 hover:bg-sky-700 text-white rounded"
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
              <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center relative border-2 border-sky-200 animate-fadeIn">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-sky-700 text-2xl transition-colors"
                  onClick={() => {
                    setSelectedError(null);
                    setHighlightedErrorIdx(null);
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-2xl font-extrabold mb-3 text-sky-700 flex items-center justify-center gap-2">
                  <span>📝</span> Grammar Issue
                </h2>
                <div className="mb-2 text-lg text-sky-900 font-semibold bg-sky-50 rounded p-2 border border-sky-100">
                  {selectedError.sentence}
                </div>
                <div className="mb-2 text-gray-700 text-base">{selectedError.message}</div>
                <div className="mb-2 text-gray-500 text-sm">
                  <span className="font-mono">{selectedError.replacements?.map((r: any) => r.value).join(', ')}</span>
                </div>
                {selectedError.replacements && selectedError.replacements.length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2 w-full">
                    <Button
                      className="flex-1 w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all border border-sky-700 flex items-center justify-center gap-2"
                      onClick={() => {
                        const idx = grammarErrors.findIndex(e => e === selectedError);
                        applyGrammarCorrection(idx);
                      }}
                    >
                      <span className="mr-2 flex items-center">
                        {/* White check SVG */}
                        <svg width="18" height="18" fill="white" viewBox="0 0 20 20">
                          <path fill="white" d="M7.629 15.314a1 1 0 0 1-1.415 0l-4.243-4.243a1 1 0 1 1 1.415-1.415l3.536 3.536 7.778-7.778a1 1 0 1 1 1.415 1.415l-8.486 8.485z"/>
                        </svg>
                      </span>
                      Apply Correction
                    </Button>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                  <Button
                    className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow transition-all border border-gray-300 flex items-center justify-center gap-2"
                    onClick={() => {
                      const idx = grammarErrors.findIndex(e => e === selectedError);
                      setIgnoredErrorIdxs(prev => [...prev, idx]);
                      setSelectedError(null);
                      setHighlightedErrorIdx(null);
                    }}
                  >
                    <span className="text-lg">🚫</span>
                    Ignore
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-sky-100 to-sky-200 hover:from-sky-200 hover:to-sky-300 text-sky-700 font-semibold px-4 py-2 rounded-lg shadow transition-all border border-sky-200 flex items-center justify-center gap-2"
                    onClick={() => {
                      setSelectedError(null);
                      setHighlightedErrorIdx(null);
                    }}
                  >
                    <span className="text-lg">✖️</span>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- DONE WRITING MODAL --- */}
      {showDoneModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#eaf6fb] z-50 p-0 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border-4 border-sky-300 animate-fadeIn">
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl text-sky-500 mb-2 animate-bounce">✔️</span>
              <h2 className="text-3xl font-extrabold mb-2 text-sky-700">You're Done Writing!</h2>
              <p className="mb-4 text-sky-700">
                Congratulations! You finished your writing with <span className="font-bold">{currentWords}</span> words.
              </p>
              <div className="w-full max-h-40 overflow-y-auto bg-white border border-sky-200 rounded p-3 mb-4 text-left text-sky-900 whitespace-pre-wrap break-words">
                {text}
              </div>
              <Button
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded mb-2"
                onClick={() => router.push('/homepage')}
              >
                Go to Homepage
              </Button>
              <Button
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
                onClick={HandleSaveClick}
                disabled={!canSave}
              >
                Save Work
              </Button>
            </div>
          </div>
        </div>
      )}

      {isTimeUp && currentWords < wordCount && (
        <div className="fixed inset-0 flex items-center justify-center bg-red-50 z-50 p-0 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border-4 border-red-400 animate-fadeIn">
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl text-red-500 mb-2 animate-bounce">⏰</span>
              <h2 className="text-3xl font-extrabold mb-2 text-red-700">Time's Up!</h2>
              <p className="mb-4 text-red-700">
                You wrote <span className="font-bold">{currentWords}</span> words.<br />
                You didn't finish your writing in time.<br />
                Try again or keep practicing!
              </p>
              <div className="w-full max-h-40 overflow-y-auto bg-white border border-red-200 rounded p-3 mb-4 text-left text-red-900 whitespace-pre-wrap break-words">
                {text}
              </div>
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-2"
                onClick={HandleSaveClick}
                disabled={!canSave}
              >
                Save using Credits
              </Button>
              <Button
                className="w-full bg-gray-200 hover:bg-gray-300 text-red-700 font-bold py-2 px-4 rounded"
                onClick={HandleResult}
              >
                View Results
              </Button>
            </div>
          </div>
        </div>
      )}

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