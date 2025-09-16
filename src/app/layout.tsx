import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RLS Guard Dog",
  description: "A project demonstrating Supabase Row-Level Security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <main className="min-h-screen flex flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
