import { getUser } from "@/auth/user";
import PlanModel from "@/models/billplan";
import DeviceModel from "@/models/devices";
import { actions, ADMIN, roles } from "@/roles";
import { notFound } from "next/navigation";
import CreateBillClient from "./client";

async function CreateBill({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.bills.includes(actions.CREATE))
    return notFound();

  const device = await DeviceModel.findByPk(searchParams.deviceId as string);
  const plans = await PlanModel.findAll();

  if (!device) return notFound();

  return (
    <CreateBillClient
      device={JSON.stringify(device)}
      plans={JSON.stringify(plans)}
    />
  );
}

export default CreateBill;
