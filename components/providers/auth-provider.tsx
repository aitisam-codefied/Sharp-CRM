"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser } from "@/services/authService";

interface Location {
  _id: string;
  name: string;
}

interface Branch {
  _id: string;
  name: string;
  locations: Location[];
}

export interface Company {
  _id: string;
  name: string;
  type: string;
  isOnboarded: boolean;
  branches: Branch[];
}

export interface Roles {
  _id: string;
  name: any;
}

interface User {
  _id: string;
  emailAddress: string;
  fullName: string;
  phoneNumber: string;
  roles: Roles[];
  companies: Company[];
  status: string;
  verified: boolean;
  [key: string]: any; // for details, locations, etc.
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserCompanies: (newCompanies: Company[]) => void;
  updateUserBranchesManually: (newBranchData: {
    companyId: string;
    branch: Branch;
  }) => void;
  removeBranchFromCompany: (companyId: string, branchId: string) => void;
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

  const login = async (
    emailAddress: string,
    password: string
  ): Promise<any | null> => {
    try {
      const data = await loginUser({ emailAddress, password });

      const userData = data.user;
      const accessToken = data.tokens?.accessToken;
      const refreshToken = data.tokens?.refreshToken;

      if (userData && accessToken && refreshToken) {
        // Check if user has ADMIN role
        const isAdmin = userData?.roles?.some(
          (role: any) => role.name === "Admin"
        );

        if (!isAdmin) {
          // Do NOT save to localStorage or setUser
          return null;
        }

        // Authorized admin — safe to store in localStorage
        setUser(userData);
        localStorage.setItem("sms_user", JSON.stringify(userData));
        localStorage.setItem("sms_access_token", accessToken);
        localStorage.setItem("sms_refresh_token", refreshToken);

        return userData;
      }

      return null;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  };

  const updateUserCompanies = (newCompanies: Company[]) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, companies: newCompanies };
      localStorage.setItem("sms_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const updateUserBranchesManually = (newBranchData: {
    companyId: string;
    branch: Branch; // adjust type if needed
  }) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedCompanies = prev.companies.map((company) => {
        if (company._id === newBranchData.companyId) {
          return {
            ...company,
            branches: [...company.branches, newBranchData.branch], // add the new branch
          };
        }
        return company;
      });

      const updatedUser = {
        ...prev,
        companies: updatedCompanies,
      };

      localStorage.setItem("sms_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const removeBranchFromCompany = (companyId: string, branchId: string) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updatedCompanies = prev.companies.map((company) => {
        if (company._id === companyId) {
          return {
            ...company,
            branches: company.branches.filter(
              (branch) => branch._id !== branchId
            ),
          };
        }
        return company;
      });

      const updatedUser = { ...prev, companies: updatedCompanies };
      localStorage.setItem("sms_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("sms_user");
    localStorage.removeItem("sms_access_token");
    localStorage.removeItem("sms_refresh_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isLoading,
        updateUserCompanies,
        updateUserBranchesManually,
        removeBranchFromCompany,
      }}
    >
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
