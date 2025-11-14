import { axiosClient } from "@/axios-client/axios-client";
import { createContext, useState, useEffect, type ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: false,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await axiosClient.get<User>("/api/users/me");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token]);

  const login = (t: string) => {
    setToken(t);
    localStorage.setItem("token", t);
    setLoading(true);
    refreshUser();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
