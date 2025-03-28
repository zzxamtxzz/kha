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

  await update.update({ is_public: false });
  await Client.update({ is_public: true }, { where: { id: update.content_id } });

  return Response.json({ message: "success" });
}
