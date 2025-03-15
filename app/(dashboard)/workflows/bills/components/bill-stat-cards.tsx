import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Bill from "@/models/bill";
import {
    AlertCircleIcon,
    CheckCircleIcon,
    ClockIcon,
    DollarSignIcon,
} from "lucide-react";

interface BillStatCardsProps {
  bills: Bill[];
  isLoading: boolean;
}

export function BillStatCards({ bills, isLoading }: BillStatCardsProps) {
  // Format the amount with commas and 2 decimal places
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total amount
  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

  // Count bills by status group
  const newBills = bills.filter((bill) => bill.status.group === "new").length;
  const inProgressBills = bills.filter(
    (bill) => bill.status.group === "in_progress"
  ).length;
  const pendingBills = bills.filter(
    (bill) => bill.status.group === "pending"
  ).length;
  const closedBills = bills.filter(
    (bill) => bill.status.group === "closed"
  ).length;

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-28 mb-1" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Billing</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatAmount(totalAmount)}</div>
          <p className="text-xs text-muted-foreground">
            From {bills.length} bills
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Bills</CardTitle>
          <AlertCircleIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newBills}</div>
          <p className="text-xs text-muted-foreground">
            {((newBills / bills.length) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          <ClockIcon className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {inProgressBills + pendingBills}
          </div>
          <p className="text-xs text-muted-foreground">
            {(((inProgressBills + pendingBills) / bills.length) * 100).toFixed(
              1
            )}
            % of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Closed Bills</CardTitle>
          <CheckCircleIcon className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{closedBills}</div>
          <p className="text-xs text-muted-foreground">
            {((closedBills / bills.length) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
