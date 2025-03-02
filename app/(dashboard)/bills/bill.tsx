"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import BillModel from "@/models/bill";
import dayjs from "dayjs";
import Link from "next/link";

function BillComponent({ bill, ref }: { bill: BillModel; ref?: any }) {
  const billingDate = dayjs(bill?.billingDate);
  const expirationDate = billingDate.add(bill?.durationMonth, "month");
  const currentDate = dayjs();

  const daysUntilExpiration = expirationDate.diff(currentDate, "day");
  const daysExpired = currentDate.diff(expirationDate, "day");

  const expired = dayjs(bill?.billingDate)
    .add(bill?.durationMonth, "month")
    .isBefore(dayjs());
  if (!bill) return null;

  return (
    <Card className="min-w-[200px] flex-1 cart-bg hover p-0" ref={ref}>
      <div className="px-4 pt-2 w-full flex justify-between">
        <Link
          href={`/bills/${bill.id}`}
          className="font-semibold hover:underline"
        >
          {bill.device?.name || bill.device?.email}
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
          {dayjs(bill.billingDate)
            .add(bill.durationMonth, "month")
            .isBefore(dayjs())
            ? "Expired"
            : "On Going"}
        </p>
      </div>
      <CardContent className="p-4">
        <p>{bill.amount}</p>
        <p className="">{bill.serviceFee}</p>
        <p>Billing Date: {dayjs(bill.billingDate).format("YYYY-MM-DD")} </p>
        <p>Duration Month: {bill.durationMonth}</p>
        <p>
          Expired In:{" "}
          {dayjs(bill.billingDate)
            .add(bill.durationMonth, "month")
            .format("YYYY-MM-DD")}
        </p>
      </CardContent>
      <CardFooter className="p-4">
        <p>Created By: {bill.createdBy?.email}</p>
      </CardFooter>
    </Card>
  );
}

export default BillComponent;
