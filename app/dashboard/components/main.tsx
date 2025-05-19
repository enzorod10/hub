'use client';

import { useState } from "react";
import Welcome from "./welcome";
import { LucideIcon } from "lucide-react";
import { useSessionContext } from "@/context/SessionContext";
import { Carousel } from "./carousel";
import { useDailyAnalysis } from "../hooks/useDailyAnalysis";
import Tasks from "./tasks";
import { useEventContext } from "@/context/EventContext";
import Weather from "./weather";

export default function Main() {
  const [theme, setTheme] = useState<{ bgGradient: string; icon: LucideIcon | null; animation: string }>({
    bgGradient: 'bg-white-500',
    icon: null,
    animation: '',
  });

  const { events } = useEventContext();

  const { user, loading } = useSessionContext();
  useDailyAnalysis(user);

  return (
      <div className="w-full h-full max-w-5xl mx-auto">
          <div className={`flex flex-col gap-4 p-4 w-full rounded-lg`}>
            <div className="flex">
              <Welcome name={user?.name} />
              <Weather theme={theme} setTheme={setTheme}/>
            </div>
            <Carousel dayAnalysis={user?.ai_day_analysis.find(dayAnalysis => dayAnalysis.date === new Date().toLocaleDateString('en-CA'))}/>
            <Tasks dayEvent={events.find(event => event.date === new Date().toLocaleDateString('en-CA') )}/>
          </div>
          {/* <Button disabled={loading} onClick={scrapeSite}>  {loading ? 'Scraping...' : 'Scrape Site'}</Button> */}
          {/* <Button  onClick={() => generateDayAnalysisPrompt({ user: user! })}> GENERATE </Button> */}
      </div>
  );
}