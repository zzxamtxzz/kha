"use client";

import { Input } from "@/components/ui/input";
import TrashModel from "@/models/trashes";
import { useState } from "react";
import { useInfiniteData } from "../../../hooks/useInfiniteData";
import ClientTrashItem from "./item";

function TrashesClients() {
  const [search, setSearch] = useState("");
  const { data, loading, queryKey, lastElementRef, count } =
    useInfiniteData<TrashModel>({
      keys: "trashes/clients",
      size: 20,
      params: { search, trashes: true },
    });

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
            <ClientTrashItem queryKey={queryKey} trash={trash} key={index} />
          );
        })}
      </div>
    </div>
  );
}

export default TrashesClients;
