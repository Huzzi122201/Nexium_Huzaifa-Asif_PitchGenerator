import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import BackgroundAnimation from "@/components/BackgroundAnimation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Pitch Writer - Craft Perfect Pitches",
  description: "Generate compelling business pitches with AI assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 min-h-screen`}>
        <AuthProvider>
          <BackgroundAnimation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
