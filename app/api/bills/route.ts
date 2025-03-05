import { getUser } from "@/auth/user";
import BillModel from "@/models/bill";
import Device from "@/models/devices";
import User from "@/models/user";
import { NextRequest } from "next/server";
import { literal } from "sequelize";

export async function GET(request: NextRequest) {
  const bills = await BillModel.findAll({
    where: { is_public: true },
    include: [
      { model: User, as: "created_by", attributes: ["email"] },
      { model: Device, as: "device", attributes: ["name", "email"] },
    ],
    order: [
      [literal(`DATE_ADD(billing_date, INTERVAL duration_month MONTH)`), "ASC"],
    ],
  });
  return Response.json(bills);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = (await request.json()) as BillModel & { device_id: string };

  const {
    device_id,
    billing_date,
    plan_id,
    duration_month,
    amount,
    fee,
    remark,
  } = body;

  try {
    const device = await Device.findOne({
      where: { is_public: true, id: device_id },
    });
    if (!device)
      return Response.json({ error: "device not found" }, { status: 404 });

    const newBill = await BillModel.create(
      {
        device_id,
        billing_date,
        plan_id: Number(plan_id),
        fee: Number(fee),
        duration_month,
        amount,
        remark,
        created_by_id: user.id,
      },
      {
        include: [
          { model: User, as: "created_by", attributes: ["email"] },
          { model: Device, as: "device", attributes: ["name", "email"] },
        ],
      }
    );

    console.log("new bill", newBill);

    await device.update({ last_bill_id: newBill.id });

    return Response.json(newBill);
  } catch (error: any) {
    console.error("Error creating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
