"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Bill from "@/models/bill";
import dayjs from "dayjs";
import Link from "next/link";

function BillComponent({ bill, ref }: { bill: Bill; ref?: any }) {
  const billing_date = dayjs(bill?.billing_date);
  const expirationDate = billing_date.add(bill?.duration_month, "month");
  const currentDate = dayjs();

  const daysUntilExpiration = expirationDate.diff(currentDate, "day");
  const daysExpired = currentDate.diff(expirationDate, "day");

  const expired = dayjs(bill?.billing_date)
    .add(bill?.duration_month, "month")
    .isBefore(dayjs());
  if (!bill) return null;

  return (
    <Card className="min-w-[200px] flex-1 card-bg hover p-0" ref={ref}>
      <div className="px-4 pt-2 w-full">
        <Link
          href={`/workflows/bills/${bill.id}`}
          className="font-semibold hover:underline"
        >
          {bill.device?.email}
        </Link>{" "}
        {expired ? (
          <p className={cn("text-xs font-semibold", expired && "text-red-500")}>
            Expired {daysExpired} days ago
          </p>
        ) : (
          <p
            className={cn(
              "text-green-500",
              daysUntilExpiration < 15 && "text-red-500"
            )}
          >
            Expires in {daysUntilExpiration} days
          </p>
        )}
        <p>
          {dayjs(bill.billing_date)
            .add(bill.duration_month, "month")
            .isBefore(dayjs())
            ? "Expired"
            : "On Going"}
        </p>
      </div>
      <CardContent className="p-4">
        <p>{bill.amount}</p>
        <p className="">{bill.fee}</p>
        <p>Billing Date: {dayjs(bill.billing_date).format("YYYY-MM-DD")} </p>
        <p>Duration Month: {bill.duration_month}</p>
        <p>
          Expired In:{" "}
          {dayjs(bill.billing_date)
            .add(bill.duration_month, "month")
            .format("YYYY-MM-DD")}
        </p>
      </CardContent>
      <CardFooter className="p-4">
        <p>Created By: {bill.created_by?.name || bill.created_by?.username}</p>
      </CardFooter>
    </Card>
  );
}

export default BillComponent;
