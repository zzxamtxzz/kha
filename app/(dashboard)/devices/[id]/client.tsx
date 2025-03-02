import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import BillModel from "@/models/bill";
import DeviceModel from "@/models/devices";
import User from "@/models/user";
import Link from "next/link";
import { notFound } from "next/navigation";
import DefaultDataShow from "../../_components/default/show";
import BillComponent from "../../bills/bill";
import ClientDetailHeader from "./header";

async function DeviceDetailPage({ params }: { params: { id: string } }) {
  const device = await DeviceModel.findByPk(params.id, {
    include: [
      { model: User, as: "createdBy", attributes: ["id", "email"] },
      { model: BillModel, as: "lastBill" },
    ],
  });

  if (!device) notFound();

  const bills = await BillModel.findAll({ where: { deviceId: device.id } });
  return (
    <div className="w-full h-full p-8">
      <Card className="max-w-[700px] mx-auto p-0 w-full min-h-full">
        <CardHeader className="p-4 border-b">
          <ClientDetailHeader />
        </CardHeader>
        <CardContent className="p-4">
          <Link
            className={cn(buttonVariants({ variant: "outline" }))}
            href={`/bills/create?deviceId=${params.id}`}
          >
            Create Bill
          </Link>
          <DefaultDataShow
            toSkip={["lastBill", "id"]}
            data={JSON.stringify(device)}
          />
          <p className="font-bold text-lg">Last bill record</p>
          {device.lastBill && <BillComponent bill={device.lastBill} />}
          <p className="font-semibold my-4 text-center">
            Bill History of {device.name || device.email}
          </p>
          <div className="flex flex-col gap-2">
            {bills.map((bill, k) => {
              return <BillComponent bill={bill} key={k} />;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DeviceDetailPage;
