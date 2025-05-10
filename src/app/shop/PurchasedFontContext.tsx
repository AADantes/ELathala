// src/app/writingspace/PurchasedFontContext.tsx

import { createContext, useState, useContext, ReactNode } from 'react';

// Define the type of data we will store in the context
interface PurchasedFontContextType {
  purchasedFonts: string[]; // Array of purchased font names
  addPurchasedFont: (fontName: string) => void; // Function to add a font to the purchased list
}

// Create the context with default values
const PurchasedFontContext = createContext<PurchasedFontContextType | undefined>(undefined);

// Create a provider component
export const PurchasedFontProvider = ({ children }: { children: ReactNode }) => {
  const [purchasedFonts, setPurchasedFonts] = useState<string[]>([]);

  // Function to add a font to the list of purchased fonts
  const addPurchasedFont = (fontName: string) => {
    setPurchasedFonts((prev) => [...prev, fontName]);
  };

  return (
    <PurchasedFontContext.Provider value={{ purchasedFonts, addPurchasedFont }}>
      {children}
    </PurchasedFontContext.Provider>
  );
};

// Custom hook to use the PurchasedFontContext
export const usePurchasedFont = (): PurchasedFontContextType => {
  const context = useContext(PurchasedFontContext);
  if (!context) {
    throw new Error('usePurchasedFont must be used within a PurchasedFontProvider');
  }
  return context;
};
