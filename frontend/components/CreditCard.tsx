import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IndianRupee, PiggyBank } from "lucide-react";

export default function CreditCard() {
  return (
    <Card className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white">
      <CardHeader>
        <CardTitle className="flex text-3xl">
          <IndianRupee /> 5480.00
        </CardTitle>
        <CardDescription>Balance</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={50} />
      </CardContent>
      <CardFooter className="mt-4 text-xl justify-between items-center">
        <p>**** **** **** 1234</p>
        <PiggyBank className="h-8 w-8 text-yellow-500" />
      </CardFooter>
    </Card>
  );
}
