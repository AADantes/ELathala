// UserTokenContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../../../config/supabaseClient";

interface UserTokenContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

const UserTokenContext = createContext<UserTokenContextType>({
  token: null,
  setToken: () => {},
});

// Hook to access the token
export const useUserToken = () => {
  return useContext(UserTokenContext).token;
};

// Hook to update the token
export const useSetUserToken = () => {
  return useContext(UserTokenContext).setToken;
};

export const UserTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
      }
    };
    fetchToken();
  }, []);

  return (
    <UserTokenContext.Provider value={{ token, setToken }}>
      {children}
    </UserTokenContext.Provider>
  );
};
