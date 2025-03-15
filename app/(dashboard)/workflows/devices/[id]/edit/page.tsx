"use client";

import { useDetail } from "@/app/hooks/useDetail";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Device from "@/models/devices";
import { notFound } from "next/navigation";
import CreateDeviceForm from "../../create/form";

export default function EditDevicePage({ params }: { params: { id: string } }) {
  const { isLoading, data: device } = useDetail<Device>({
    id: params.id,
    title: "devices",
  });

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex flex-col space-y-2 mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-80" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-80" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-5 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-80" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="flex justify-between w-full">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!device) return notFound();

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Page header */}
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Device</h1>
        <p className="text-muted-foreground">Update device information</p>
      </div>
      <CreateDeviceForm defaultValues={device} />
    </div>
  );
}
