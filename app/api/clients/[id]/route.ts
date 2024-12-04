import { saveRemoveData, saveUpdateData } from "@/actions/update";
import { getUser } from "@/auth/user";
import Client from "@/models/client";
import DeviceModel from "@/models/devices";
import User from "@/models/user";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const body = await request.json();
  const { id } = params;

  try {
    const [updated] = await Client.update(body, {
      where: { id },
    });

    if (updated) {
      const updatedClient = await Client.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: "createdBy",
            attributes: ["_id", "email", "name"],
          },
          {
            model: DeviceModel,
            as: "devices",
            attributes: [],
          },
        ],
      });

      if (updatedClient) {
        saveUpdateData({
          title: "Client",
          contentId: updatedClient._id,
          fromModel: "clients",
          userId: user._id,
          data: body,
        });
        return Response.json({ client: updatedClient });
      }
    }

    return Response.json({ error: "Client not found" }, { status: 404 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  try {
    const device = await Client.findByPk(params.id);
    if (!device) return Response.json({ error: "not found" }, { status: 404 });

    await device.update({ isPublic: false });

    saveRemoveData({
      title: "Client",
      contentId: device._id,
      fromModel: "clients",
      userId: user._id,
    });

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
