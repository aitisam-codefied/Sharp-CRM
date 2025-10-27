"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

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

  const { toast } = useToast();

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
      const response = await api.post("/auth/login", {
        emailAddress,
        password,
      });

      const data = response.data;
      const userData = data.user;
      const accessToken = data.tokens?.accessToken;
      const refreshToken = data.tokens?.refreshToken;

      // Role check
      const isAccesible = userData?.roles?.some(
        (role: any) => role.name === "Admin" || role.name === "Manager"
      );

      if (!isAccesible) {
        toast({
          title: "Access Denied",
          description: "You are not authorized to log in.",
          variant: "destructive",
        });
        return null;
      }

      // ✅ Store user data
      localStorage.setItem("sms_user", JSON.stringify(userData));
      localStorage.setItem("sms_access_token", accessToken);
      localStorage.setItem("sms_refresh_token", refreshToken);

      // If you have a React Context
      setUser?.(userData);

      return userData;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Login failed. Please try again.";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });

      return null; // ✅ Return null to handle it gracefully
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

  const logout = async () => {
    try {
      const token = localStorage.getItem("sms_access_token");

      if (token) {
        await api.post(
          "/auth/logout",
          {}, // no body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Always clear local storage, even if API fails
      setUser(null);
      localStorage.removeItem("sms_user");
      localStorage.removeItem("sms_access_token");
      localStorage.removeItem("sms_refresh_token");
    }
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
