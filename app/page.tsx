import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex justify-between">
      <div>
        <p className="text-sm tracking-tight text-muted-foreground">
          Good Morning!
        </p>
        <h4 className="text-lg font-bold">Rishabh</h4>
      </div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
