"use client";

import { useViewMode } from "@/app/contexts/state";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Device from "@/models/devices";
import {
  CheckCircle,
  Clock,
  Download,
  Plus,
  ReceiptText,
  Upload,
  Wifi,
} from "lucide-react";
import { useState } from "react";
import DeviceCardView from "./components/devices-card-view";
import { DeviceCardSkeletons } from "./components/device-card-skeletons";
import { ImprovedFilterSection } from "./components/filter-section";
import DevicesClientTable from "./table";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DeviceDashboard({
  saveColumns: sc,
}: {
  saveColumns: string;
}) {
  const saveColumns = JSON.parse(sc);
  const [search, setSearch] = useState("");
  const [expired, setExpired] = useState("");
  const [client, setClient] = useState("");
  const [branch, setBranch] = useState("");

  const { state } = useViewMode();

  const {
    data: devices,
    loading,
    queryKey,
    lastElementRef,
    count = 0,
    isFetchingNextPage,
  } = useInfiniteData<Device>({
    keys: "devices",
    size: 20,
    params: {
      search,
      expired: expired === "-" ? undefined : expired,
      client,
      branch,
    },
  });

  // Calculate statistics
  const totalDevices = count || 0;
  const activeDevices = devices.filter((device) => {
    if (!device.lastBill) return false;

    const billDate = new Date(device.lastBill.billing_date);
    const durationInMs =
      device.lastBill.duration_month * 30 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date(billDate.getTime() + durationInMs);

    return expiryDate > new Date();
  }).length;
  const inactiveDevices = totalDevices - activeDevices;
  const billedDevices = devices.filter(
    (device) => device.lastBill !== null
  ).length;

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setExpired("-");
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Device Management
            </h1>
            <p className="text-muted-foreground">
              View and manage your device inventory
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Export Devices
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Upload className="h-4 w-4 mr-2" />
              Import Devices
            </Button>
            <Button size="sm" className="h-9" asChild>
              <Link href="/workflows/devices/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Device
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-[120px] rounded-md border bg-card text-card-foreground shadow-sm"
              >
                <div className="p-6 flex flex-col space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Devices
              </CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDevices}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((totalDevices / 20) * 100)}% of capacity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Devices
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDevices}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((activeDevices / totalDevices) * 100)}% of total
                devices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inactive Devices
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inactiveDevices}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((inactiveDevices / totalDevices) * 100)}% of total
                devices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Billed Devices
              </CardTitle>
              <ReceiptText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{billedDevices}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((billedDevices / totalDevices) * 100)}% of total
                devices
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <ImprovedFilterSection
        search={search}
        setSearch={setSearch}
        expired={expired}
        setExpired={setExpired}
        client={client}
        setClient={setClient}
        branch={branch}
        setBranch={setBranch}
        loading={loading}
        resetFilters={resetFilters}
        onSearch={() => {}}
      />

      {state === "card" ? (
        loading ? (
          <DeviceCardSkeletons />
        ) : (
          <DeviceCardView
            lastElementRef={lastElementRef}
            isFetchingNextPage={isFetchingNextPage}
            devices={devices}
          />
        )
      ) : (
        <DevicesClientTable
          lastElementRef={lastElementRef}
          loading={loading}
          devices={JSON.stringify(devices)}
          saveColumns={saveColumns}
          queryKey={queryKey}
        />
      )}
    </div>
  );
}
