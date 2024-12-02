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
import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const navMenuStyles = cva(
  "flex flex-col items-center justify-center space-y-1 pt-2 border-t-4 border-transparent",
);

export default function BottomBar() {
  const pathname = usePathname();
  console.log(pathname);
  const isLoginPage = pathname === "/login";
  if (isLoginPage) {
    return null;
  }
  return (
    <NavigationMenu className="fixed bottom-0 w-full bg-white pb-2 border-t border-gray-400">
      <NavigationMenuList className="w-full justify-evenly items-start">
        <NavigationMenuItem
          className={cn(
            navMenuStyles(),
            pathname === "/" ? "border-green-500" : "",
          )}
        >
          <Button asChild>
            <Link href="/">
              <Home />
            </Link>
          </Button>
          <span className="text-xs">Home</span>
        </NavigationMenuItem>
        <NavigationMenuItem
          className={cn(
            navMenuStyles(),
            pathname === "/stats" ? "border-green-500" : "",
          )}
        >
          <Button asChild>
            <Link href="/stats">
              <ChartNoAxesCombined />
            </Link>
          </Button>
          <span className="text-xs">Charts</span>
        </NavigationMenuItem>
        <NavigationMenuItem className="pt-2 border-t-4 border-transparent">
          <AddTransaction />
        </NavigationMenuItem>
        <NavigationMenuItem
          className={cn(
            navMenuStyles(),
            pathname === "/transactions" ? "border-green-500" : "",
          )}
        >
          <Button asChild>
            <Link href="/transactions">
              <ArrowRightLeft />
            </Link>
          </Button>
          <span className="text-xs">Transactions</span>
        </NavigationMenuItem>
        <NavigationMenuItem
          className={cn(
            navMenuStyles(),
            pathname === "/account" ? "border-green-500" : "",
          )}
        >
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
