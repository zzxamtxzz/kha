import { saveRemoveData } from "@/actions/update";
import { getUser } from "@/auth/user";
import Client from "@/models/client";
import { ADMIN } from "@/roles";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function DELETE(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (user.role !== ADMIN)
    return Response.json({ error: "not allow!" }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const s = params.getAll("devices[]");
  console.log("s", s);
  const all = params.get("all");

  try {
    let where: any = { id: { [Op.in]: s.map(Number) } };
    if (all === "true") where = {};
    await Client.update({ is_public: false }, { where });
    const Records = await Client.findAll({ where });

    for (const data of Records) {
      await saveRemoveData({
        title: "Client",
        content_id: data.id,
        fromModel: "s",
        user_id: user.id,
      });
    }

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    console.error("Error creating Device:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
