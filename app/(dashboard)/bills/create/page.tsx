import { getUser } from "@/auth/user";
import PlanModel from "@/models/billplan";
import Device from "@/models/devices";
import { actions, ADMIN, roles } from "@/roles";
import { notFound } from "next/navigation";
import CreateBillClient from "./client";

async function CreateBill() {
  const user = await getUser();
  if (!user) return;
  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.bills.includes(actions.CREATE))
    return notFound();

  return <CreateBillClient />;
}

export default CreateBill;
