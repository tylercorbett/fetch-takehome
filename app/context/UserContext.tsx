"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { login as apiLogin, logout as apiLogout } from "../api/auth";

interface UserContextType {
  user: {
    email: string;
    name: string;
  } | null;
  isAuthenticated: boolean;
  login: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  setUser: (user: { email: string; name: string } | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (name: string, email: string) => {
    try {
      const success = await apiLogin({ name, email });
      if (success) {
        setUser({ name, email });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const success = await apiLogout();
      if (success) {
        setUser(null);
        setIsAuthenticated(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, login, logout, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
