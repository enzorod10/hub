"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSessionContext } from "@/context/SessionContext";
import Link from "next/link";
import { supabase } from '@/lib/supabaseClient'; // Ensure you have this file to create the supabase client

export function UserNav() {
  const session = useSessionContext();

  if (session.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className={`h-8 w-8 mx-auto`}>
              <AvatarImage
                src={`/profile_pictures/png`}
                alt='Avatar Image'
              />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                Username
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                Joined April 11, 2025
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={'/account'}>
              <DropdownMenuItem>
                Account
              </DropdownMenuItem>
            </Link>
            <Link href={'/settings'}>
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={async () => (await supabase.auth.signOut())}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else if (session.loading) {
    return (
     <div></div>
    )
  } else {
    return (
      <Link href='/login'>
        <Button>
          Sign in
        </Button>
      </Link>
    )
  }
}