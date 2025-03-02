import { saveRemoveData, saveUpdateData } from "@/actions/update";
import { getUser } from "@/auth/user";
import Client from "@/models/client";
import DeviceModel from "@/models/devices";
import User from "@/models/user";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  try {
    const device = await DeviceModel.findByPk(params.id);
    if (!device) return Response.json({ error: "not found" }, { status: 404 });

    await device.update({ isPublic: false });

    saveRemoveData({
      title: "Device",
      contentId: device.id,
      fromModel: "devices",
      userId: user.id,
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
    const device = await DeviceModel.findByPk(params.id, {
      include: [
        {
          model: User,
          as: "createdBy",
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

    saveUpdateData({
      title: "Device",
      contentId: device.id,
      fromModel: "devices",
      userId: user.id,
      data: body,
    });

    await device.update(body);

    return Response.json({ message: "updated" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
