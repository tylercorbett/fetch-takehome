import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dog Finder",
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
