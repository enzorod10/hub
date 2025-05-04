import React from 'react';
import { UserNav } from './user-nav';
import { ModeToggle } from './ui/mode-toggle';
import Image from 'next/image';
import { MobileSidebar } from './mobile-sidebar';
import { cn } from '@/lib/utils';

export default function Header() {
    return (
      <div className="top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
        <nav className="h-14 flex items-center justify-between px-4">
          <div className='flex items-center'>
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
          <div className={cn("block md:!hidden")}>
            <MobileSidebar />
          </div>
          <div className="flex items-center gap-2">
            <UserNav />
            <ModeToggle />
          </div>
        </nav>
      </div>
    );
}