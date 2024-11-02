"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { TTransaction } from "@/types/types";
import Transaction from "../components/Transaction";

export default function TransactionInfo() {
  const { data, isLoading } = useQuery<TTransaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8080/expenses", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    },
  });
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="rounded-xl h-24 w-full" />
        <Skeleton className="rounded-xl h-24 w-full" />
        <Skeleton className="rounded-xl h-24 w-full" />
        <Skeleton className="rounded-xl h-24 w-full" />
      </div>
    );
  } else {
    return (
      <div className="space-y-4">
        {data ? (
          data.map((transaction: TTransaction) => (
            <Transaction key={transaction.id} data={transaction} />
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    );
  }
}
