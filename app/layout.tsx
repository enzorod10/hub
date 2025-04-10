import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AiTest } from "@/components/Ai";
import Nav from "@/components/nav";
import Header from "@/components/header";
import { SessionWrapper } from "@/context/SessionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Personal Hub | Home",
  description: "Your personal hub for everything.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // AiTest();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <div className="flex flex-col">
            <Header />
            <div className="flex">
              <Nav />
              {children}
            </div>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}