'use client';
import { useState } from "react";
import Weather from "./weather";
import Welcome from "./welcome";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateDayAnalysis } from "@/lib/generate-day-analysis-ai";
import { useSessionContext } from "@/context/SessionContext";
import { useEventContext } from "@/context/EventContext";

export default function Main() {
      const [theme, setTheme] = useState<{ bgGradient: string; icon: LucideIcon | null; animation: string }>({
        bgGradient: 'bg-white-500',
        icon: null,
        animation: '',
      });

      const [data, setData] = useState([]);
      const [loading, setLoading] = useState(false);
      const { user } = useSessionContext();
      const { events } = useEventContext();

      const generateDailyAnalysis = async () => {
        
        setLoading(true);
        try {
          const res = generateDayAnalysis({ user: user!, events })
          console.log({ res })
        } catch (err) {
          console.error('Failed to generate daily analysis:', err);
        } finally {
          setLoading(false);
        }
      };
      
      console.log('Fetched Data: ' + data)
    return (
        <div className="w-full h-full">
            <div className={`${theme.bgGradient} flex p-4 h-1/2 w-full rounded-lg`}>
                <Welcome />
                <Weather theme={theme} setTheme={setTheme}/>
            </div>
            {/* <Button disabled={loading} onClick={scrapeSite}>  {loading ? 'Scraping...' : 'Scrape Site'}</Button> */}
            <Button disabled={loading} onClick={generateDailyAnalysis}>  {loading ? 'Generating...' : 'Generate Daily Analysis'}</Button>
        </div>
    );
}