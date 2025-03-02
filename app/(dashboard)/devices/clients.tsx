"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Client from "@/models/client";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useInfiniteData } from "../../hooks/useInfiniteData";

function FilterByClientBtn() {
  const [search, setSearch] = useState("");
  const {
    data: clients,
    loading,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<Client>({
    keys: "clients",
    size: 20,
    params: { search },
  });

  const searchParams = useSearchParams();
  const client_id = searchParams.get("client_id");
  const router = useRouter();

  const client = clients.find((c) => c.id.toString() == client_id);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("cart-bg hover justify-start text-left font-normal")}
        >
          <span className="pr-4">
            {client ? client.name || client.email : "Filter By"} Client
          </span>
          <ChevronsUpDown className="w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-1 flex flex-col gap-1">
        <Button
          variant={"outline"}
          className="justify-start"
          onClick={() => {
            const currentParams = new URLSearchParams(searchParams);
            currentParams.delete("client_id");
            router.push(`?${currentParams.toString()}`);
          }}
        >
          All
        </Button>
        {clients.map((client, index) => {
          const choose = client_id === client.id.toString();
          return (
            <Link
              href={`?client_id=${client.id}`}
              key={index}
              className="p-2 rounded-sm hover flex w-[150px] items-center justify-between"
            >
              <span>{client.name || client.email}</span>
              {choose && <Check className="w-4" />}
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export default FilterByClientBtn;
