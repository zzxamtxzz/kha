import { saveUpdateData } from "@/actions/update";
import { getUser } from "@/auth/user";
import Role from "@/models/role";
import User from "@/models/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const response = await User.findByPk(params.id, {
    include: [
      { model: User, as: "created_by", attributes: ["id", "name", "username"] },
      { model: Role, as: "role" },
    ],
  });
  if (!response)
    return Response.json({ message: "User is not found" }, { status: 404 });
  return Response.json(response);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (!user.super_admin)
    return Response.json({ error: "not allow" }, { status: 401 });

  try {
    const user = await User.findByPk(params.id);
    if (!user) return Response.json({ error: "not found" }, { status: 404 });

    const body = await request.json();

    await user.update(body);

    saveUpdateData({
      title: "User",
      content_id: user.id,
      fromModel: "users",
      user_id: user.id,
      data: body,
    });
    return Response.json({ message: "updated" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
