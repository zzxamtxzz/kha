"use client";
import { useInfiniteData } from "@/app/hooks/useInfiniteData";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import DeviceModel from "@/models/devices";
import { UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ListCartNavigation from "../_components/btn/listcart";
import SearchInput from "../_components/input/search";
import ClientExportBtn from "./exports";
import ImportDataWithExcel from "./import";
import ClientTable from "./table";

function ClientsClient({
  state: s,
  saveColumns: sc,
}: {
  state: string | undefined;
  saveColumns: string;
}) {
  const saveColumns = JSON.parse(sc) as string[];
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const stateParam = searchParams.get("state");
  const state = (stateParam || s) as string;

  const { data, loading, queryKey, lastElementRef, count } =
    useInfiniteData<DeviceModel>({
      keys: "clients",
      size: 20,
      params: { search },
    });

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex justify-between gap-2 px-4 p-2 flex-wrap">
        <Link
          className={cn(
            buttonVariants({
              variant: "default",
              className: "bg-blue-500 hover:bg-blue-600 sm:w-auto w-full",
            })
          )}
          href={"/clients/create"}
        >
          <UserRoundPlus className="w-4" />
          <span className="px-2">Add New Client</span>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <ListCartNavigation state={state} />
          <SearchInput />
          <ClientExportBtn />
          <ImportDataWithExcel />
        </div>
      </div>
      <p className="font-semibold px-4">Total Clients {count}</p>

      <div className="px-4 pb-4 w-full">
        {state === "list" ? (
          <ClientTable
            saveColumns={saveColumns}
            lastElementRef={lastElementRef}
            loading={loading}
            devices={JSON.stringify(data)}
            count={count}
          />
        ) : (
          <div className="max-w-[1200px] mx-auto grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-2">
            {loading
              ? new Array(3).fill(null).map((_, k) => {
                  return (
                    <Card
                      key={k}
                      className="min-w-[200px] space-y-8 h-46 flex-1 cart-bg hover p-4"
                    >
                      <Skeleton className="w-20 h-4" />
                      <Skeleton className="w-40 h-4" />
                      <Skeleton className="w-40 h-4" />
                    </Card>
                  );
                })
              : data.map((device, k) => {
                  return (
                    <Card
                      ref={k === data.length - 1 ? lastElementRef : null}
                      key={k}
                    >
                      <CardHeader className="p-4">
                        <Link
                          className="hover:underline font-semibold"
                          href={`/devices/${device.id}`}
                        >
                          {device.name || "no name"}
                        </Link>
                      </CardHeader>
                      <CardContent className="p-4">{device.email}</CardContent>
                      <CardFooter className="p-4">
                        <p>Created By: {device.createdBy?.email}</p>
                      </CardFooter>
                    </Card>
                  );
                })}
          </div>
        )}
        {/* */}
      </div>
    </div>
  );
}

export default ClientsClient;
