import createEvent from "@/app/api/events/create";
import { getUser } from "@/auth/user";
import Bill from "@/models/bill";
import Currency from "@/models/currency";
import Device from "@/models/devices";
import Plan from "@/models/plan";
import Status from "@/models/statuses";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (!user.super_admin && !user.role?.permissions?.bills?.includes("update"))
    return Response.json({ error: "not allow" }, { status: 404 });
  const body = await request.json();
  const bill = await Bill.findByPk(params.id);
  if (!bill)
    return Response.json({ error: "bill is not found" }, { status: 404 });
  await bill.update({ status_id: body.status_id });

  const event = await createEvent({
    data_id: bill.id,
    event_type: "status",
    event_name: "device",
    from: bill.id,
    status_id: body.status_id,
    description: ``,
    created_by_id: user.id,
  });

  const response = await Bill.findByPk(params.id, {
    include: [
      { model: Device, as: "device" },
      { model: Plan, as: "plan" },
      { model: Currency, as: "currency" },
      { model: Status, as: "status" },
    ],
  });

  if (!response)
    return Response.json({ message: "Bill is not found" }, { status: 404 });
  return Response.json(event);
}
