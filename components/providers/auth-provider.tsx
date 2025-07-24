"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "@/services/authService";

interface User {
  _id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
  status: string;
  verified: boolean;
  [key: string]: any; // for details, locations, etc.
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("sms_user");
    const token = localStorage.getItem("sms_access_token");

    if (userData && token) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = async (emailAddress: string, password: string): Promise<boolean> => {
    try {
      const data = await loginUser({ emailAddress, password });

      const userData = data.user;
      const accessToken = data.tokens?.accessToken;
      const refreshToken = data.tokens?.refreshToken;

      if (userData && accessToken && refreshToken) {
        setUser(userData);
        localStorage.setItem("sms_user", JSON.stringify(userData));
        localStorage.setItem("sms_access_token", accessToken);
        localStorage.setItem("sms_refresh_token", refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sms_user");
    localStorage.removeItem("sms_access_token");
    localStorage.removeItem("sms_refresh_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
