"use client";
import { useDetail } from "@/app/hooks/useDetail";
import { Dialog, DialogContent } from "@/components/shared/dialog";
import Bill from "@/models/bill";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BillDetailView } from "../../[id]/bill-detail-view";
import BillDetailSkeleton from "../../components/bill-detail-skeleton";

export default function CreateDeviceModal({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const { data, isLoading, error } = useDetail<Bill>({
    id: params.id as string,
    title: "bills",
  });

  // Handle not found case
  useEffect(() => {
    if (!isLoading && !data) {
      notFound();
    }
  }, [isLoading, data]);

  // Handle error case
  if (error) {
    throw error; // This will be caught by the error boundary
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back();
          setIsOpen(open);
        }
      }}
    >
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <BillDetailSkeleton />
        ) : (
          data && <BillDetailView bill={data} />
        )}
      </DialogContent>
    </Dialog>
  );
}
