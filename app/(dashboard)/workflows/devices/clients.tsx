"use client";
import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Client from "@/models/client";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import CreateClientForm from "../clients/create/form";

function ChooseClient({
  client: c,
  onChange,
}: {
  client?: Client;
  onChange: (value: Client) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState<Client | undefined>(c);
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

  const router = useRouter();
  const searchParams = useSearchParams();

  const { updateData } = useMutateInfiniteData();

  const openClient = () => {
    setOpen(true);
  };


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "card-bg hover justify-start text-left font-normal justify-between",
            (search || client?.id) && "border-green-500"
          )}
        >
          <span className="pr-4">
            {client
              ? client.name ||
                (client.email && client.email.substring(0, 10) + "...")
              : "Filter client"}
          </span>
          <ChevronsUpDown className="w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-1 flex flex-col gap-1">
        <div className="flex items-center justify-between w-full">
          <input
            value={search}
            placeholder="Search"
            className="p-2 border-b w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
          {(search || client?.id) && (
            <Button
              onClick={() => {
                setSearch("");
                const currentParams = new URLSearchParams(searchParams);
                currentParams.delete("client_id");
                router.push(`?${currentParams.toString()}`);
                setClient(undefined);
              }}
              variant={"outline"}
              className="absolute right-1 border-none shadow-none mr-1 bg-transparent hover:bg-transparent"
              size={"icon"}
            >
              <Trash2 className="w-4 text-red-500" />
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
          {loading && <SpinLoading />}
          {!loading && !clients.length && (
            <ShowNoText className="flex flex-col gap-2">
              Nothing found{" "}
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent className="min-w-[600px]">
                  <CreateClientForm
                    onSuccess={(client) => {
                      setOpen(false);
                      console.log("client", client);

                      if (client) {
                        updateData({ ...client, queryKey, new: true });
                        router.push(`?client_id=${client.id}`);
                      }
                    }}
                    defaultValues={{ name: search }}
                  />
                </SheetContent>
                <Button type="button" onClick={openClient}>
                  Create client
                </Button>
              </Sheet>
            </ShowNoText>
          )}
          {clients.map((c, index) => {
            const choose = client?.id === c.id;
            return (
              <div
                onClick={async () => {
                  await onChange(c);
                  setClient(c);
                }}
                ref={clients.length === index + 1 ? lastElementRef : undefined}
                key={index}
                className="p-2 rounded-sm hover flex items-center justify-between"
              >
                <span>{c.name || c.email}</span>
                {choose && <Check className="w-4" />}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ChooseClient;
