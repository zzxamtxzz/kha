"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
}>({
  open: false,
  content: undefined,
  setClassName: () => {},
  setContent: () => {},
  closeSheet: () => {},
  setOpen: () => {},
});

export function useSheet2() {
  return useContext(SheetContext);
}

export function SheetProvider2({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [content, setContent] = useState<ReactNode>(undefined);

  const closeSheet = () => {
    setOpen(false);
    setContent(undefined);
    setClassName("");
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
      }}
    >
      <Sheet open={open} onOpenChange={setOpen}>
        {children}
        <SheetContent className={cn("p-0", className)}>{content}</SheetContent>
      </Sheet>
    </SheetContext.Provider>
  );
}
