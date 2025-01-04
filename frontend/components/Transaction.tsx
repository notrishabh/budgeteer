import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { TTransaction } from "@/types/types";
import Link from "next/link";

export default function Transaction({ data }: { data: TTransaction }) {
  return (
    <Link
      href={`/transactions/${data.id}`}
      className="rounded-xl shadow shadow-gray-300 p-2 flex gap-4 items-center"
    >
      <div className="flex flex-col items-center text-muted-foreground font-semibold">
        <p>{formatDate(data.created_at).month}</p>
        <p>{formatDate(data.created_at).day}</p>
      </div>
      <Avatar className="rounded-xl">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex justify-between w-full">
        <div>
          <h4 className="text-lg leading-6 font-semibold">{data.name}</h4>
          <p className="text-sm text-muted-foreground">{data.category.name}</p>
        </div>
        <h4 className="font-semibold text-xl text-orange-600">
          -₹ {data.price}
        </h4>
      </div>
    </Link>
  );
}
