import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Client from "@/models/client";
import { Users, Smartphone, AlertCircle, CheckCircle } from "lucide-react";

export function CustomerStats({ customers }: { customers: Client[] }) {
  // Calculate statistics
  const totalCustomers = customers.length;
  const totalDevices = customers.reduce(
    (acc, customer) => acc + customer.devices.length,
    0
  );
  const pendingCustomers = customers.filter((c) =>
    c.remark?.includes("PENDING")
  ).length;
  const activeCustomers = totalCustomers - pendingCustomers;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((totalCustomers / 10) * 100)}% of target
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDevices}</div>
          <p className="text-xs text-muted-foreground">
            {(totalDevices / totalCustomers).toFixed(1)} devices per customer
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Customers
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCustomers}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((activeCustomers / totalCustomers) * 100)}% of total
            customers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Customers
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCustomers}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((pendingCustomers / totalCustomers) * 100)}% of total
            customers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
