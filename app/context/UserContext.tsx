"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  user: {
    email: string;
    name: string;
  } | null;
  setUser: (user: { email: string; name: string } | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null
  );

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
