"use client";
import { useViewMode } from "@/app/contexts/state";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Client from "@/models/client";
import { UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ListCardNavigation from "../../components/btn/listcard";
import SearchInput from "../../components/input/search";
import { CustomerCardSkeleton } from "./customer-card-skeleton";
import { CustomerCardView } from "./customer-card-view";
import ClientTable from "./table";

function ClientsClient({ saveColumns: sc }: { saveColumns: string }) {
  const saveColumns = JSON.parse(sc) as string[];
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const { state } = useViewMode();

  const { data, loading, lastElementRef, count, isFetchingNextPage } =
    useInfiniteData<Client>({
      keys: "clients",
      size: 20,
      params: { search },
    });

  return (
    <Card className="h-auto w-full border-none shadow-none">
      <CardHeader className="flex-row items-center justify-between p-0 mb-2">
        <div className="flex-1">
          <CardTitle>Clients</CardTitle>
          <CardDescription>Showing {count} clients</CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput />
          <Link
            className={cn(
              buttonVariants({
                variant: "default",
                className: "sm:w-auto w-full",
              })
            )}
            href={"/workflows/clients/create"}
          >
            <UserRoundPlus className="w-4" />
            <span className="px-2">New client</span>
          </Link>
          <ListCardNavigation />
          {/* <ClientExportBtn />
          <ImportDataWithExcel /> */}
        </div>
      </CardHeader>
      <div className="px-4 pb-4 w-full">
        {state === "list" ? (
          <ClientTable
            saveColumns={saveColumns}
            lastElementRef={lastElementRef}
            loading={loading}
            devices={JSON.stringify(data)}
            count={count || 0}
          />
        ) : loading ? (
          <CustomerCardSkeleton />
        ) : (
          <CustomerCardView
            lastElementRef={lastElementRef}
            data={data}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>
    </Card>
  );
}

export default ClientsClient;
