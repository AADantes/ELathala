import React, { createContext, useState, useContext, useEffect } from 'react';

interface WritingContextType {
  writtenText: string;
  setWrittenText: (text: string) => void;
  // You can add more properties or methods if necessary
}

const WritingContext = createContext<WritingContextType | undefined>(undefined);

export const WritingProvider = ({ children }: { children: React.ReactNode }) => {
  const [writtenText, setWrittenText] = useState('');

  // Log the writtenText whenever it changes
  useEffect(() => {
    console.log('Written text updated:', writtenText);
  }, [writtenText]);

  return (
    <WritingContext.Provider value={{ writtenText, setWrittenText }}>
      {children}
    </WritingContext.Provider>
  );
};

export const useWritingContext = () => {
  const context = useContext(WritingContext);
  if (!context) throw new Error('useWritingContext must be used within a WritingProvider');
  return context;
};
