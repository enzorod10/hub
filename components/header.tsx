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
          <div onClick={() => setToggleAi(prev => !prev)} className={`${toggleAi ? 'bg-blue-900' : ''} leading-none rounded-full border-2 p-2 border-blue-300 cursor-pointer`}>
            AI
          </div>
          <ModeToggle />
        </div>
      </nav>
    </div>
  );
}