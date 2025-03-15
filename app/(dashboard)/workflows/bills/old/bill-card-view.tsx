import Bill from "@/models/bill";
import { BillCard } from "./bill-card";

interface BillCardViewProps {
  bills: Bill[];
}

export function BillCardView({ bills }: BillCardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bills.map((bill) => (
        <BillCard key={bill.id} bill={bill} />
      ))}
    </div>
  );
}
