import React from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { UserNav } from './user-nav';
import { ModeToggle } from './ui/mode-toggle';

export default function Header() {
    return (
      <div className="top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
        <nav className="h-14 flex items-center justify-between px-4">
          <div className='flex items-center gap-3'>
                <Avatar className="h-9 w-9">
                    <AvatarImage
                        src='/logo/hub.png'
                        alt="Hub"
                    />
                </Avatar>       
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Hub
                </h4>
          </div>
          <div className="flex items-center gap-2">
            <UserNav />
            <ModeToggle />
          </div>
        </nav>
      </div>
    );
}