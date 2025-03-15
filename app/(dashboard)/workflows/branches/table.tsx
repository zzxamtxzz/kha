"use client";
import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
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
    .filter((q) => q.includes("branches"));

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
      cell: ({ name, id }) => {
        return (
          <Link
            href={`/workflows/branches/${id}`}
            className="hover:underline px-2"
          >
            {name}
          </Link>
        );
      },
    },

    {
      name: "remark",
      cell: ({ email, id }) => {
        return (
          <Link
            href={`/workflows/branches/${id}`}
            className="hover:underline px-2"
          >
            {email}
          </Link>
        );
      },
    },
  ];
  return (
    <DynamicTable<Client>
      className="flex h-full mt-2 mx-auto flex-wrap card-bg shadow-m rounded-lg"
      loading={loading}
      skip={["id", "created_by_id"]}
      data={clients}
      columns={[
        ...(saveColumns.length
          ? columns.filter((c) => c.id || saveColumns.includes(c.name || ""))
          : columns),
        {
          id: "action",
          cell: ({ id }) => {
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
                    <Link href={`/workflows/devices/create?client_id=${id}`}>
                      <Plus className="w-4" />
                      <span className="px-2">Check Device</span>
                    </Link>
                  </DropdownMenuItem>{" "}
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(id.toString())}
                  >
                    Copy client id
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={async () => {
                      await axios.delete(`/api/clients/${id}`);
                      queryKeys.map((queryKey) =>
                        updateData({ queryKey, id, remove: true })
                      );
                    }}
                  >
                    Delete
                  </DropdownMenuItem>{" "}
                  <DropdownMenuItem asChild>
                    <Link href={`/workflows/branches/${id}`}>View</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/workflows/branches/create?edit=${id}`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ]}
      columnNames={columns.map((c) => c.name)}
      lastElementRef={lastElementRef}
      title={"branches"}
    />
  );
}

export default ClientTable;
