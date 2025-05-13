'use client';
import { AIDayAnalysis } from "@/app/types";

// import ChatPage from "./components/ai-chat";
export default function Welcome({ dayAnalysis, name }: { dayAnalysis: AIDayAnalysis | undefined, name: string }) {
    return (
        <div className="flex flex-col justify-around w-2/3">
            <div className="text-2xl">
                Hi, {name}!
            </div>
            <div>
                {dayAnalysis?.message}
            </div>
            <div className="text-sm italic">
                &quot;Some inspirational quote here&quot; -Zhao Xing
            </div>
            
        </div>
    );
}