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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex justify-center items-start py-8">
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2 items-center">
            <Welcome name={user?.name} />
            <div className="text-lg text-blue-700 font-medium mt-2">Your Personalized Dashboard</div>
            <div className="italic text-gray-400 text-sm mb-2">“Success is the sum of small efforts, repeated day in and day out.”</div>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-lg p-4">
            <Carousel dayAnalysis={user?.ai_day_analysis.find(dayAnalysis => dayAnalysis.date === new Date().toLocaleDateString('en-CA'))}/>
          </div>
          <div className="bg-white/80 rounded-2xl shadow-lg p-4">
            <Tasks dayEvent={events.find(event => event.date === new Date().toLocaleDateString('en-CA'))}/>
          </div>
        </div>
        {/* Sidebar widgets/stats skeleton */}
        <aside className="hidden md:flex flex-col gap-6 w-72 min-w-[250px]">
          <div className="bg-white/90 rounded-2xl shadow-lg p-4 flex flex-col gap-2 animate-pulse">
            <div className="h-5 w-1/2 bg-blue-100 rounded mb-2" />
            <div className="h-8 w-full bg-gray-100 rounded mb-2" />
            <div className="h-4 w-2/3 bg-blue-50 rounded" />
          </div>
          <div className="bg-white/90 rounded-2xl shadow-lg p-4 flex flex-col gap-2 animate-pulse">
            <div className="h-5 w-1/3 bg-indigo-100 rounded mb-2" />
            <div className="h-8 w-full bg-gray-100 rounded mb-2" />
            <div className="h-4 w-1/2 bg-indigo-50 rounded" />
          </div>
          <div className="bg-white/90 rounded-2xl shadow-lg p-4 flex flex-col gap-2 animate-pulse">
            <div className="h-5 w-1/4 bg-green-100 rounded mb-2" />
            <div className="h-8 w-full bg-gray-100 rounded mb-2" />
            <div className="h-4 w-1/3 bg-green-50 rounded" />
          </div>
        </aside>
      </div>
    </div>
  );
}