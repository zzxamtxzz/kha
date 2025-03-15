"use client";
import { useHasUser } from "@/app/contexts/user";
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
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Device from "@/models/devices";
import { QueryKey } from "@tanstack/react-query";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import ChooseClient from "./clients";

function DevicesClientTable({
  devices: d,
  loading,
  lastElementRef,
  saveColumns,
  queryKey,
}: {
  devices: string;
  loading: boolean;
  lastElementRef: any;
  saveColumns: string[];
  queryKey: QueryKey;
}) {
  const devices = JSON.parse(d) as Device[];
  const { user } = useHasUser();

  const { updateData } = useMutateInfiniteData();
  const columns: ColumnType<Device>[] = [
    {
      //@ts-ignore
      name: "no",
      cell: ({ index }) => {
        return <div className="w-6">{index + 1}</div>;
      },
    },
    {
      name: "email",
      cell: ({ lastBill, id, email }) => {
        const billing_date = dayjs(lastBill?.billing_date);
        const expirationDate = billing_date.add(
          lastBill?.duration_month,
          "month"
        );
        const currentDate = dayjs();

        const daysUntilExpiration = expirationDate.diff(currentDate, "day");
        const daysExpired = currentDate.diff(expirationDate, "day");

        const expired = dayjs(lastBill?.billing_date)
          .add(lastBill?.duration_month, "month")
          .isBefore(dayjs());

        return (
          <Link
            href={`/workflows/devices/${id}`}
            className={cn(
              "hover:underline font-semibold",
              expired ? "text-red-500" : ""
            )}
          >
            {email?.substring(0, 10) + "..."}
            <p>
              {lastBill &&
                (expired ? (
                  <small className="text-red-500">expired {daysExpired}</small>
                ) : (
                  <small
                    className={cn(
                      "text-green-500",
                      daysUntilExpiration < 15 && "text-red-500"
                    )}
                  >
                    expired in {daysUntilExpiration} days
                  </small>
                ))}
            </p>
          </Link>
        );
      },
    },
    {
      name: "first_name",
      cell: ({ first_name, id }) => {
        return (
          <Link
            href={`/workflows/devices/${id}`}
            className="hover:underline px-2"
          >
            {first_name}
          </Link>
        );
      },
    },
    {
      name: "last_name",
      cell: ({ last_name, id }) => {
        return (
          <Link
            href={`/workflows/devices/${id}`}
            className="hover:underline px-2"
          >
            {last_name}
          </Link>
        );
      },
    },
    { name: "snNo" },
    { name: "accNo" },
    { name: "kitNo" },
    {
      name: "client",
      cell: (device) => (
        <ChooseClient
          client={device.client}
          onChange={async (client) => {
            console.log("client", client);
            try {
              const response = await axios.put(`/api/devices/${device.id}`, {
                client_id: client.id,
              });

              const update: any = {
                ...device,
                queryKey,
                client,
              };

              updateData(update);
              toast({
                title: "Success",
                description: (
                  <pre>{JSON.stringify(response.data, null, 2)}</pre>
                ),
              });
            } catch (error: any) {
              console.log("error", error);
              toast({
                title: "Error found",
                variant: "destructive",
                description: error.response?.data?.error || error.message,
              });
            }
          }}
        />
      ),
    },
    {
      name: "created_by",
      cell: ({ created_by }) => created_by?.name || created_by?.email,
    },
  ];

  return (
    <DynamicTable
      className="h-full mt-2 mx-auto card-bg shadow-m rounded-lg"
      loading={loading}
      skip={[]}
      data={devices}
      columns={[
        ...(saveColumns.length
          ? columns.filter((c) => c.id || saveColumns.includes(c.name || ""))
          : columns),
        {
          id: "action",
          cell: (device) => {
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-10 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(device.id)}
                  >
                    Copy payment ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="text-green-500 hover:text-green-600"
                    // onClick={() => {
                    //   setOpen(true);
                    //   setClassName("min-w-[700px]");
                    //   setContent(
                    //     <CreateBillClient
                    //       onSuccess={closeSheet}
                    //       device={device}
                    //     />
                    //   );
                    // }}
                  >
                    <Link
                      href={`/workflows/bills/create?device_id=${device.id}`}
                    >
                      Create Bill
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/workflows/devices/${device.id}`}>
                      View device
                    </Link>
                  </DropdownMenuItem>
                  {(user.super_admin ||
                    user.role?.permissions?.devices?.includes("update")) && (
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/workflows/devices/create?edit=${device.id}`}
                      >
                        Edit devices
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ]}
      columnNames={columns.map((c) => c.name).filter((c) => c)}
      lastElementRef={lastElementRef}
      title={"devices"}
    />
  );
}

export default DevicesClientTable;
