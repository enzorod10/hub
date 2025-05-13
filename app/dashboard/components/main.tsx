'use client';
import { useEffect, useState } from "react";
import Weather from "./weather";
import Welcome from "./welcome";
import { LucideIcon } from "lucide-react";
import { generateDayAnalysisPrompt } from "@/lib/generate-day-analysis-ai-prompt";
import { useSessionContext } from "@/context/SessionContext";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function Main() {
  const [theme, setTheme] = useState<{ bgGradient: string; icon: LucideIcon | null; animation: string }>({
    bgGradient: 'bg-white-500',
    icon: null,
    animation: '',
  });

  const [data, setData] = useState([]);
  const { user } = useSessionContext();

  console.log(user?.ai_day_analysis)

  useEffect(() => {
    if (user){
      const today = new Date().toLocaleDateString('en-CA');
      const todayAnalysis = user.ai_day_analysis?.find(
        (entry) => entry.date === today
      );

      if (!todayAnalysis){
        console.log('CALL COUNTER')
        const generateDailyAnalysis = async () => {
          const supabase = createClient();

          try {
            const message = await generateDayAnalysisPrompt({ user: user! });

            const messages = [
              { role: 'system', content: message },
              { role: 'user', content: 'Please create an analysis for today.' },
            ];

            const res = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ messages }),
            });

            const data = await res.json();
            const cleaned = data.reply.trim();

            // Save to Supabase
            const { error } = await supabase
              .from('ai_day_analysis')
              .insert({
                user_id: user!.id,
                date: today,
                message: cleaned,
              }); // Prevent duplicates

            if (error) {
              console.error('[supabase_upsert_error]', error);
            }

          } catch (err) {
            console.error('Failed to generate daily analysis:', err);
          } finally {
            // setLoading(false);
          }
        };
        generateDailyAnalysis();
      }
    }
  }, [user])

  return (
      <div className="w-full h-full">
          <div className={`${theme.bgGradient} flex p-4 h-1/2 w-full rounded-lg`}>
              <Welcome name={user?.name} dayAnalysis={user?.ai_day_analysis.find(dayAnalysis => dayAnalysis.date === new Date().toLocaleDateString('en-CA'))}/>
              <Weather theme={theme} setTheme={setTheme}/>
          </div>
          {/* <Button disabled={loading} onClick={scrapeSite}>  {loading ? 'Scraping...' : 'Scrape Site'}</Button> */}
          <Button  onClick={() => generateDayAnalysisPrompt({ user: user! })}> GENERATE </Button>
      </div>
  );
}