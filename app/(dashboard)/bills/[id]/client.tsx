"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import DefaultDataShow from "../../_components/default/show";
import BillDetailHeader from "./header";
import { useHasUser } from "@/app/contexts/user";
import CreateBillClient from "../create/client";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { useDetail } from "@/app/hooks/useDetail";
import Bill from "@/models/bill";

function BillDetailClient() {
  const { user } = useHasUser();
  const { id } = useParams();
  const { data, isLoading } = useDetail<Bill>({
    id: id as string,
    title: "bills",
  });

  const router = useRouter();
  if (isLoading) return <SpinLoading />;
  if (!data) return <ShowNoText>No data found</ShowNoText>;
  if (user.role === "admin")
    return (
      <CreateBillClient
        edit={data.id}
        plan={data.plan}
        device={data.device}
        onSuccess={function (): void {
          router.back();
        }}
      />
    );

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
