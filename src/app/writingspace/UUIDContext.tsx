import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import  supabase  from '../../../config/supabaseClient'; // Make sure to import supabase correctly


type UuidContextType = {
  userID: string | null;
  workID: string | null;
  setUserID: (id: string | null) => void;
  setWorkID: (id: string | null) => void;
};

export const UuidContext = createContext<UuidContextType | undefined>(undefined);

export const UuidProvider = ({ children }: { children: ReactNode }) => {
  const [userID, setUserID] = useState<string | null>(null);
  const [workID, setWorkID] = useState<string | null>(null);

  // Fetch userID on mount (using Supabase or any other auth provider)
  useEffect(() => {
    const fetchUserID = async () => {
      const { data, error } = await supabase.auth.getUser(); // Updated method in Supabase v2.x
      if (error) {
        console.log('Error fetching user:', error.message);
        setUserID(null); // Handle error case
      } else if (data?.user) {
        console.log('Fetched userID from Supabase:', data.user.id);
        setUserID(data.user.id); // Set the user ID to state
      } else {
        console.log('No user logged in');
        setUserID(null); // No user logged in, set to null
      }
    };

    fetchUserID();
  }, []);

  return (
    <UuidContext.Provider value={{ userID, workID, setUserID, setWorkID }}>
      {children}
    </UuidContext.Provider>
  );
};

// Custom hook to use the context
export const useUuid = () => {
  const context = useContext(UuidContext);
  if (!context) {
    throw new Error('useUuid must be used within a UuidProvider');
  }

  console.log('useUuid context:', context); // Debugging

  return context;
};