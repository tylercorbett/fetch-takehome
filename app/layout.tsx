import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fetch Takehome",
  description: "Fetch Frontend Takehome Exercise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
