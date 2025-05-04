"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Nav } from "./sidebar";
import { navItems } from "@/constants/nav";

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
          <SheetContent side="left" className="!px-0">
            <div className="space-y-4 py-4">
              <div className="px-3 py-2">
                <div className="space-y-1">
                  <Nav items={navItems} setOpen={setOpen} />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    );
  }
}