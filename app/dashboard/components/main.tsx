'use client';
import { useState } from "react";
import Weather from "./weather";
import Welcome from "./welcome";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Main() {
      const [theme, setTheme] = useState<{ bgGradient: string; icon: LucideIcon | null; animation: string }>({
        bgGradient: 'bg-white-500',
        icon: null,
        animation: '',
      });

      const [data, setData] = useState([]);
      const [loading, setLoading] = useState(false);

      const scrapeSite = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/scrape?url=https://webscraper.io/test-sites/e-commerce/allinone');
          const result = await res.json();
          setData(result.data || []);
        } catch (err) {
          console.error('Failed to scrape:', err);
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
            <Button disabled={loading} onClick={scrapeSite}>  {loading ? 'Scraping...' : 'Scrape Site'}</Button>
        </div>
    );
}