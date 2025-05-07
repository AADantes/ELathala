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
  const [localWords, setLocalWords] = useState(currentWords); // Local state for input/output binding



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
  
  // Remove the useEffect for `isTimeUp` to avoid automatic saving
  // Use a click event to trigger the save process
  
  const HandleSaveClick = async () => {
    if (canSave) {
      console.log("User has enough credits. Proceeding to save...");
      // Call your save logic here
      saveWork(); // Assuming saveWork is the function that does the actual saving
    } else {
      console.log("User does not have enough credits to save work.");
    }
  };
  
  // Handle the save functionality (generate PDF, upload to Supabase, insert record)
  const saveWork = async () => {
    try {
      const writtenContent = textAreaRef.current?.value || ""; // Get content from text area
  
      // Generate the PDF
      const doc = new jsPDF();
      const marginLeft = 10;
      const marginTop = 30;
      const pageHeight = doc.internal.pageSize.height;
      const lineHeight = 10;
      const maxLineWidth = 180; // A4 width minus margins (210 - 2*15)

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
  
      // Create a filename using title, workID, and userID
      const fileName = `${title || "Untitled Work"}-${workID}-${userID}.pdf`;
  
      console.log("Uploading file with name:", fileName);
  
      // Upload the PDF to Supabase
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
  
      console.log("Upload successful. File path:", uploadData?.path);
      alert("Progress saved!");
      
      // Get the public URL
      const { data: signedUrlData } = await supabase
        .storage
        .from("written-works")
        .getPublicUrl(uploadData?.path || '');
  
      const fileUrl = signedUrlData?.publicUrl || '';
      if (!fileUrl) {
        console.error("File URL not available.");
        return;
      }
  
      // Insert into worksFolder table
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
  
      console.log("Work saved successfully:", data);
  
      // Now deduct credits after saving
      const { data: updateData, error: updateError } = await supabase
        .from("User")
        .update({
          userCredits: userCredits - 5000, // Deduct 5000 credits
        })
        .eq("id", userID);
  
      if (updateError) {
        console.error("Error updating credits:", updateError.message);
      } else {
        console.log("User credits updated successfully:", updateData);
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

  const handleKeyPress = () => setIsTyping(true);
  const handleKeyUp = () => setIsTyping(false);
  const handleCopy = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handleCut = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();
  const handleColorChange = (color: string) => setTextColor(color);

//---------------------------------------//

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
  }, [timeLimit, text]);
  

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

  useEffect(() => {
    // If you need to update local state with currentWords from context
    setLocalWords(currentWords);
  }, [currentWords]);

  const HandleResult = async () => {
    try {
      // 1. Get authenticated user
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
  
      // 2. Fetch user multipliers
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
  
      // 3. Calculate earned EXP and credits
      const earnedExp = currentWords * userExpMultiplier;
      const earnedCredits = currentWords * userCreditMultiplier;
  
      
      setEarnedExp(earnedExp); // set the earnedExp in context
      setEarnedCredits(earnedCredits); // set the earnedCredits in context
      setCurrentWords(currentWords);
  
      // 5. Update User table
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
  
      // 6. Navigate to results page (no need to use searchParams now)
      router.push(`/resultspage`);
  
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
        <div className="fixed inset-0 flex items-center justify-center bg-sky-100 z-50 p-6">
          <div className="text-center bg-white rounded-2xl shadow-xl p-10 max-w-md w-full border border-sky-200 animate-fadeIn">
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

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => (router.push('/homepage'))}
                className="bg-sky-900 hover:bg-sky-700 text-white px-6 py-3 text-md rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Back to Home
              </Button>

              <Button
                  onClick={async () => {
                 const confirmed = window.confirm("Do you want to save your progress using credits?");
                  if (confirmed) {
                  try {
                   await HandleSaveClick();
        
                     } catch (err) {
                   console.error("Error during save:", err);
                      alert("An unexpected error occurred while saving.");
                      }
                    }
                 }}
                disabled={!canSave}
              className={`${
               !canSave ? "bg-gray-300 cursor-not-allowed border-gray-300 text-gray-500" : "bg-white text-sky-600 border-2 border-sky-600"
                } text-md rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-36 py-3`}
                    >
                    Save your Work
                  </Button>


              <Button
                onClick={async () => {
                  await HandleResult()
                  router.push('/writingspace/writingresults');
                }}
                className="bg-sky-900 text-white px-6 py-3 text-md rounded-full transition-all duration-400 transform hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:bg-sky-600 focus:ring-4 focus:ring-sky-300 focus:outline-none"
              >
                View Results
              </Button>
            </div>
          </div>
        </div>
      )}

      {isTimeUp && currentWords < wordCount && (
        <div className="fixed inset-0 flex items-center justify-center bg-red-50 z-50 p-6">
          <div className="text-center bg-white rounded-2xl shadow-xl p-10 max-w-md w-full border border-red-200 animate-fadeIn">
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

            <div className="flex justify-center space-x-4 mb-6">
            <Button
  onClick={async () => {
    const confirmed = window.confirm("Do you want to save your progress using credits?");
    if (confirmed) {
      try {
        await HandleSaveClick();
        
      } catch (err) {
        console.error("Error during save:", err);
        alert("An unexpected error occurred while saving.");
      }
    }
  }}
  disabled={!canSave}
  className={`${
    !canSave ? "bg-gray-300 cursor-not-allowed border-gray-300 text-gray-500" : "bg-white text-sky-600 border-2 border-sky-600"
  } text-md rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-36 py-3`}
>
  Save your Work
</Button>

              <Button
                onClick={async () => {
                    await HandleResult();
                    router.push('/writingspace/writingresults');
                  
                }}
                className="bg-white text-red-600 border-2 border-red-600 text-md rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg w-36 py-3"
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