import { saveRemoveData } from "@/actions/update";
import { getUser } from "@/auth/user";
import DeviceModel from "@/models/devices";
import { ADMIN } from "@/roles";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function DELETE(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (user.role !== ADMIN)
    return Response.json({ error: "not allow!" }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const devices = params.getAll("devices[]");
  const all = params.get("all");

  try {
    let where: any = { _id: { [Op.in]: devices.map(Number) } };
    if (all === "true") where = {};
    await DeviceModel.update({ isPublic: false }, { where });
    const deviceRecords = await DeviceModel.findAll({ where });

    console.log("device records", deviceRecords);

    for (const device of deviceRecords) {
      await saveRemoveData({
        title: "Device",
        contentId: device._id,
        fromModel: "devices",
        userId: user._id,
      });
    }

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    console.error("Error creating DeviceModel:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
