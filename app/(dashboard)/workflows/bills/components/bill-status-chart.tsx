"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Bill from "@/models/bill";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface BillStatusChartProps {
  bills: Bill[];
  isLoading: boolean;
  fullSize?: boolean;
}

export function BillStatusChart({
  bills,
  isLoading,
  fullSize = false,
}: BillStatusChartProps) {
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

  // Group bills by status
  const statusGroups = bills.reduce((acc, bill) => {
    const group = bill.status?.group || "";
    const name = bill.status?.name || "";

    if (!acc[group]) {
      acc[group] = {
        name,
        group,
        value: 0,
        amount: 0,
      };
    }

    acc[group].value += 1;
    acc[group].amount += bill.amount;

    return acc;
  }, {} as Record<string, { name: string; group: string; value: number; amount: number }>);

  const chartData = Object.values(statusGroups);

  // Colors for different status groups
  const COLORS = {
    new: "#3b82f6", // blue
    in_progress: "#eab308", // yellow
    pending: "#8b5cf6", // purple
    closed: "#22c55e", // green
    default: "#94a3b8", // slate
  };

  const getColor = (group: string) => {
    return COLORS[group as keyof typeof COLORS] || COLORS.default;
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
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.group)} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value} bills`,
              props.payload.name,
            ]}
            contentStyle={{
              borderRadius: "0.375rem",
              border: "1px solid #e2e8f0",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
