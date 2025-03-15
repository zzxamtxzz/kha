import { saveRemoveData, saveUpdateData } from "@/actions/update";
import { getUser } from "@/auth/user";
import Branch from "@/models/branch";
import User from "@/models/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const response = await Branch.findByPk(params.id, {
    include: [
      { model: User, as: "created_by", attributes: ["id", "name", "username"] },
    ],
  });
  if (!response)
    return Response.json({ message: "Branch is not found" }, { status: 404 });
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
    const [updated] = await Branch.update(body, {
      where: { id },
    });

    if (updated) {
      const updatedClient = await Branch.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: "created_by",
            attributes: ["id", "name", "username"],
          },
        ],
      });

      if (updatedClient) {
        saveUpdateData({
          title: "Branch",
          content_id: updatedClient.id,
          fromModel: "branches",
          user_id: user.id,
          data: body,
        });
        return Response.json({ client: updatedClient });
      }
    }

    return Response.json({ error: "Branch id not found" }, { status: 404 });
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
    const device = await Branch.findByPk(params.id);
    if (!device) return Response.json({ error: "not found" }, { status: 404 });

    await device.update({ is_public: false });

    saveRemoveData({
      title: "Branch",
      content_id: device.id,
      fromModel: "branches",
      user_id: user.id,
    });

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
