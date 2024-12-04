"use client";

import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import TrashModel from "@/models/trashes";
import { useState } from "react";
import { useInfiniteData } from "../../../hooks/useInfiniteData";
import DeviceTrashItem from "./item";

function TrashesClients() {
  const [search, setSearch] = useState("");
  const { data, loading, queryKey, lastElementRef, count } =
    useInfiniteData<TrashModel>({
      keys: "trashes/devices",
      size: 20,
      params: { search, trashes: true },
    });

  const { toast } = useToast();

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between p-2">
        <p className="font-semibold">Trashes Clients</p>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-[250px]"
        />
      </div>
      <div className="flex flex-col gap-2 h-full overflow-y-auto">
        {data.map((trash, index) => {
          return (
            <DeviceTrashItem queryKey={queryKey} key={index} trash={trash} />
          );
        })}
      </div>
    </div>
  );
}

export default TrashesClients;
