'use client';

import React, { useState } from 'react';
import StartPrompt from '../writingpage/components/StartPrompt';
import WritingPage from '../writingpage/components/WritingPage';
import {Header} from '../../homepage/components/Header';
import Sidebar from '../writingpage/components/Sidebar';

export default function Writingpage() {
  
  const [isWriting, setIsWriting] = useState(false);
  const [timeLimit, setTimeLimit] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [generatePrompt, setGeneratePrompt] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [topic, setTopic] = useState('');
  const [bgColor, setBgColor] = useState('#4F8FB7');
  const [uuid, setUuid] = useState<string | null>(null);


  const handleStart = (
    time: number,
    words: number,
    prompt: boolean,
    selectedPrompt: string,
    genre: string,
    topic: string,
    title: string
  ) => {
    setTimeLimit(time);
    setWordCount(words);
    setSelectedPrompt(selectedPrompt);
    setIsWriting(true);
    setGeneratePrompt(prompt);
    setGenre(genre);
    setTopic(topic);
    setTitle(title);
  };

  return (
    
      <div className="min-h-screen bg-white flex flex-col">
      {/* Header Component */}
      <Header
        // onMenuClick={() => setIsSidebarOpen(true)}
        // bgColor={bgColor} // Pass the current background color
        // setBgColor={setBgColor} // Pass the function to update the background color
        // title={title}
        // genre={genre}
        // topic={topic}
      />

      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        bgColor={bgColor}
      />

      {/* Main Content */}
      <div className="flex-grow relative">
        {!isWriting ? (
          <StartPrompt onStart={handleStart} />
        ) : (
          <WritingPage
            timeLimit={timeLimit}
            wordCount={wordCount}
            generatePrompt={generatePrompt}
            selectedPrompt={selectedPrompt}
            title={title}
            genre={genre}
            topics={[topic]} // Properly closed JSX
          />
        )}
      </div>
    </div>
  );
}
