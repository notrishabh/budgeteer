"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import AddTransaction from "./AddTransaction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowRightLeft, ChartNoAxesCombined, Home } from "lucide-react";

export default function BottomBar() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  if (isLoginPage) {
    return null;
  }
  return (
    <NavigationMenu className="fixed bottom-0 w-full bg-white pt-2 pb-2 border-t border-gray-400">
      <NavigationMenuList className="w-full justify-evenly items-start">
        <NavigationMenuItem className="flex flex-col items-center justify-center space-y-1">
          <Button>
            <Home />
          </Button>
          <span className="text-xs">Home</span>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex flex-col items-center justify-center space-y-1">
          <Button>
            <ChartNoAxesCombined />
          </Button>
          <span className="text-xs">Charts</span>
        </NavigationMenuItem>
        <NavigationMenuItem className="">
          <AddTransaction />
        </NavigationMenuItem>
        <NavigationMenuItem className="flex flex-col items-center justify-center space-y-1">
          <Button>
            <ArrowRightLeft />
          </Button>
          <span className="text-xs">Transactions</span>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex flex-col items-center justify-center space-y-1">
          <div className="h-[36px]">
            <Avatar className="h-full w-full">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-xs">Account</span>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
