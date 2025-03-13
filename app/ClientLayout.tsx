"use client";
import { UserProvider } from "./context/UserContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
