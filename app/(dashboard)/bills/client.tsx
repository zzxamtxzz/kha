"use client";
import ShowNoText from "@/components/app/nodata";
import DynamicTable, { ColumnType } from "@/components/table/page";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Bill from "@/models/bill";
import { useSearchParams } from "next/navigation";
import { useInfiniteData } from "../../hooks/useInfiniteData";
import BillComponent from "./bill";
import CreateNewBill from "./choose/choosedevice";
import Link from "next/link";

function BillsClient({ state: s }: { state: string }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const state = (searchParams.get("state") || s) as string;
  const {
    data: bills,
    loading,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<Bill>({
    keys: "bills",
    size: 20,
    params: { search },
  });

  const columns: ColumnType<Bill>[] = [
    {
      id: "device",
      name: "device",
      cell: ({ device, id }) => (
        <Link className="hover:underline" href={`/bills/${id}`}>
          {device?.client?.name || device.email}
        </Link>
      ),
    },
    {
      id: "billing_date",
      name: "billing_date",
    },
    { id: "amount", name: "amount" },
    { id: "fee", name: "fee" },
    { id: "duration_month", name: "duration_month" },
    { id: "plan", name: "plan", cell: ({ plan }) => plan?.name },
    {
      id: "created_by",
      name: "created_by",
      cell: ({ created_by }) =>
        created_by.username || created_by.name || created_by.email,
    },
  ];
  return (
    <div className={cn("max-w-[1200px] mx-auto mt-4")}>
      {state === "list" ? (
        <DynamicTable<Bill>
          className="h-full mt-2 mx-auto cart-bg shadow-m rounded-lg"
          lastElementRef={lastElementRef}
          loading={loading}
          data={bills}
          columnNames={columns.map((c) => c.name)}
          columns={columns}
          title={"bills"}
        />
      ) : (
        <div
          className={cn(
            "w-full grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          )}
        >
          {loading && (
            <div
              className={
                "w-full grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              }
            >
              {new Array(3).fill(null).map((_, k) => {
                return (
                  <Card
                    key={k}
                    className="min-w-[200px] flex-1 cart-bg hover p-0"
                  >
                    <CardHeader className="px-4 pt-2 w-full justify-between flex flex-col gap-4">
                      <Skeleton className="w-46 h-4" />
                      <Skeleton className="w-26 h-4" />
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col gap-4">
                      <Skeleton className="w-46 h-4" />
                      <Skeleton className="w-20 h-4" />
                      <Skeleton className="w-66 h-4" />
                      <Skeleton className="w-66 h-4" />
                      <Skeleton className="w-66 h-4" />
                    </CardContent>
                    <CardFooter className="p-4 flex flex-col gap-4">
                      <Skeleton className="w-66 h-4" />
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
          {!loading && bills.length <= 0 && (
            <ShowNoText className="mx-auto w-[400px] flex flex-col gap-4">
              <span>No bill found </span>
              <CreateNewBill />
            </ShowNoText>
          )}
          {bills.map((bill, k) => {
            return (
              <BillComponent
                ref={k === bills.length - 1 ? lastElementRef : null}
                bill={bill}
                key={k}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BillsClient;
