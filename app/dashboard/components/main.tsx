'use client';
import { useState } from "react";
import Weather from "./weather";
import Welcome from "./welcome";
import { LucideIcon } from "lucide-react";

export default function Main() {
      const [theme, setTheme] = useState<{ bgGradient: string; icon: LucideIcon | null; animation: string }>({
        bgGradient: 'bg-white-500',
        icon: null,
        animation: '',
      });

    return (
        <div className="w-full h-full">
            <div className={`${theme.bgGradient} flex p-4 h-1/2 w-full rounded-lg`}>
                <Welcome />
                <Weather theme={theme} setTheme={setTheme}/>
            </div>
        </div>
    );
}