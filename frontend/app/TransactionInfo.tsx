"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { TTransaction } from "@/types/types";
import Transaction from "../components/Transaction";
import { useState } from "react";

export default function TransactionInfo() {
  const { data, isLoading } = useQuery<TTransaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await fetch("/api/expenses", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    },
  });
  const [lastMonth, setLastMonth] = useState<string>("");
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
            <>
              {(lastMonth === "" || lastMonth != "Nov") && (
                <LastMonthHeading
                  lastMonth={lastMonth}
                  setLastMonth={setLastMonth}
                  txnMonth={"Nov"}
                />
              )}
              <Transaction key={transaction.id} data={transaction} />
            </>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    );
  }
}

const LastMonthHeading = ({
  lastMonth,
  txnMonth,
  setLastMonth,
}: {
  lastMonth: string;
  txnMonth: string;
  setLastMonth: (arg0: string) => void;
}) => {
  setLastMonth(txnMonth);
  return <p>{lastMonth}</p>;
};
