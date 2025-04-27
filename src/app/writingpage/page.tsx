'use client'

import React, { useState } from 'react';
import StartPrompt from '@/app/writingpage/components/StartPrompt';
import WritingPage from '@/app/writingpage/components/WritingPage';
import Header from '@/app/writingpage/components/Header';
import Sidebar from '@/app/writingpage/components/Sidebar';

export default function Writingpage() {
  const [isWriting, setIsWriting] = useState(false);
  const [timeLimit, setTimeLimit] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [generatePrompt, setGeneratePrompt] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for the background color
  const [bgColor, setBgColor] = useState<string>('#4F8FB7');

  const handleStart = (time: number, words: number, selectedPrompt: string) => {
    setTimeLimit(time);
    setWordCount(words);
    setSelectedPrompt(selectedPrompt);
    setIsWriting(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ backgroundColor: lightenColor(bgColor, 40) }}>
      {/* Pass bgColor and setBgColor to Header and Sidebar */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} bgColor={bgColor} setBgColor={setBgColor} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} bgColor={bgColor} />
      <div className="flex-grow relative">
        {!isWriting ? (
          <StartPrompt onStart={handleStart} />
        ) : (
          <WritingPage
            timeLimit={timeLimit}
            wordCount={wordCount}
            generatePrompt={generatePrompt}
            selectedPrompt={selectedPrompt}
          />
        )}
        {!isWriting && (
          <div className="absolute inset-0 bg-blue-200 opacity-50" style={{ zIndex: 10 }}></div>
        )}
      </div>
    </div>
  );
}

// Helper function to lighten color
function lightenColor(hex: string, percent: number = 40): string { // Increased to 40% lighter
  let color = hex.slice(1); // Remove the '#' character
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);

  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
