"use client";
import ShowNoText from "@/components/app/nodata";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import DeviceModel from "@/models/devices";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useInfiniteData } from "../../hooks/useInfiniteData";
import DeviceHeader from "./header";
import DevicesClientTable from "./table";

function DeviceClient({
  state: s,
  saveColumns: sc,
}: {
  state: string | undefined;
  saveColumns: string;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const client = searchParams.get("clientId");
  const stateParam = searchParams.get("state");
  const expired = searchParams.get("expired");
  const state = (stateParam || s || "list") as string;

  const saveColumns = JSON.parse(sc) as string[];

  const {
    data: devices,
    loading,
    queryKey,
    lastElementRef,
    count,
  } = useInfiniteData<DeviceModel>({
    keys: "devices",
    size: 20,
    params: { search, expired, client },
  });

  return (
    <div className="h-full w-full overflow-y-auto">
      <DeviceHeader state={state} />
      <p className="font-semibold px-4">Total Devices {count}</p>
      <div className="px-2 w-full">
        {state === "list" ? (
          <DevicesClientTable
            lastElementRef={lastElementRef}
            loading={loading}
            devices={JSON.stringify(devices)}
            count={count}
            saveColumns={saveColumns}
          />
        ) : (
          <div
            className={cn(
              "max-w-[1200px] mx-auto px-4 py-2",
              devices.length &&
                "grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            )}
          >
            {!loading && devices.length <= 0 && (
              <ShowNoText>
                No device found{" "}
                <Link
                  href={"/devices/create"}
                  className="hover:underline cursor-pointer text-xs font-normal"
                >
                  create new one
                </Link>
              </ShowNoText>
            )}

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
              : devices.map((device, k) => {
                  return (
                    <Card
                      ref={k === devices.length - 1 ? lastElementRef : null}
                      key={k}
                    >
                      <CardHeader className="p-4">
                        <Link
                          className="hover:underline font-semibold"
                          href={`/devices/${device._id}`}
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

export default DeviceClient;
