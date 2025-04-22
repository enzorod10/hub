'use client';
import React, { useEffect, useRef, useState } from 'react';

const matches = ["Redsox 10 - Yankees 2",
    "Nacional 8 - Penarol 1",
    "Team Rocket 2 - Other FC",
    "Random FC 1 - New FC 4",
    "Marquees 1 - Tlorense 2"] 

export default function AlertTab() {
    
    const marqueeRef = useRef<HTMLDivElement | null>(null);
    const [duration, setDuration] = useState(40); // seconds

    useEffect(() => {
        const el = marqueeRef.current;
        if (el) {
            const contentWidth = el.scrollWidth;
            const containerWidth = el.parentElement!.offsetWidth;
            const speed = 80; // pixels per second
            const newDuration = (contentWidth + containerWidth) / speed;
            setDuration(newDuration);
        }
    }, []);

    return (
      <div className="flex w-full justify-between border border-red-500 border-4 p-3 bg-gray-100 text-secondary">
        {/* <div className="relative flex-1 overflow-x-hidden border">
            <div
                ref={marqueeRef}
                className="whitespace-nowrap flex gap-4"
                style={{ animation: `marquee ${duration}s linear infinite` }}
            >
                {matches.map((match, idx) => <div key={idx}> {match} </div>)}
            </div>
        </div>
        <div className='w-48 border'>
            2nd part
        </div> */}
      </div>
    );
}