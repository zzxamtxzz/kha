"use client";

import { useViewMode } from "@/app/contexts/state";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import DynamicTable, { ColumnType } from "@/components/table/page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Bill from "@/models/bill";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import BillDetailClient from "../[id]/client";
import CreateNewBill from "../choose/createbillbtn";
import { FormContext } from "../choose/devices";
import StatusField from "../create/status";
import BillComponent from "./bill";

function BillsClient({ saveColumns: sc }: { saveColumns: string }) {
  const [data, setData] = useState<Bill | null>(null);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const [prevent, setPrevent] = useState(false);
  const saveColumns = JSON.parse(sc) || [];
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const { state } = useViewMode();
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
      cell: (data) => {
        if (!data.device) return;
        return (
          <div
            onClick={() => {
              setOpen(true);
              setData(data);
            }}
            className="hover:underline"
          >
            <Label>
              {data.device?.client?.name ||
                data.device?.email?.substring(0, 10) + "..."}
            </Label>
            <p className="text-xs">Sn No: {data.device?.snNo}</p>
          </div>
        );
      },
    },
    {
      id: "status",
      name: "status",
      cell: (bill) => {
        return <StatusField bill={bill} onChange={() => {}} />;
      },
    },
    {
      id: "billing_date",
      name: "billing_date",
    },
    { id: "amount", name: "amount" },
    { id: "fee", name: "fee" },
    {
      id: "duration_month",
      name: "duration_month",
      cell: ({ duration_month }) => duration_month,
    },
    { id: "plan", name: "plan", cell: ({ plan }) => plan?.name },
    { id: "branch", name: "branch", cell: ({ branch }) => branch?.name },
    {
      id: "created_by",
      name: "created_by",
      cell: ({ created_by }) => {
        if (!created_by) return;
        return created_by.username || created_by.name || created_by.email;
      },
    },
  ];

  if (loading) return <SpinLoading />;

  const onSuccess = () => setOpen(false);

  const handleOpenChange = (value: boolean) => {
    if (!prevent) {
      setOpen(value);
    } else {
      setAlert(true);
    }
  };

  return (
    <FormContext.Provider value={{ setPrevent, setAlert }}>
      <AlertDialog open={alert} onOpenChange={setAlert}>
        <Sheet open={open} onOpenChange={handleOpenChange}>
          <SheetContent className="p-0 lg:min-w-[1000px] min-w-full">
            {data && <BillDetailClient onSuccess={onSuccess} data={data} />}
          </SheetContent>
          <div className={cn("max-w-[1200px] mx-auto mt-4")}>
            {state === "list" ? (
              <DynamicTable<Bill>
                className="h-full mt-2 mx-auto card-bg shadow-m rounded-lg"
                lastElementRef={lastElementRef}
                loading={loading}
                data={bills}
                columnNames={columns.map((c) => c.name).filter((c) => c)}
                columns={[
                  ...(saveColumns.length
                    ? columns.filter(
                        (c) => c.id || saveColumns.includes(c.name || "")
                      )
                    : columns),
                ]}
                title={"bills"}
              />
            ) : (
              <div
                className={cn(
                  "w-full grid xl:grid-cols-4 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                )}
              >
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
        </Sheet>
        <AlertDialogContent className="p-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Closing this window will delete all unsaved changes
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                setOpen(false);
                setPrevent(false);
                setAlert(false);
              }}
            >
              Close without saving
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FormContext.Provider>
  );
}

export default BillsClient;
