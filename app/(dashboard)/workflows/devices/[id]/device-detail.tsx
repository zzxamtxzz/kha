"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Device from "@/models/devices";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  Barcode,
  Calendar,
  CheckCircle,
  ChevronRight,
  Cpu,
  Edit,
  ExternalLink,
  FileText,
  Hash,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeviceDetailsPage({
  device: deviceData,
}: {
  device: Device;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Function to determine if a device is active based on lastBill
  const isDeviceActive = () => {
    const lastBill = deviceData.bills[deviceData.bills.length - 1];
    if (!lastBill) return false;

    const billDate = new Date(lastBill.billing_date);
    const durationInMs = lastBill.duration_month * 30 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date(billDate.getTime() + durationInMs);

    return expiryDate > new Date();
  };

  // Get initials for avatar
  const getInitials = () => {
    return `${deviceData.first_name.charAt(0)}${deviceData.last_name.charAt(
      0
    )}`.toUpperCase();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge color
  const getStatusBadge = () => {
    if (deviceData.remark) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          {deviceData.remark}
        </Badge>
      );
    }

    return isDeviceActive() ? (
      <Badge variant="outline" className="bg-green-100 text-green-800">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-100 text-red-800">
        Inactive
      </Badge>
    );
  };

  // Sort bills by date (newest first)
  const sortedBills = [...(deviceData?.bills || [])].sort(
    (a, b) =>
      new Date(b.billing_date).getTime() - new Date(a.billing_date).getTime()
  );

  return (
    <div className="container mx-auto py-4 px-2 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            aria-label="Back to devices"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {deviceData.first_name} {deviceData.last_name}
            </h1>
            <p className="text-muted-foreground flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              {deviceData.email}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link
              href={`/workflows/devices/${deviceData.id}/edit`}
              className="h-9"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Device
            </Link>
          </Button>
          <Button>
            <ReceiptText className="h-4 w-4 mr-2" />
            Create Bill
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-primary/10 text-primary">
                <AvatarFallback className="text-lg">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold">
                    {deviceData.first_name} {deviceData.last_name}
                  </h2>
                  {getStatusBadge()}
                </div>

                <div className="flex flex-col sm:flex-row gap-x-6 gap-y-1 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Barcode className="h-4 w-4 mr-1" />
                    <span>{deviceData.snNo}</span>
                  </div>

                  <div className="flex items-center text-muted-foreground">
                    <Cpu className="h-4 w-4 mr-1" />
                    <span>{deviceData.accNo}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="bg-muted rounded-md p-3 min-w-[120px]">
                <div className="text-muted-foreground text-xs mb-1 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Created
                </div>
                <div className="font-medium">
                  {format(new Date(deviceData.created_at), "MMM d, yyyy")}
                </div>
              </div>

              <div className="bg-muted rounded-md p-3 min-w-[120px]">
                <div className="text-muted-foreground text-xs mb-1 flex items-center">
                  <ReceiptText className="h-3 w-3 mr-1" />
                  Last Billed
                </div>
                <div className="font-medium">
                  {deviceData.bills.length > 0
                    ? format(
                        new Date(sortedBills[0].billing_date),
                        "MMM d, yyyy"
                      )
                    : "Never"}
                </div>
              </div>

              <div className="bg-muted rounded-md p-3 min-w-[120px]">
                <div className="text-muted-foreground text-xs mb-1 flex items-center">
                  {isDeviceActive() ? (
                    <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 mr-1 text-red-600" />
                  )}
                  Status
                </div>
                <div className="font-medium">
                  {isDeviceActive() ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        defaultValue="overview"
        className="mb-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="client">Client</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Barcode className="h-4 w-4 mr-2" />
                      Serial Number
                    </h3>
                    <p className="font-medium">{deviceData.snNo}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <Hash className="h-4 w-4 mr-2" />
                      Kit Number
                    </h3>
                    <p className="font-medium">{deviceData.kitNo}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <Cpu className="h-4 w-4 mr-2" />
                    Account Number
                  </h3>
                  <p className="font-medium">{deviceData.accNo}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </h3>
                  <p className="font-medium">{deviceData.email}</p>
                </div>

                {deviceData.ref && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Reference
                    </h3>
                    <p className="font-medium">{deviceData.ref}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Created By
                  </h3>
                  <p className="font-medium">
                    {deviceData.created_by.name} on{" "}
                    {format(new Date(deviceData.created_at), "PPP")}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last Updated
                  </h3>
                  <p className="font-medium">
                    {format(new Date(deviceData.updated_at), "PPP")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                {deviceData.client && (
                  <CardDescription>
                    Associated with{" "}
                    {deviceData.client.name || deviceData.client.email}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {deviceData.client ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Name
                      </h3>
                      <p className="font-medium">
                        {deviceData.client.name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </h3>
                      <p className="font-medium">{deviceData.client.email}</p>
                    </div>

                    {deviceData.client.phone_number && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          Phone
                        </h3>
                        <p className="font-medium">
                          {deviceData.client.phone_number}
                        </p>
                      </div>
                    )}

                    {deviceData.client.address && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Address
                        </h3>
                        <p className="font-medium">
                          {deviceData.client.address}
                        </p>
                      </div>
                    )}

                    {deviceData.client.remark && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Remark
                        </h3>
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          {deviceData.client.remark}
                        </Badge>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Client Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <h3 className="font-medium mb-1">No Client Associated</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This device is not linked to any client.
                    </p>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Link to Client
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Billing Card */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Billing</CardTitle>
                  <CardDescription>
                    Last {Math.min(3, deviceData.bills.length)} billing records
                  </CardDescription>
                </div>
                {activeTab === "overview" && deviceData.bills.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("billing")}
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {deviceData.bills.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedBills.slice(0, 3).map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell>
                            {format(new Date(bill.billing_date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            {bill.duration_month} month
                            {bill.duration_month !== 1 ? "s" : ""}
                          </TableCell>
                          <TableCell>{formatCurrency(bill.amount)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {bill.status_id === "553905483434392"
                                ? "Paid"
                                : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <ReceiptText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <h3 className="font-medium mb-1">No Billing History</h3>
                    <p className="text-sm text-muted-foreground">
                      This device has no billing records yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing History Tab */}
        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                Complete billing history for this device
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deviceData.bills.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remark</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-mono text-xs">
                          {bill.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {format(new Date(bill.billing_date), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {bill.duration_month} month
                          {bill.duration_month !== 1 ? "s" : ""}
                        </TableCell>
                        <TableCell>{formatCurrency(bill.amount)}</TableCell>
                        <TableCell>{formatCurrency(bill.fee)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {bill.status_id === "553905483434392"
                              ? "Paid"
                              : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>{bill.remark || "-"}</TableCell>
                        <TableCell>
                          {format(new Date(bill.created_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <ReceiptText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">No Billing History</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This device has no billing records yet.
                  </p>
                  <Button>
                    <ReceiptText className="h-4 w-4 mr-2" />
                    Create New Bill
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Total: {deviceData.bills.length} records
              </div>
              {deviceData.bills.length > 0 && (
                <Button>
                  <ReceiptText className="h-4 w-4 mr-2" />
                  Create New Bill
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Client Tab */}
        <TabsContent value="client" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
              {deviceData.client && (
                <CardDescription>
                  Information about the associated client
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {deviceData.client ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 bg-primary/10 text-primary">
                      <AvatarFallback>
                        {deviceData.client.name
                          ? deviceData.client.name.substring(0, 2).toUpperCase()
                          : "AA"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h2 className="text-xl font-semibold">
                        {deviceData.client.name || "Unnamed Client"}
                      </h2>
                      <p className="text-muted-foreground flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {deviceData.client.email}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Contact Information
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{deviceData.client.email}</span>
                          </div>

                          {deviceData.client.phone_number ? (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{deviceData.client.phone_number}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-muted-foreground">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>No phone number provided</span>
                            </div>
                          )}

                          {deviceData.client.address ? (
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                              <span>{deviceData.client.address}</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>No address provided</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Status
                        </h3>
                        {deviceData.client.remark ? (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            {deviceData.client.remark}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Active</Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Account Information
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              Created:{" "}
                              {format(
                                new Date(deviceData.client.created_at),
                                "PPP"
                              )}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              Last Updated:{" "}
                              {format(
                                new Date(deviceData.client.updated_at),
                                "PPP"
                              )}
                            </span>
                          </div>

                          {deviceData.client.ref && (
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Reference: {deviceData.client.ref}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Associated Devices
                        </h3>
                        <div className="flex items-center">
                          <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>1 device associated with this client</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      View All Client Devices
                    </Button>
                    <Button>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Go to Client Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium mb-1">No Client Associated</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This device is not linked to any client.
                  </p>
                  <Button>
                    <User className="h-4 w-4 mr-2" />
                    Link to Client
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
