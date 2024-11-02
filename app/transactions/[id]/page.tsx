"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { TTransaction } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TransactionDetails({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  const { data, isLoading } = useQuery<TTransaction>({
    queryKey: ["transactions-details", params.id],
    queryFn: async () => {
      const response = await fetch(
        "http://localhost:8080/expenses/" + params.id,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.json();
    },
  });
  return (
    <section className="py-4 px-2 space-y-4">
      <div className="flex justify-between items-center">
        <Button size="icon" variant="ghost" onClick={handleGoBack}>
          <ChevronLeft />
        </Button>
        Details
        <div>
          <Button size="icon" variant="ghost" onClick={handleGoBack}>
            <Trash2 />
          </Button>
        </div>
      </div>
      {isLoading || !data ? (
        <Skeleton className="rounded-xl h-24 w-full" />
      ) : (
        <section className="px-2">
          <div className="flex gap-4">
            <Avatar className="rounded-xl">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex w-full justify-between">
              <div>
                <h4 className="text-lg leading-6 font-semibold">{data.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {data.category.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Added on {formatDate(data.created_at).date}
                </p>
              </div>
              <h4 className="font-semibold text-xl text-orange-600">
                -₹ {data.price}
              </h4>
            </div>
          </div>
        </section>
      )}
      <RenderAlertDialog />
    </section>
  );
}

const RenderAlertDialog = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent className="w-5/6 rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            transaction.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
