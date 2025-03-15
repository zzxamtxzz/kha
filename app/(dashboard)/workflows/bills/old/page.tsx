"use client";

import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import { Button } from "@/components/ui/button";
import Bill from "@/models/bill";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "../../../../../components/page-header";
import { BillCardViewWithLoading } from "./bill-card-view-with-loading";

export default function BillsPage() {
  const {
    data: bills,
    loading,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<Bill>({
    keys: "bills",
    size: 20,
    params: {},
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Bills"
        description="Manage and view all billing information"
        actions={
          <Link href="/workflows/bills/create">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Bill
            </Button>
          </Link>
        }
      />

      <BillCardViewWithLoading bills={bills} isLoading={loading} />
    </div>
  );
}
