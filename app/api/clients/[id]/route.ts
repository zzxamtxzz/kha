import { saveRemoveData, saveUpdateData } from "@/actions/update";
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
  const response = await Client.findByPk(params.id, {
    include: [
      { model: User, as: "created_by", attributes: ["id", "name", "username"] },
      {
        model: Device,
        as: "devices",
        attributes: ["id", "first_name", "last_name", "email"],
      },
    ],
  });
  if (!response)
    return Response.json({ message: "Client is not found" }, { status: 404 });
  return Response.json(response);
}

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
            as: "created_by",
            attributes: ["id", "name", "username"],
          },
          {
            model: Device,
            as: "devices",
            attributes: [],
          },
        ],
      });

      if (updatedClient) {
        saveUpdateData({
          title: "Client",
          content_id: updatedClient.id,
          fromModel: "clients",
          user_id: user.id,
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

    await device.update({ is_public: false });

    saveRemoveData({
      title: "Client",
      content_id: device.id,
      fromModel: "clients",
      user_id: user.id,
    });

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
