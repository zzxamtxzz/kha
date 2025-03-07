import { saveRemoveData, saveupdateData } from "@/actions/update";
import { getUser } from "@/auth/user";
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
  const response = await Device.findByPk(params.id);
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
          attributes: ["name", "email"],
        },
        {
          model: Client,
          as: "client",
          attributes: ["name", "email"],
        },
      ],
    });
    if (!device) return Response.json({ error: "not found" }, { status: 404 });

    saveupdateData({
      title: "Device",
      content_id: device.id,
      fromModel: "devices",
      user_id: user.id,
      data: body,
    });

    await device.update(body);

    return Response.json({ message: "updated" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
