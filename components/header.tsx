'use client';

import React from 'react';
import { ModeToggle } from './ui/mode-toggle';
import Image from 'next/image';
import { MobileSidebar } from './mobile-sidebar';
import { cn } from '@/lib/utils';
import { useAiContext } from '@/context/AiContext';

export default function Header() {
  const { toggleAi, setToggleAi } = useAiContext();
  
  return (
    <div className="top-0 left-0 right-0 border-b supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className='flex items-center'>
          <div className={cn("block md:!hidden")}>
            <MobileSidebar />
          </div>
          <Image
            width={42}
            height={42}
            src='/logo/hub.png'
            alt="Hub"
          />
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Hub
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setToggleAi(prev => !prev)}
            className={`transition-colors duration-200 flex items-center justify-center w-10 h-10 rounded-full border-2 shadow-sm focus:outline-none focus:ring-2 active:scale-95
              ${toggleAi
                ? 'border-blue-600 bg-gradient-to-br from-blue-500 to-blue-700 ring-2 ring-blue-400/50'
                : 'border-blue-300 bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300'}
            `}
            aria-pressed={toggleAi}
            type="button"
          >
            <span className="sr-only">Toggle AI</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={toggleAi ? 'text-white' : 'text-blue-500'}>
              <circle cx="12" cy="12" r="10" />
              <path d="M15.5 8.5a4 4 0 0 0-7 3c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5a4 4 0 0 0-2-3.5" />
              <circle cx="12" cy="12" r="2" fill={toggleAi ? '#fff' : '#3b82f6'} />
            </svg>
          </button>
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
}