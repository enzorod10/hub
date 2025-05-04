'use client';
import { useAiContext } from '@/context/AiContext';
import React, { useEffect, useRef, useState } from 'react';

const matches = ["Redsox 10 - Yankees 2",
    "Nacional 8 - Penarol 1",
    "Team Rocket 2 - Other FC",
    "Random FC 1 - New FC 4",
    "Marquees 1 - Tlorense 2"] 

export default function AlertTab() {

    const { toggleAi, setToggleAi } = useAiContext();

    const marqueeRef = useRef<HTMLDivElement | null>(null);
    const [duration, setDuration] = useState(40); // seconds
    

    useEffect(() => {
        const el = marqueeRef.current;
        if (el) {
            const contentWidth = el.scrollWidth;
            const containerWidth = el.parentElement!.offsetWidth;
            const speed = 10; // pixels per second
            const newDuration = (contentWidth + containerWidth) / speed;
            setDuration(newDuration);
        }
    }, []);

    return (
      <div className="flex w-full justify-between items-center p-2 bg-gray-100">
        <div className="relative flex-1 overflow-x-hidden">
            <div
                ref={marqueeRef}
                className="whitespace-nowrap flex gap-4"
                style={{ animation: `marquee ${duration}s linear infinite` }}
            >
                {matches.map((match, idx) => <div key={idx}> {match} </div>)}
            </div>
        </div>
        <div className='flex items-center'>

            <span onClick={() => setToggleAi(prev => !prev)} className={`${toggleAi ? 'bg-cyan-300' : 'bg-slate-200' } mx-2 text-red-500 font-bold px-2 rounded`}>
                AI
            </span>
            <div className='flex flex-col leading-none gap-1 text-sm'>
                <div>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div>
                    {new Date().toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
                
            </div>
        </div>
      </div>
    );
}