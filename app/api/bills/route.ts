import { getUser } from "@/auth/user";
import Bill from "@/models/bill";
import Plan from "@/models/billplan";
import Device from "@/models/devices";
import User from "@/models/user";
import { NextRequest } from "next/server";
import { literal } from "sequelize";
import createEvent from "../events/create";

export async function GET(request: NextRequest) {
  const { rows, count } = await Bill.findAndCountAll({
    where: { is_public: true },
    include: [
      { model: User, as: "created_by", attributes: { exclude: ["password"] } },
      { model: Device, as: "device" },
      { model: Plan, as: "plan" },
    ],
    order: [
      // [literal(`DATE_ADD(billing_date, INTERVAL duration_month MONTH)`), "ASC"],
      ["created_at", "DESC"],
    ],
  });
  return Response.json({ data: rows, total: count });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = await request.json();

  const { device_id, edit } = body;

  const data = { ...body, created_by_id: user.id };

  try {
    const device = await Device.findOne({
      where: { is_public: true, id: device_id },
    });
    if (!device)
      return Response.json({ error: "device not found" }, { status: 404 });

    let bill;
    if (edit) {
      bill = await Bill.findByPk(edit);
      if (!bill)
        return Response.json({ message: "Bill is not found" }, { status: 404 });

      await bill.update(data);

      createEvent({
        data_id: bill.id,
        event_type: "status",
        event_name: "device",
        from: device.id,
        status: "New",
        description: `Created bill from ${device.email}`,
        created_by_id: user.id,
      });
    } else {
      bill = await Bill.create(data, {
        include: [
          { model: User, as: "created_by", attributes: ["email"] },
          { model: Device, as: "device", attributes: ["name", "email"] },
        ],
      });

      await device.update({ last_bill_id: bill.id });
      createEvent({
        data_id: bill.id,
        event_type: "status",
        event_name: "device",
        from: device.id,
        status: "New",
        description: `Created bill from ${device.email}`,
        created_by_id: user.id,
      });
    }

    const response = await Bill.findByPk(bill.id, {
      include: [
        {
          model: User,
          as: "created_by",
          attributes: { exclude: ["password"] },
        },
        { model: Device, as: "device" },
        { model: Plan, as: "plan" },
      ],
    });
    return Response.json(response);
  } catch (error: any) {
    console.error("Error creating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
