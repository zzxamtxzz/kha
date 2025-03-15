import Bill from "@/models/bill";
import { DollarSignIcon } from "lucide-react";
import { BillCardSkeleton } from "./bill-card-skeleton";
import { BillCardView } from "./bill-card-view";

interface BillCardViewWithLoadingProps {
  bills?: Bill[];
  isLoading: boolean;
}

export function BillCardViewWithLoading({
  bills,
  isLoading,
}: BillCardViewWithLoadingProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <BillCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!bills || bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <DollarSignIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No Bills Found</h3>
        <p className="text-muted-foreground mt-1">
          There are no bills to display at the moment.
        </p>
      </div>
    );
  }

  return <BillCardView bills={bills} />;
}
