"use client"
import { LayoutDashboard, Settings, Bell, Home } from "lucide-react"; // Using Lucide for consistent iconography
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { allnotification } from "@/server-actions/notifications";


const Navbar = () => {
const [notiLength,setNotiLength]=useState<number>(0)
   const { data } = authClient.useSession();
  const user = data?.user;
  
  const userImage = user?.image || "https://github.com/shadcn.png"
  useEffect(()=>{
  const getallnotification = async ()=>{
 const all =await allnotification()
 if(all?.data)
 setNotiLength(all.data.length)
  }
  getallnotification()
},[])
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] border-2 rounded-full  max-w-5xl">
      {/* Main Glass Container */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg border border-white/20 dark:border-slate-800 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-full">
      <Link href="/">
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-2 pl-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="hidden font-bold lg:inline-block tracking-tight text-slate-900 dark:text-slate-100">
            Vaultly
          </span>
        </div>
      </Link>

        {/* Center: Routes (Pill Style) */}
        <div className="flex items-center bg-slate-100/50 dark:bg-slate-800/50 rounded-full px-1 py-1 border border-slate-200/50 dark:border-slate-700/50">
        <Link href="/">  <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-white dark:hover:bg-slate-950 px-5 text-xs font-semibold"
          >
           <Home/> home
          </Button> 
          </Link>
           <Link href="/Inventory">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-white dark:hover:bg-slate-950 px-5 text-xs font-semibold"
            >
              Inventory
            </Button>
         </Link>
          <Link href="/Debts">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-white dark:hover:bg-slate-950 px-5 text-xs font-semibold"
            >
              Debts
            </Button>
          </Link>
        
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9">
  <Bell className="h-4 w-4" />
  {notiLength > 0 && (
    <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5">
      {notiLength}
    </span>
  )}
</Button>

          {  user &&     <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 ring-2 ring-primary/10 hover:ring-primary/30 transition-all"
              >
         <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={userImage}
                    alt="@shadcn"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 mt-4 rounded-2xl"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@vaultly.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem  className="text-destructive">
             <Button onClick={() => authClient.signOut()}>   Log out</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
