"use client";
import { Button } from "@/components/ui/button";
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
  return (
    <section className="py-4 px-2">
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
    </section>
  );
}
