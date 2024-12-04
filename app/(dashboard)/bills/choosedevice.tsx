"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import DeviceModel from "@/models/devices";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useInfiniteData } from "../../hooks/useInfiniteData";

function CreateNewBill({
  className,
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
  className?: string;
}) {
  const [search, setSearch] = useState("");
  const { data, loading, queryKey, lastElementRef } =
    useInfiniteData<DeviceModel>({
      keys: "devices",
      size: 20,
      params: { search },
    });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className={className}>
          <span className="px-2">Create New Bill</span>
          <CirclePlus className="w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 mx-2">
        <div className="flex flex-col max-h-[500px] overflow-y-auto p-2">
          <p className="font-semibold">Choose Device</p>
          {loading && (
            <>
              <Skeleton className="w-44 h-4" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-36 h-4" />
            </>
          )}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="my-2"
          />
          {data.map((device, index) => {
            return (
              <Link
                href={`/bills/create?deviceId=${device._id}`}
                className="p-2 hover"
                ref={index === data.length - 1 ? lastElementRef : null}
                key={index}
              >
                {device.name || device.email}
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default CreateNewBill;
