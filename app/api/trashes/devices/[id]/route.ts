import { getUser } from "@/auth/user";
import DeviceModel from "@/models/devices";
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

  await update.update({ isPublic: false });
  await DeviceModel.update(
    { isPublic: true },
    { where: { id: update.contentId } }
  );

  return Response.json({ message: "success" });
}
