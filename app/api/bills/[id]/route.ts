import { getUser } from "@/auth/user";
import Bill from "@/models/bill";
import Branch from "@/models/branch";
import Currency from "@/models/currency";
import Device from "@/models/devices";
import Plan from "@/models/plan";
import Status from "@/models/statuses";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (!user.super_admin && !user.role?.permissions?.bills?.includes("read"))
    return Response.json({ error: "not allow" }, { status: 404 });

  const response = await Bill.findByPk(params.id, {
    include: [
      { model: Device, as: "device" },
      { model: Plan, as: "plan" },
      { model: Currency, as: "currency" },
      { model: Status, as: "status" },
      { model: Branch, as: "branch" },
    ],
  });
  console.log("repsonse", response?.toJSON());

  if (!response)
    return Response.json({ message: "Bill is not found" }, { status: 404 });
  return Response.json(response);
}

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
  await bill.update(body);

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
  return Response.json(response);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (!user.super_admin && !user.role?.permissions?.bills?.includes("delete"))
    return Response.json({ error: "not allow" }, { status: 404 });

  try {
    await Bill.update(
      { is_public: false },
      {
        where: { id: params.id },
      }
    );

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    console.error("Error creating Device:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
