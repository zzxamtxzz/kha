"use client";
import { useDetail } from "@/app/hooks/useDetail";
import ShowNoText from "@/components/app/nodata";
import Device from "@/models/devices";
import DeviceDetailsPage from "./device-detail";
import DeviceDetailsLoading from "./loading";
import { useEffect } from "react";
import { notFound } from "next/navigation";

function DeviceDetailClient({ id }: { id: string }) {
  const {
    isLoading,
    error,
    data: device,
  } = useDetail<Device>({
    id: id as string,
    title: "devices",
  });

  // Handle not found case
  useEffect(() => {
    if (!isLoading && !device) {
      notFound();
    }
  }, [isLoading, device]);

  // Handle error case
  if (error) {
    throw error; // This will be caught by the error boundary
  }
  if (isLoading || !device) return <DeviceDetailsLoading />;

  return <DeviceDetailsPage device={device} />;
}

export default DeviceDetailClient;
