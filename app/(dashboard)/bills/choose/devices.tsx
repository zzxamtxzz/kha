import { useSheet } from "@/app/contexts/sheet";
import { useInfiniteData } from "@/app/hooks/useInfiniteData";
import ShowNoText from "@/components/app/nodata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Device from "@/models/devices";
import Link from "next/link";
import { useState } from "react";
import CreateBill from "../create/page";
import CreateDevice from "../../devices/create/page";
import CreateDeviceClient from "../../devices/create/form";

function Devices() {
  const [search, setSearch] = useState("");
  const { data, loading, queryKey, lastElementRef } = useInfiniteData<Device>({
    keys: "devices",
    size: 20,
    params: { search },
  });

  const { setOpen, setContent, closeSheet, setClassName } = useSheet();
  return (
    <div className="flex flex-col max-h-[500px] overflow-y-auto p-2">
      <p className="font-semibold">Choose Device</p>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="my-2"
      />
      {loading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="w-44 h-4" />
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-36 h-4" />
        </div>
      )}
      {!loading && !data.length && <ShowNoText>Nothing found</ShowNoText>}
      {!loading && !data.length && (
        <Button
          onClick={() => {
            setOpen(true);
            setClassName("min-w-[700px]");
            setContent(
              <CreateDeviceClient
                defaultValues={{ email: search }}
                onSuccess={closeSheet}
              />
            );
          }}
        >
          + Device
        </Button>
      )}
      {data.map((device, index) => {
        if (!device) return null;
        return (
          <Link
            href={`/bills/create?device_id=${device.id}`}
            className="p-2 hover"
            ref={index === data.length - 1 ? lastElementRef : null}
            key={index}
          >
            {device.client?.name || device.email}
          </Link>
        );
      })}
    </div>
  );
}

export default Devices;
