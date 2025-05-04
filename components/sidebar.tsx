'use client';
import { navItems } from "@/constants/nav";
import { NavItem } from "@/app/types";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link"
import React, { Dispatch, SetStateAction } from "react"
import { Icons } from "@/components/icons";

export default function Sidebar() {
  const pathname = usePathname();
  if (!['/', '/signup', '/login', '/privacy', '/terms'].includes(pathname)){
    return (
      <nav
        className={cn(`relative hidden h-screen border-r md:block `)}
      >
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <Nav items={navItems} />
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export function Nav({ items, setOpen }: { items: NavItem[],  setOpen?: Dispatch<SetStateAction<boolean>> }) {
    const path = usePathname();
    
    if (!['/'].includes(path)){
        return (
            <nav className="grid items-start gap-2">
                {items.map((item) => {
                    const Icon = Icons[item.icon as keyof typeof Icons || "arrowRight"];
                    return (
                        item.href && <Link
                        key={item.href}
                        href={item.disabled ? "/" : item.href}
                        onClick={() => {
                          if (setOpen) setOpen(false);
                        }}
                        >
                            <span
                            className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                path === item.href ? "bg-accent" : "transparent",
                                item.disabled && "cursor-not-allowed opacity-80",
                            )}
                            >
                                <Icon className="mr-2 h-7 w-7 md:max-lg:mx-auto" />
                                <div className="flex flex-col md:max-lg:hidden space-y-0.5">
                                    <p className="font-medium leading-none">
                                        {item.title}
                                    </p>

                                </div>
                                
                            </span>
                        </Link>
                    )})}
            </nav>
        )
    }
}