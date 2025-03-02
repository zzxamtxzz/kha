import { saveUpdateData } from "@/actions/update";
import { getUser } from "@/auth/user";
import User from "@/models/user";
import { ADMIN } from "@/roles";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (ADMIN !== user.role)
    return Response.json({ error: "not allow" }, { status: 401 });

  try {
    const user = await User.findByPk(params.id);
    if (!user) return Response.json({ error: "not found" }, { status: 404 });

    const body = await request.json();

    await user.update(body);

    saveUpdateData({
      title: "User",
      contentId: user.id,
      fromModel: "users",
      userId: user.id,
      data: body,
    });
    return Response.json({ message: "updated" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
