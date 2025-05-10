// FontContext.tsx

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FontContextType {
  availableFonts: { fontID: string; fontName: string }[];
  setAvailableFonts: React.Dispatch<React.SetStateAction<{ fontID: string; fontName: string }[]>>;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [availableFonts, setAvailableFonts] = useState<{ fontID: string; fontName: string }[]>([
    { fontID: '1', fontName: 'Arial' },
    { fontID: '2', fontName: 'Verdana' },
    { fontID: '3', fontName: 'Times New Roman' },
    { fontID: '4', fontName: 'Courier New' },
  ]);

  return (
    <FontContext.Provider value={{ availableFonts, setAvailableFonts }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFontContext = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFontContext must be used within a FontProvider');
  }
  return context;
};
