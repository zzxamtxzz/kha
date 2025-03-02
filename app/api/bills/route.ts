import { getUser } from "@/auth/user";
import BillModel from "@/models/bill";
import DeviceModel from "@/models/devices";
import User from "@/models/user";
import { NextRequest } from "next/server";
import { literal } from "sequelize";

export async function GET(request: NextRequest) {
  const bills = await BillModel.findAll({
    where: { isPublic: true },
    include: [
      { model: User, as: "createdBy", attributes: ["email"] },
      { model: DeviceModel, as: "device", attributes: ["name", "email"] },
    ],
    order: [
      [literal(`DATE_ADD(billingDate, INTERVAL durationMonth MONTH)`), "ASC"],
    ],
  });
  return Response.json(bills);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = (await request.json()) as BillModel & { deviceId: string };

  const {
    deviceId,
    billingDate,
    planId,
    durationMonth,
    amount,
    serviceFee,
    remark,
  } = body;

  try {
    const device = await DeviceModel.findOne({
      where: { isPublic: true, id: deviceId },
    });
    if (!device)
      return Response.json({ error: "device not found" }, { status: 404 });

    const newBill = await BillModel.create(
      {
        deviceId,
        billingDate,
        planId: Number(planId),
        serviceFee: Number(serviceFee),
        durationMonth,
        amount,
        remark,
        created_by_id: user.id,
      },
      {
        include: [
          { model: User, as: "createdBy", attributes: ["email"] },
          { model: DeviceModel, as: "device", attributes: ["name", "email"] },
        ],
      }
    );

    console.log("new bill", newBill);

    await device.update({ lastBillId: newBill.id });

    return Response.json(newBill);
  } catch (error: any) {
    console.error("Error creating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
