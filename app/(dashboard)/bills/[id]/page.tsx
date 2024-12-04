import { Card, CardContent } from "@/components/ui/card";
import BillModel from "@/models/bill";
import User from "@/models/user";
import { notFound } from "next/navigation";
import DefaultDataShow from "../../_components/default/show";
import BillDetailHeader from "./header";

async function BillDetail({ params }: { params: { id: string } }) {
  const bill = await BillModel.findByPk(params.id, {
    include: { model: User, as: "createdBy", attributes: ["_id", "email"] },
  });

  if (!bill) notFound();

  return (
    <div className="w-full overflow-y-auto h-full p-4">
      <Card className="max-w-[700px] min-h-full h-auto mx-auto p-0 w-full">
        <BillDetailHeader data={bill._id.toString()} />
        <CardContent className="p-4">
          <DefaultDataShow data={JSON.stringify(bill)} />
        </CardContent>
      </Card>
    </div>
  );
}

export default BillDetail;
