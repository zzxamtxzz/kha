"use client";
import { useHasUser } from "@/app/contexts/user";
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
import { cn } from "@/lib/utils";
import Device from "@/models/devices";
import { actions, ADMIN, roles } from "@/roles";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import ChooseClients from "./choose";

function DevicesClientTable({
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
  const devices = JSON.parse(d) as Device[];
  const { user } = useHasUser();
  const foundRole = roles.find((r) => r.name === user.role);

  const columns: ColumnType<Device>[] = [
    {
      //@ts-ignore
      name: "no",
      cell: ({ index }) => {
        return <div className="w-8">{index + 1}</div>;
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
            href={`/devices/${id}`}
            className={cn(
              "hover:underline px-2 font-semibold",
              expired ? "text-red-500" : ""
            )}
          >
            {email}{" "}
            {lastBill &&
              (expired ? (
                <sup>
                  <small className="text-red-500">expired {daysExpired}</small>
                </sup>
              ) : (
                <sup>
                  <small
                    className={cn(
                      "text-green-500",
                      daysUntilExpiration < 15 && "text-red-500"
                    )}
                  >
                    expired in {daysUntilExpiration} days
                  </small>
                </sup>
              ))}
          </Link>
        );
      },
    },
    // {
    //   name: "email",
    //   cell: ({ email, id }) => {
    //     return (
    //       <Link href={`/devices/${id}`} className="hover:underline px-2">
    //         {email}
    //       </Link>
    //     );
    //   },
    // },
    { name: "device_serial" },
    { name: "account_number" },
    { name: "kit_number" },
    {
      name: "client",
      cell: (device) => (
        <div>
          {device.client ? (
            device.client.name || device.client.email
          ) : (
            <ChooseClients device={device} />
          )}
        </div>
      ),
    },
    {
      name: "created_by",
      cell: ({ created_by }) => created_by?.name || created_by?.email,
    },
  ];

  return (
    <DynamicTable
      className="h-full mt-2 mx-auto cart-bg shadow-m rounded-lg"
      loading={loading}
      skip={[]}
      data={devices}
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
                  <Button variant="ghost" className="h-8 w-10 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(id)}
                  >
                    Copy payment ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/bills/create?device_id=${id}`}>
                      Create Bill
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/devices/${id}`}>View device</Link>
                  </DropdownMenuItem>
                  {(ADMIN === user.role ||
                    foundRole?.devices.includes(actions.UPDATE)) && (
                    <DropdownMenuItem asChild>
                      <Link href={`/devices/create?edit=${id}`}>
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
      lastElementRef={lastElementRef}
      title={"devices"}
    />
  );
}

export default DevicesClientTable;
