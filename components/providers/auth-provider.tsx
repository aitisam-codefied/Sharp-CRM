"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  role: "admin" | "manager" | "staff"
  name: string
  branch?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const userData = localStorage.getItem("sms_user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const mockUsers = {
      "admin@sms.com": { id: "1", email: "admin@sms.com", role: "admin" as const, name: "System Admin" },
      "manager@sms.com": {
        id: "2",
        email: "manager@sms.com",
        role: "manager" as const,
        name: "Branch Manager",
        branch: "Manchester",
      },
      "staff@sms.com": {
        id: "3",
        email: "staff@sms.com",
        role: "staff" as const,
        name: "Staff Member",
        branch: "Manchester",
      },
    }

    const userData = mockUsers[email as keyof typeof mockUsers]
    if (userData && password) {
      setUser(userData)
      localStorage.setItem("sms_user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("sms_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
