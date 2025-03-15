"use client";
import { useDetail } from "@/app/hooks/useDetail";
import Bill from "@/models/bill";
import { notFound, useParams } from "next/navigation";
import { Suspense } from "react";
import BillDetailSkeleton from "../components/bill-detail-skeleton";
import { BillDetailView } from "./bill-detail-view";

export default function BillDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useDetail<Bill>({
    id: id as string,
    title: "bills",
  });

  if (error) throw error;
  if (isLoading) return <BillDetailSkeleton />;
  if (!data) return notFound();

  return (
    <div className="container py-6 md:py-10">
      <Suspense fallback={<BillDetailSkeleton />}>
        <BillDetailView bill={data} />
      </Suspense>
    </div>
  );
}
