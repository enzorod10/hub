'use client';

import { useState } from "react";
import Welcome from "./welcome";
import { LucideIcon } from "lucide-react";
import { useSessionContext } from "@/context/SessionContext";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Carousel } from "./carousel";
import { useDailyAnalysis } from "../hooks/useDailyAnalysis";

export default function Main() {
  const [theme, setTheme] = useState<{ bgGradient: string; icon: LucideIcon | null; animation: string }>({
    bgGradient: 'bg-white-500',
    icon: null,
    animation: '',
  });

  const { user, loading } = useSessionContext();
  useDailyAnalysis(user);

  console.log('CALL')

  return (
      <div className="w-full h-full">
          <div className={`flex flex-col gap-4 p-4 w-full rounded-lg`}>
              <Welcome name={user?.name} />
              {/* <Weather theme={theme} setTheme={setTheme}/> */}
              <Carousel dayAnalysis={user?.ai_day_analysis.find(dayAnalysis => dayAnalysis.date === new Date().toLocaleDateString('en-CA'))}/>
          </div>
          {/* <Button disabled={loading} onClick={scrapeSite}>  {loading ? 'Scraping...' : 'Scrape Site'}</Button> */}
          {/* <Button  onClick={() => generateDayAnalysisPrompt({ user: user! })}> GENERATE </Button> */}
      </div>
  );
}