import { saveRemoveData, saveUpdateData } from "@/actions/update";
import { getUser } from "@/auth/user";
import Bill from "@/models/bill";
import Client from "@/models/client";
import Device from "@/models/devices";
import User from "@/models/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const response = await Device.findByPk(params.id, {
    include: [
      { model: Client, as: "client" },
      { model: User, as: "created_by", attributes: ["id", "name", "username"] },
      { model: Bill, as: "bills" },
    ],
  });
  if (!response)
    return Response.json({ message: "Device is not found" }, { status: 404 });
  return Response.json(response);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  try {
    const device = await Device.findByPk(params.id);
    if (!device) return Response.json({ error: "not found" }, { status: 404 });

    await device.update({ is_public: false });

    saveRemoveData({
      title: "Device",
      content_id: device.id,
      fromModel: "devices",
      user_id: user.id,
    });

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const body = await request.json();

  try {
    const device = await Device.findByPk(params.id, {
      include: [
        {
          model: User,
          as: "created_by",
          attributes: ["id", "name", "username"],
        },
        {
          model: Client,
          as: "client",
          attributes: ["name", "email", "id"],
        },
      ],
    });
    if (!device) return Response.json({ error: "not found" }, { status: 404 });

    saveUpdateData({
      title: "devices",
      content_id: device.id,
      fromModel: "devices",
      user_id: user.id,
      data: body,
    });

    await device.update(body);

    const response = await Device.findByPk(device.id, {
      include: [
        {
          model: User,
          as: "created_by",
          attributes: ["id", "name", "username"],
        },
        {
          model: Client,
          as: "client",
          attributes: ["name", "email", "id"],
        },
        {
          model: Bill,
          as: "lastBill",
          where: { is_public: true },
          attributes: ["billing_date", "duration_month"],
          required: false,
        },
      ],
    });

    return Response.json(response);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
