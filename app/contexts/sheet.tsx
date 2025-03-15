"use client";
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
import { cn } from "@/lib/utils";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

const SheetContext = createContext<{
  open: boolean;
  setContent: Dispatch<SetStateAction<ReactNode>>;
  content: ReactNode;
  closeSheet: () => void;
  setClassName: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setPrevent: Dispatch<SetStateAction<boolean>>;
  setAlert: Dispatch<SetStateAction<boolean>>;
}>({
  open: false,
  content: undefined,
  setClassName: () => {},
  setContent: () => {},
  closeSheet: () => {},
  setOpen: () => {},
  setPrevent: () => {},
  setAlert: () => {},
});

export function useSheet() {
  return useContext(SheetContext);
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState(false);
  const [prevent, setPrevent] = useState(false);
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [content, setContent] = useState<ReactNode>(undefined);

  const closeSheet = () => {
    setOpen(false);
    setContent(undefined);
    setClassName("");
    setAlert(false);
    setPrevent(false);
  };

  return (
    <SheetContext.Provider
      value={{
        open,
        content,
        setContent,
        setOpen,
        closeSheet,
        setClassName,
        setPrevent,
        setAlert,
      }}
    >
      <AlertDialog open={alert} onOpenChange={setAlert}>
        {children}
        <div
          onClick={() => {
            if (prevent) {
              setAlert(true);
            } else {
              closeSheet();
            }
          }}
          className={cn(
            "inset-0 bg-black/50 hidden z-20 fixed  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            open && "fixed flex"
          )}
          data-state={open ? "open" : "closed"}
        />
        <div
          data-state={open ? "open" : "closed"}
          className={cn(
            "p-0 h-full min-w-[700px] fixed z-50 gap-4 card-bg shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
            className,
            open && "fixed top-0 right-0 z-50"
          )}
        >
          {content}
        </div>
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
    </SheetContext.Provider>
  );
}
