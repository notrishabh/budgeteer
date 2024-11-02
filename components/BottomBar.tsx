import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import AddTransaction from "./AddTransaction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BottomBar() {
  return (
    <NavigationMenu className="fixed bottom-0 w-full bg-white pt-2 pb-6 border-t border-gray-400">
      <NavigationMenuList>
        <NavigationMenuItem>
          <AddTransaction />
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
