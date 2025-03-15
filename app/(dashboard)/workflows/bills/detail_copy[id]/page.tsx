"use client";
import DefaultDataShow from "@/app/(dashboard)/components/default/show";
import { useDetail } from "@/app/hooks/useDetail";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { Card, CardContent } from "@/components/ui/card";
import Bill from "@/models/bill";
import { useParams } from "next/navigation";
import BillDetailHeader from "./header";

function BillDetail() {
  const { id } = useParams();
  const { data, isLoading } = useDetail<Bill>({
    id: id as string,
    title: "bills",
  });

  if (isLoading) return <SpinLoading />;
  if (!data) return <ShowNoText>No data found</ShowNoText>;

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <Card className="max-w-[700px] min-h-full h-auto mx-auto p-0 w-full">
        <BillDetailHeader data={data.id} />
        <CardContent className="p-4">
          <DefaultDataShow data={JSON.stringify(data)} />
        </CardContent>
      </Card>
    </div>
  );
}

export default BillDetail;
