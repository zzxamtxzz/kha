import { getUser } from "@/auth/user";
import Client from "@/models/client";
import TrashModel from "@/models/trashes";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();

  const update = await TrashModel.findByPk(params.id);

  if (!update)
    return Response.json({ error: "Data not found" }, { status: 404 });

  await update.update({ isPublic: false });
  await Client.update({ isPublic: true }, { where: { id: update.contentId } });

  return Response.json({ message: "success" });
}
