"use client";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

export function SheetModal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(true);

  const router = useRouter();
  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <SheetContent
        // onInteractOutside={(event) => {}}
        className={cn("p-0", className)}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
