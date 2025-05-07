// userContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  userID: string | null;
  setUserID: (id: string | null) => void;
}

export const UserContext = createContext<UserContextType>({
  userID: null,
  setUserID: () => {},
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userID, setUserID] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userID, setUserID }}>
      {children}
    </UserContext.Provider>
  );
};
