'use client';

import { useState } from "react";
import Welcome from "./welcome";
import { LucideIcon } from "lucide-react";
import { useSessionContext } from "@/context/SessionContext";
import { Carousel } from "./carousel";
import { useDailyAnalysis } from "../hooks/useDailyAnalysis";
import Tasks from "./tasks";
import { useEventContext } from "@/context/EventContext";

export default function Main() {
  const [theme, setTheme] = useState<{ bgGradient: string; icon: LucideIcon | null; animation: string }>({
    bgGradient: 'bg-white-500',
    icon: null,
    animation: '',
  });

  const { events } = useEventContext();

  const { user, loading } = useSessionContext();
  const [dailyAnalysisLoading, setDailyAnalysisLoading] = useState(false);
  useDailyAnalysis(user, setDailyAnalysisLoading);

  if (loading || dailyAnalysisLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <div className="text-indigo-500 text-xl font-semibold animate-pulse">
            {dailyAnalysisLoading ? 'Analyzing your day...' : 'Loading your dashboard...'}
          </div>
          <div className="text-gray-400 text-sm text-center max-w-xs">
            {dailyAnalysisLoading
              ? 'We’re preparing your personalized daily insights. This usually takes a few seconds.'
              : 'Fetching your personalized dashboard. Hang tight!'}
          </div>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-400 text-lg">Please sign in to view your dashboard.</div>
      </div>
    );
  }

  return (
      <div className="w-full h-full max-w-5xl mx-auto">
          <div className={`flex flex-col gap-4 p-4 w-full rounded-lg`}>
            <div className="flex">
              <Welcome name={user?.name} />
            </div>
            <Carousel dayAnalysis={user?.ai_day_analysis.find(dayAnalysis => dayAnalysis.date === new Date().toLocaleDateString('en-CA'))}/>
            <Tasks dayEvent={events.find(event => event.date === new Date().toLocaleDateString('en-CA') )}/>
          </div>
          {/* <Button disabled={loading} onClick={scrapeSite}>  {loading ? 'Scraping...' : 'Scrape Site'}</Button> */}
          {/* <Button  onClick={() => generateDayAnalysisPrompt({ user: user! })}> GENERATE </Button> */}
      </div>
  );
}