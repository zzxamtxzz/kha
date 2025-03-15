"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Bill from "@/models/bill";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface BillMonthlyChartProps {
  bills: Bill[];
  isLoading: boolean;
  fullSize?: boolean;
}

export function BillMonthlyChart({
  bills,
  isLoading,
  fullSize = false,
}: BillMonthlyChartProps) {
  if (isLoading) {
    return (
      <div
        className={`w-full ${
          fullSize ? "h-full" : "h-64"
        } flex items-center justify-center`}
      >
        <Skeleton className="h-full w-full rounded-md" />
      </div>
    );
  }

  // Group bills by month
  const monthlyData = bills.reduce((acc, bill) => {
    const date = new Date(bill.billing_date);
    const monthYear = `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;

    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: monthYear,
        total: 0,
        count: 0,
      };
    }

    acc[monthYear].total += bill.amount;
    acc[monthYear].count += 1;

    return acc;
  }, {} as Record<string, { month: string; total: number; count: number }>);

  // Convert to array and sort by date
  const chartData = Object.values(monthlyData).sort((a, b) => {
    const [aMonth, aYear] = a.month.split(" ");
    const [bMonth, bYear] = b.month.split(" ");

    const aDate = new Date(`${aMonth} 1, ${aYear}`);
    const bDate = new Date(`${bMonth} 1, ${bYear}`);

    return aDate.getTime() - bDate.getTime();
  });

  // Format the amount for tooltip
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (chartData.length === 0) {
    return (
      <div
        className={`w-full ${
          fullSize ? "h-full" : "h-64"
        } flex items-center justify-center`}
      >
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${fullSize ? "h-full" : "h-64"}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => [formatAmount(value as number), "Amount"]}
            contentStyle={{
              borderRadius: "0.375rem",
              border: "1px solid #e2e8f0",
            }}
          />
          <Legend />
          <Bar dataKey="total" name="Total Amount" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
