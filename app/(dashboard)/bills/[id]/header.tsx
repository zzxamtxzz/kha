"use client";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { BillMenu } from "./menu";

function BillDetailHeader({ data }: { data: string }) {
  const router = useRouter();
  return (
    <CardHeader className="p-4 border-b items-center w-full justify-between">
      <Button
        variant={"outline"}
        onClick={() => router.back()}
        type="reset"
        className="w-8 h-8 rounded-full p-0 left-1 top-0"
      >
        <ArrowLeft className="w-4" />
      </Button>
      <p className="px-2 font-semibold text-lg">Bill Detail</p>
      <BillMenu data={data} title={"bills"} />
    </CardHeader>
  );
}

export default BillDetailHeader;
