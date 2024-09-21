import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function Transaction() {
  return (
    <div className="rounded-xl shadow shadow-gray-300 p-4 flex gap-4 items-center">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="text-xl font-semibold">Milk and Bread</h4>
        <p className="text-sm text-muted-foreground">Grocery</p>
        <p className="text-sm text-muted-foreground">15th March</p>
      </div>
      {/*move this element to the right of the flex box*/}
      <div className="ml-auto">
        <h4 className="font-semibold text-xl">-₹ 200</h4>
      </div>
    </div>
  );
}
