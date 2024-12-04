"use client";
import axios from "@/axios";
import DynamicTable, { ColumnType } from "@/components/table/page";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Client from "@/models/client";
import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useMutateInfiniteData } from "../../hooks/mutateInfinite";

function ClientTable({
  devices: d,
  count,
  loading,
  lastElementRef,
  saveColumns,
}: {
  count: number;
  devices: string;
  loading: boolean;
  lastElementRef: any;
  saveColumns: string[];
}) {
  const clients = JSON.parse(d) as Client[];

  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("clients") && !q.includes("count"));

  const columns: ColumnType<Client>[] = [
    {
      //@ts-ignore
      name: "no",
      cell: ({ index }) => {
        return <div className="w-8">{index + 1}</div>;
      },
    },
    {
      name: "name",
      cell: ({ name, _id }) => {
        return (
          <Link href={`/clients/${_id}`} className="hover:underline px-2">
            {name}
          </Link>
        );
      },
    },
    {
      name: "email",
      cell: ({ email, _id }) => {
        return (
          <Link href={`/clients/${_id}`} className="hover:underline px-2">
            {email}
          </Link>
        );
      },
    },
    { name: "createdBy" },
    { name: "createdAt" },
    { name: "devices", cell: ({ deviceCount }) => <p>{deviceCount}</p> },
  ];
  return (
    <DynamicTable<Client>
      className="flex h-full mt-2 mx-auto flex-wrap cart-bg shadow-m rounded-lg"
      loading={loading}
      skip={["_id", "createdById"]}
      data={clients}
      columns={[
        ...(saveColumns.length
          ? columns.filter((c) => c.id || saveColumns.includes(c.name || ""))
          : columns),
        {
          id: "action",
          cell: ({ _id }) => {
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[250px]" align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/devices/create?clientId=${_id}`}>
                      <Plus className="w-4" />
                      <span className="px-2">Add Device</span>
                    </Link>
                  </DropdownMenuItem>{" "}
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard.writeText(_id.toString())
                    }
                  >
                    Copy client id
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={async () => {
                      await axios.delete(`/api/clients/${_id}`);
                      queryKeys.map((queryKey) =>
                        updateData({ queryKey, _id, remove: true })
                      );
                    }}
                  >
                    Delete
                  </DropdownMenuItem>{" "}
                  <DropdownMenuItem asChild>
                    <Link href={`/clients/${_id}`}>View</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/clients/create?edit=${_id}`}>Edit</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ]}
      lastElementRef={lastElementRef}
      title={"clients"}
    />
  );
}

export default ClientTable;
