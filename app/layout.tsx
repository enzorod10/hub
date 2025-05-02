import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { SessionWrapper } from "@/context/SessionContext";
import { ThemeProvider } from "@/components/theme-provider"
import AlertTab from "@/components/alert-tab";
import PortableAI from "@/components/ai/portable-ai";
import Sidebar from "@/components/sidebar";
import { EventProvider } from "@/context/EventContext";
import { AiWrapper } from "@/context/AiContext";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-100dvh overflow-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <SessionWrapper>
            <EventProvider>
              <AiWrapper>
                <div className="flex flex-col">
                  <Header />
                  <AlertTab />
                  <div className="flex relative h-[calc(100dvh-114px)]">
                    <Sidebar />
                    <div className="flex-1 p-4 relative h-[calc(100dvh-114px)] overflow-auto">
                      {children}
                    </div>
                    <PortableAI />
                  </div>
                </div>
              </AiWrapper>
            </EventProvider>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}