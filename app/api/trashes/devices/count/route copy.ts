import { getUser } from "@/auth/user";
import TrashModel from "@/models/trashes";
import { ADMIN } from "@/roles";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (user?.role !== ADMIN)
    return Response.json({ error: "user not found" }, { status: 404 });

  const response = await TrashModel.count({
    where: { isPublic: true, fromModel: "devices" },
  });
  return Response.json(response);
}
