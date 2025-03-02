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
import DeviceModel from "@/models/devices";
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
  const devices = JSON.parse(d) as DeviceModel[];
  const { user } = useHasUser();
  const foundRole = roles.find((r) => r.name === user.role);

  const columns: ColumnType<DeviceModel>[] = [
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
        const billingDate = dayjs(lastBill?.billingDate);
        const expirationDate = billingDate.add(
          lastBill?.durationMonth,
          "month"
        );
        const currentDate = dayjs();

        const daysUntilExpiration = expirationDate.diff(currentDate, "day");
        const daysExpired = currentDate.diff(expirationDate, "day");

        const expired = dayjs(lastBill?.billingDate)
          .add(lastBill?.durationMonth, "month")
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
    { name: "deviceSerial" },
    { name: "accNo" },
    { name: "kitNo" },
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
      name: "createdBy",
      cell: ({ createdBy }) => createdBy.name || createdBy.email,
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
                    <Link href={`/bills/create?deviceId=${id}`}>
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
