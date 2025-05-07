'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type UuidContextType = {
  userID: string | null;
  workID: string | null;
  setUserID: (id: string | null) => void;
  setWorkID: (id: string | null) => void;
};

const UuidContext = createContext<UuidContextType | undefined>(undefined);

export const UuidProvider = ({ children }: { children: ReactNode }) => {
  const [userID, setUserID] = useState<string | null>(null);
  const [workID, setWorkID] = useState<string | null>(null);

  return (
    <UuidContext.Provider value={{ userID, workID, setUserID, setWorkID }}>
      {children}
    </UuidContext.Provider>
  );
};

export const useUuid = () => {
  const context = useContext(UuidContext);
  if (!context) {
    throw new Error('useUuid must be used within a UuidProvider');
  }
  return context;
};
