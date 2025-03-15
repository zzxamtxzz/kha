import { useSheet } from "@/app/contexts/sheet";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import ShowNoText from "@/components/app/nodata";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import Bill from "@/models/bill";
import Device from "@/models/devices";
import { useState } from "react";
import CreateDeviceClient from "../../devices/create/form";
import CreateBillClient from "../create/client";
import Devices from "./devices";
import { FormContext } from "@/app/contexts/form-context";

function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function ChooseDevices() {
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState<Device | undefined>(undefined);
  const [prevent, setPrevent] = useState(false);
  const [alert, setAlert] = useState(false);
  const [search, setSearch] = useState("");
  const { data, loading, queryKey, lastElementRef } = useInfiniteData<Device>({
    keys: "devices",
    size: 20,
    params: { search },
  });

  const handleOpenChange = (value: boolean) => {
    if (!prevent) {
      setOpen(value);
    } else {
      setAlert(true);
    }
  };

  const { setOpen: setSheet, setContent, closeSheet } = useSheet();
  const onSuccess = (device?: Device) => {
    setOpen(false);
    if (device) {
      setSheet(true);
      setContent(
        <CreateBillClient
          onSuccess={closeSheet}
          data={{ device_id: device.id, device } as unknown as Bill}
        />
      );
    } else {
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col max-h-[500px] overflow-y-auto p-2">
      <p className="font-semibold">Choose Device</p>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="my-2"
      />
      {loading && (
        <div className="flex flex-col gap-2">
          <Skeleton className="w-44 h-6" />
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-36 h-6" />
        </div>
      )}
      {!loading && !data.length && <ShowNoText>Nothing found</ShowNoText>}
      {!loading && !data.length && (
        <FormContext.Provider value={{ setPrevent, setAlert }}>
          <AlertDialog open={alert} onOpenChange={setAlert}>
            <Sheet open={open} onOpenChange={handleOpenChange}>
              <SheetContent className="min-w-[700px] p-2 overflow-y-auto">
                <CreateDeviceClient
                  defaultValues={device}
                  onSuccess={onSuccess}
                />
              </SheetContent>
              <Button
                onClick={() => {
                  const isEmail = isValidEmail(search);
                  const defaultValues: any = {};
                  if (isEmail) {
                    defaultValues.email = search;
                  } else if (
                    ["4pba", "m1ht", "2dwc"].some((p) =>
                      search.toLowerCase().includes(p)
                    )
                  ) {
                    defaultValues.snNo = search;
                  } else if (search.toLowerCase().includes("acc")) {
                    defaultValues.accNo = search;
                  } else {
                    defaultValues.first_name = search;
                  }
                  setOpen(true);
                  setDevice(defaultValues);
                }}
              >
                + Device
              </Button>
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
      )}
      <Devices data={data} lastElementRef={lastElementRef} />
    </div>
  );
}

export default ChooseDevices;
