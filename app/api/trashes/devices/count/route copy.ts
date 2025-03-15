import { getUser } from "@/auth/user";
import TrashModel from "@/models/trashes";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user.super_admin)
    return Response.json({ error: "user not found" }, { status: 404 });

  const response = await TrashModel.count({
    where: { is_public: true, fromModel: "devices" },
  });
  return Response.json(response);
}
