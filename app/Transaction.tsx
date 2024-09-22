import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type Transaction = {
  id: number;
  name: string;
  price: number;
  category: string;
  date: string;
};

export default function Transaction({ data }: { data: Transaction }) {
  return (
    <div className="rounded-xl shadow shadow-gray-300 p-4 flex gap-4 items-center">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="text-xl font-semibold">{data.name}</h4>
        <p className="text-sm text-muted-foreground">Grocery</p>
        <p className="text-sm text-muted-foreground">15th March</p>
      </div>
      <div className="ml-auto">
        <h4 className="font-semibold text-xl">-₹ 200</h4>
      </div>
    </div>
  );
}
