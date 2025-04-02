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
import Link from "next/link";

// import { useSessionContext } from '@/context/SessionContext';
// import Link from "next/link";
// import { createClient } from "@/utils/supabase/client";
// import { useRouter } from "next/navigation";
// import { format } from 'date-fns';
// import { revalidateUserInfo } from "@/app/actions";

// const supabase = createClient()

export function UserNav() {

//   const session = useSessionContext();
//   const router = useRouter();

  if (session.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className={`h-8 w-8 mx-auto ${session.user.photo_url ? 'border' : ''} ${session.user.photo_url ? 'p-1' : ''}`}>
              <AvatarImage
                src={`/profile_pictures/${session.user.photo_url}.png`}
                alt={session.user.username}
              />
              <AvatarFallback>{session.user.username[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.username || ''}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                Joined {format(session.user.join_date, 'MMMM yyyy')}
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
          <DropdownMenuItem onClick={async () => (await supabase.auth.signOut(), revalidateUserInfo(), router.push('/login'))}>
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