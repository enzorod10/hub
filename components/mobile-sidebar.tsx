"use client";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Nav } from "./sidebar";
import { navItems } from "@/constants/nav";
import { UserNav } from "./user-nav";


export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  if (!['/'].includes(pathname)){
    return (
      <>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <MenuIcon />
          </SheetTrigger>
          <SheetContent side="left" className="!px-0 md:hidden">
            <SheetTitle className="sr-only">
              Navigation
            </SheetTitle>
            <div className="space-y-4 py-4 h-full flex flex-col justify-between">
              <div className="px-3 py-2">
                <div className="space-y-1">
                  <Nav items={navItems} setOpen={setOpen} />
                </div>
              </div>
              <div className="px-6 py-4">
                <UserNav />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }
}