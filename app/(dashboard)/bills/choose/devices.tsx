import { useSheet } from "@/app/contexts/sheet";
import { useInfiniteData } from "@/app/hooks/useInfiniteData";
import ShowNoText from "@/components/app/nodata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Device from "@/models/devices";
import { useState } from "react";
import CreateDeviceClient from "../../devices/create/form";
import CreateBillClient from "../create/client";
import CreateBill from "../create/page";

function Devices() {
  const [search, setSearch] = useState("");
  const [device, setDevice] = useState<Device | null>(null);
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
          <Skeleton className="w-44 h-6" />
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-36 h-6" />
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
                onSuccess={(device) => {
                  closeSheet();
                  if (device) {
                    setOpen(true);
                    setClassName("min-w-[700px]");
                    setContent(
                      <CreateBillClient
                        onSuccess={closeSheet}
                        device={device}
                      />
                    );
                  }
                }}
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
          <div
            onClick={() => {
              setOpen(true);
              setClassName("min-w-[700px]");
              setContent(
                <CreateBillClient onSuccess={closeSheet} device={device} />
              );
            }}
            className="p-2 hover"
            ref={index === data.length - 1 ? lastElementRef : null}
            key={index}
          >
            {device.client?.name || device.email}
          </div>
        );
      })}
    </div>
  );
}

export default Devices;
