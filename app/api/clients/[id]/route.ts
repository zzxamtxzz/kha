import { saveRemoveData, saveupdatedData } from "@/actions/update";
import { getUser } from "@/auth/user";
import Client from "@/models/client";
import Device from "@/models/devices";
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
            as: "created_by",
            attributes: ["id", "email", "name"],
          },
          {
            model: Device,
            as: "devices",
            attributes: [],
          },
        ],
      });

      if (updatedClient) {
        saveupdatedData({
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
