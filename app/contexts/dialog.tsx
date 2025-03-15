"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
        <DialogContent className={cn("w-[700px] p-0", popup.className)}>
          {popup.children}
        </DialogContent>
      </Dialog>
    </PopupContext.Provider>
  );
}

export function usePopup() {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
}
