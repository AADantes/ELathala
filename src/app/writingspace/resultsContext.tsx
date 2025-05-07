import { createContext, useContext, useState } from 'react';

const ResultsContext = createContext<any>(null);

export const ResultsProvider = ({ children }: { children: React.ReactNode }) => {
  const [earnedExp, setEarnedExp] = useState(0);
  const [earnedCredits, setEarnedCredits] = useState(0);
  const [currentWords, setCurrentWords] = useState(0); // Add currentWords to the context

  return (
    <ResultsContext.Provider 
      value={{ 
        earnedExp, 
        setEarnedExp, 
        earnedCredits, 
        setEarnedCredits,
        currentWords,        // Pass currentWords
        setCurrentWords      // Pass setter for currentWords
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
};

export const useResults = () => {
  return useContext(ResultsContext);
};
