import { FormContext } from "@/app/contexts/form-context";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Bill from "@/models/bill";
import { Dispatch, SetStateAction, useState } from "react";
import CreateBillClient from "../create/client";
import { cn } from "@/lib/utils";

function CreateBill({
  bill,
  open,
  setOpen,
}: {
  bill?: Bill;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [alert, setAlert] = useState(false);
  const [prevent, setPrevent] = useState(false);

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
          <SheetContent
            className={cn(
              "p-0",
              bill?.id ? "min-w-[1000px]" : " min-w-[700px]"
            )}
          >
            <CreateBillClient data={bill} onSuccess={onSuccess} />
          </SheetContent>
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

export default CreateBill;
