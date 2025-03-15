import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  UserIcon,
  BuildingIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Bill from "@/models/bill";

interface BillCardProps {
  bill: Bill;
}

export function BillCard({ bill }: BillCardProps) {
  // Format the amount with commas and 2 decimal places
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status color based on status group
  const getStatusColor = (group: string) => {
    switch (group) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "pending":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "closed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Format the date to a readable format
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get time ago
  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              className={cn("font-medium", getStatusColor(bill.status.group))}
            >
              {bill.status.name}
            </Badge>
            {bill.plan && (
              <Badge variant="outline" className="font-normal">
                {bill.plan.name}
              </Badge>
            )}
          </div>
          <Link href={`/workflows/bills/${bill.id}`} className="hover:underline">
            <h3 className="text-lg font-semibold">
              {bill.device.first_name} {bill.device.last_name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{bill.device.email}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary">
            {formatAmount(bill.amount)} {bill.currency?.symbol || bill.plan?.currency?.symbol}
          </p>
          {bill.fee !== bill.amount && (
            <p className="text-sm text-muted-foreground">
              Fee: {formatAmount(bill.fee)}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3 flex-1">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>Billing: {formatDate(bill.billing_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              Duration: {bill.duration_month} month
              {bill.duration_month !== 1 ? "s" : ""}
            </span>
          </div>
          {bill.device.accNo && (
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
              <span>Acc: {bill.device.accNo}</span>
            </div>
          )}
          {bill.device.snNo && (
            <div className="flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
              <span>SN: {bill.device.snNo}</span>
            </div>
          )}
        </div>

        {bill.remark && (
          <div className="mt-3 p-2 bg-muted rounded-md text-sm">
            <p className="text-muted-foreground">{bill.remark}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="py-2 px-4 flex justify-between text-xs text-muted-foreground border-t mt-2">
        <div className="flex items-center gap-2">
          <UserIcon className="h-3.5 w-3.5" />
          <span>{bill.created_by ? bill.created_by.name : "System"}</span>
        </div>
        <div className="flex items-center gap-2">
          <BuildingIcon className="h-3.5 w-3.5" />
          <span>{bill.branch ? bill.branch.name : "N/A"}</span>
        </div>
        <div>{getTimeAgo(bill.created_at)}</div>
      </CardFooter>
    </Card>
  );
}
