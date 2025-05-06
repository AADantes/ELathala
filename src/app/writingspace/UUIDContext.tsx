'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

type UuidContextType = {
  generatedUuid: string | null;
  setGeneratedUuid: (uuid: string | null) => void;
};

const UuidContext = createContext<UuidContextType | undefined>(undefined);

export const UuidProvider = ({ children }: { children: ReactNode }) => {
  const [generatedUuid, setGeneratedUuid] = useState<string | null>(null);

  // Custom setter that logs the UUID before setting it
  const setGeneratedUuidWithLog = (uuid: string | null) => {
    console.log('UUID set in context:', uuid);
    setGeneratedUuid(uuid);
  };

  return (
    <UuidContext.Provider value={{ generatedUuid, setGeneratedUuid: setGeneratedUuidWithLog }}>
      {children}
    </UuidContext.Provider>
  );
};

import supabase from '../../../config/supabaseClient';

export const useUuid = () => {
  const context = useContext(UuidContext);
  if (!context) {
    throw new Error('useUuid must be used within a UuidProvider');
  }
  return context;
};

/**
 * Fetches the userID associated with a given workID from the database.
 * @param workID The workID to look up.
 * @returns The userID as a string, or null if not found or error.
 */
export const getUserIdByWorkId = async (workID: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('written_works')
      .select('userID')
      .eq('workID', workID)
      .single();

    if (error) {
      console.error('Error fetching userID by workID:', error.message);
      return null;
    }

    return data?.userID || null;
  } catch (err) {
    console.error('Unexpected error fetching userID by workID:', err);
    return null;
  }
};
