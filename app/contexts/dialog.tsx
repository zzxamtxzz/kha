"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
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
  useEffect,
  useState,
} from "react";
import { CgClose } from "react-icons/cg";

export interface PopupProps {
  children: ReactNode;
  title: ReactNode;
  width?: number;
  closeDialog?: { state: boolean; fn: () => void };
  className?: string;
}

export interface PopupContextType {
  popup: PopupProps;
  setPopup: Dispatch<SetStateAction<PopupProps>>;
  closeDialog: () => void;
}

export const PopupContext = createContext<PopupContextType | undefined>(
  undefined
);

const initialPopupValue = {
  children: undefined,
  title: "",
};

export function PopupProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [popup, setPopup] = useState<PopupProps>(initialPopupValue);

  useEffect(() => {
    if (popup.children) {
      setOpen(true);
    }

    return () => {
      console.log("from popup useEffect");
    };
  }, [popup.children]);

  const closeDialog = () => {
    setPopup(initialPopupValue);
    setOpen(false);
  };

  return (
    <PopupContext.Provider
      value={{
        popup,
        setPopup,
        closeDialog,
      }}
    >
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          className={cn("max-w-[700px] w-[90%] p-0", popup.className)}
        >
          {popup.children}
        </AlertDialogContent>
      </AlertDialog>
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
