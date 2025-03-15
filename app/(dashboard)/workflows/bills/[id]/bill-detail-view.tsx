"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Bill from "@/models/bill";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Globe,
  Info,
  Laptop,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BillActionButtons } from "./bill-action-buttons";
import { BillHistoryTimeline } from "../components/bill-history-timeline";
import { BillStatusBadge } from "../components/bill-status-badge";

interface BillDetailViewProps {
  bill: Bill;
}

export function BillDetailView({ bill }: BillDetailViewProps) {
  const router = useRouter();

  // In a real application, you would fetch this data from an API
  // For this example, we'll use the provided bill data

  // Format dates for display
  const formattedBillingDate = format(new Date(bill.billing_date), "PPP");
  const formattedCreatedDate = format(new Date(bill.created_at), "PPP p");
  const formattedUpdatedDate = format(new Date(bill.updated_at), "PPP p");

  return (
    <div className="container max-w-[1000px] space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bill #{bill.id.slice(-8)}
          </h1>
          <p className="text-muted-foreground">View and manage bill details</p>
        </div>
        <BillActionButtons bill={bill} />
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center w-full">
            <CardTitle>Bill Summary</CardTitle>
            <BillStatusBadge status={bill.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Amount
              </p>
              <p className="text-xl font-semibold flex items-center">
                <DollarSign className="h-5 w-5 mr-1 text-primary" />
                {bill.amount} {bill.currency?.symbol}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Billing Date
              </p>
              <p className="text-xl font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-1 text-primary" />
                {formattedBillingDate}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Duration
              </p>
              <p className="text-xl font-semibold flex items-center">
                <Clock className="h-5 w-5 mr-1 text-primary" />
                {bill.duration_month}{" "}
                {bill.duration_month === 1 ? "Month" : "Months"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="device">Device</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Plan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Plan Name
                  </p>
                  <p className="text-base">{bill.plan?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Plan Fee
                  </p>
                  <p className="text-base">
                    {bill.plan?.fee} {bill.currency?.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Admin Amount
                  </p>
                  <p className="text-base">
                    {bill.plan?.admin_amount ? bill.plan.admin_amount : "N/A"}{" "}
                    {bill.currency?.symbol}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Duration
                  </p>
                  <p className="text-base">
                    {bill.plan?.duration_month}{" "}
                    {bill.plan?.duration_month === 1 ? "Month" : "Months"}
                  </p>
                </div>
              </div>
              {bill.plan?.remark && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Remarks
                    </p>
                    <p className="text-base">{bill.plan?.remark}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Branch Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Branch Name
                  </p>
                  <p className="text-base">{bill.branch?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Branch ID
                  </p>
                  <p className="text-base">{bill.branch?.id}</p>
                </div>
              </div>
              {bill.branch?.remark && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Remarks
                    </p>
                    <p className="text-base">{bill.branch?.remark}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created By
                  </p>
                  <p className="text-base">
                    {bill.created_by?.name || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Created At
                  </p>
                  <p className="text-base">{formattedCreatedDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </p>
                  <p className="text-base">{formattedUpdatedDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Visibility
                  </p>
                  <p className="text-base flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {bill.is_public ? "Public" : "Private"}
                  </p>
                </div>
              </div>
              {bill.remark && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Remarks
                    </p>
                    <p className="text-base">{bill.remark}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="device" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Laptop className="h-5 w-5 mr-2" />
                Device Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer Name
                  </p>
                  <p className="text-base">
                    {bill.device.first_name} {bill.device.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-base">{bill.device.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Serial Number
                  </p>
                  <p className="text-base">{bill.device.snNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Account Number
                  </p>
                  <p className="text-base">{bill.device.accNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Kit Number
                  </p>
                  <p className="text-base">{bill.device.kitNo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Reference
                  </p>
                  <p className="text-base">{bill.device.ref || "N/A"}</p>
                </div>
              </div>
              {bill.device.remark && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Remarks
                    </p>
                    <p className="text-base">{bill.device.remark}</p>
                  </div>
                </>
              )}
              <div className="pt-4">
                <Link href={`/workflows/devices/${bill.device.id}`}>
                  <Button variant="outline">
                    <Laptop className="mr-2 h-4 w-4" />
                    View Device Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bill History</CardTitle>
            </CardHeader>
            <CardContent>
              <BillHistoryTimeline bill={bill} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
