"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { DeviceDetailMenubar } from "./menu";

function ClientDetailHeader() {
  const { id } = useParams();
  const router = useRouter();
  return (
    <div className="flex items-center justify-between w-full">
      <Button
        variant={"outline"}
        onClick={() => router.back()}
        type="reset"
        className="w-8 h-8 rounded-full p-0 left-1 top-0"
      >
        <ArrowLeft className="w-4" />
      </Button>
      <p className="font-bold text-lg text-center">Device Detail</p>
      <DeviceDetailMenubar data={id as string} title="devices" />
    </div>
  );
}

export default ClientDetailHeader;
