"use client";
import DefaultDataShow from "@/app/(dashboard)/components/default/show";
import { useHasUser } from "@/app/contexts/user";
import { useDetail } from "@/app/hooks/useDetail";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { Card, CardContent } from "@/components/ui/card";
import Bill from "@/models/bill";
import CreateBillClient from "../create/client";
import BillDetailHeader from "./header";

function BillDetailClient({
  data: d,
  onSuccess,
}: {
  data: Bill;
  onSuccess: () => void;
}) {
  const { user } = useHasUser();
  const { data, isLoading } = useDetail<Bill>({ id: d.id, title: "bills" });

  if (isLoading) return <SpinLoading />;
  if (user.super_admin || user.role?.permissions?.bills?.includes("create"))
    return <CreateBillClient data={data} onSuccess={onSuccess} />;

  if (!data) return <ShowNoText>No data found</ShowNoText>;

  return (
    <div className="w-full overflow-y-auto h-full p-4">
      <Card className="max-w-[700px] min-h-full h-auto mx-auto p-0 w-full">
        <BillDetailHeader data={data.id} />
        <CardContent className="p-4">
          <DefaultDataShow data={JSON.stringify(data)} />
        </CardContent>
      </Card>
    </div>
  );
}

export default BillDetailClient;
