import { getUser } from "@/auth/user";
import Device from "@/models/devices";
import TrashModel from "@/models/trashes";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const update = await TrashModel.findByPk(params.id);

  if (!update)
    return Response.json({ error: "Data not found" }, { status: 404 });

  await update.update({ is_public: false });
  await Device.update(
    { is_public: true },
    { where: { id: update.content_id } }
  );

  return Response.json({ message: "success" });
}
