"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState, type FC, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: ReactNode;
  className?: string;
}

export const SheetModal: FC<ModalProps> = ({ children, className }) => {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        setOpen(open);
        router.back();
      }}
    >
      <SheetContent className={cn("p-0 min-w-[700px]", className)}>
        {children}
      </SheetContent>
    </Sheet>
  );
};
