"use client";

import { Skeleton } from "@/components/ui/skeleton";

import { useViewMode } from "@/app/contexts/state";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import { Toaster } from "@/components/ui/toaster";
import Client from "@/models/client";
import { useState } from "react";
import ListCardNavigation from "../../components/btn/listcart";
import { CustomerFilters } from "./components/customer-filters";
import { CustomerStats } from "./components/customer-stats";
import { CustomerCardSkeleton } from "./customer-card-skeleton";
import { CustomerCardView } from "./customer-card-view";
import ClientTable from "./table";

export default function CustomerDashboard() {
  const [search, setSearch] = useState("");
  const {
    data: customers,
    loading,
    lastElementRef,
    count,
    isFetchingNextPage,
  } = useInfiniteData<Client>({
    keys: "clients",
    size: 20,
    params: { search },
  });

  const { state: viewMode } = useViewMode();

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Customer Management
        </h1>
        <p className="text-muted-foreground">
          View and manage your customer data
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-[104px] rounded-md border bg-card text-card-foreground shadow-sm"
              >
                <div className="p-6 flex flex-col space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <CustomerStats customers={customers} />
      )}

      <div className="flex justify-between items-end">
        <CustomerFilters customers={customers} />

        <ListCardNavigation />
      </div>

      {loading ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Customers</h2>
          <CustomerCardSkeleton count={6} />
        </div>
      ) : viewMode === "card" ? (
        <CustomerCardView
          data={customers}
          lastElementRef={lastElementRef}
          isFetchingNextPage={isFetchingNextPage}
        />
      ) : (
        <ClientTable
          saveColumns={[]}
          lastElementRef={lastElementRef}
          loading={loading}
          devices={JSON.stringify(customers)}
          count={count || 0}
        />
      )}

      <Toaster />
    </div>
  );
}
