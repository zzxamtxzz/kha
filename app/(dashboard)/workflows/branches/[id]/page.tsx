"use client";
import DefaultDataShow from "@/app/(dashboard)/components/default/show";
import { useDetail } from "@/app/hooks/useDetail";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Client from "@/models/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import ClientDetailHeader from "./header";

function BranchDetail() {
  const { id } = useParams();
  const { data, isLoading } = useDetail<Client>({
    id: id as string,
    title: "branches",
  });
  if (isLoading) return <SpinLoading />;
  if (!data) return <ShowNoText>No data found</ShowNoText>;

  return (
    <Card className="max-w-[700px] mx-auto min-h-full w-full p-0 h-full">
      <ClientDetailHeader />
      <CardContent className="p-4 h-[calc(100%-48px)] overflow-y-auto">
        <DefaultDataShow toSkip={[]} data={JSON.stringify(data)} />
      </CardContent>
    </Card>
  );
}

export default BranchDetail;
