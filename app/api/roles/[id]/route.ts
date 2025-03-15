import { getUser } from "@/auth/user";
import Role from "@/models/role";
import User from "@/models/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });

  const response = await Role.findByPk(params.id, {
    include: [{ model: User, as: "created_by", attributes: ["name"] }],
  });

  return Response.json(response);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });

  const response = await Role.findByPk(params.id);
  if (!response)
    return Response.json({ message: "Role is not found" }, { status: 404 });

  await response.update({ is_public: false });

  return Response.json(response);
}
