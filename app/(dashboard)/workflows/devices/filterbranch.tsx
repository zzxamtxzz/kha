"use client";
import { useSheet2 } from "@/app/contexts/sheet2";
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
import { cn } from "@/lib/utils";
import Branch from "@/models/branch";
import Client from "@/models/client";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import CreateClientForm from "../clients/create/form";

function FilterByBranch({ onChange }: { onChange: (value: Branch) => void }) {
  const [branch, setBranch] = useState<Branch | undefined>();
  const [search, setSearch] = useState("");
  const { data, loading, queryKey, count, lastElementRef } =
    useInfiniteData<Client>({
      keys: "branches",
      size: 20,
      params: { search },
    });

  const router = useRouter();
  const searchParams = useSearchParams();

  const { updateData } = useMutateInfiniteData();
  const { setOpen: setSheet, setContent, setClassName } = useSheet2();

  const openClient = () => {
    setSheet(true);
    setClassName("p-0 min-w-[600px]");
    setContent(
      <CreateClientForm
        onSuccess={(client) => {
          setSheet(false);
          console.log("client", client);

          if (client) {
            updateData({ ...client, queryKey, new: true });
            router.push(`?client_id=${client.id}`);
          }
        }}
        defaultValues={{ name: search }}
      />
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "card-bg hover justify-start text-left font-normal",
            (search || branch?.id) && "border-green-500"
          )}
        >
          <span className="pr-4">{branch ? branch.name : "Filter branch"}</span>
          <ChevronsUpDown className="w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full p-1 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <input
            value={search}
            placeholder="Search"
            className="p-2 border-b w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
          {(search || branch?.id) && (
            <Button
              onClick={() => {
                setSearch("");
                const currentParams = new URLSearchParams(searchParams);
                currentParams.delete("branch_id");
                router.push(`?${currentParams.toString()}`);
                setBranch(undefined);
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
          {!loading && !data.length && (
            <ShowNoText className="flex flex-col gap-2">
              Nothing found{" "}
              <Button type="button" onClick={openClient}>
                Create Branch
              </Button>
            </ShowNoText>
          )}
          {data.map((c, index) => {
            const choose = branch?.id === c.id;
            return (
              <div
                onClick={async () => {
                  await onChange(c);
                  setBranch(c);
                }}
                ref={data.length === index + 1 ? lastElementRef : undefined}
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

export default FilterByBranch;
