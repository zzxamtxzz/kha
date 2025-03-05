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
  const clients = params.getAll("devices[]");
  console.log("clients", clients);
  const all = params.get("all");

  try {
    let where: any = { id: { [Op.in]: clients.map(Number) } };
    if (all === "true") where = {};
    await Client.update({ is_public: false }, { where });
    const clientRecords = await Client.findAll({ where });

    for (const client of clientRecords) {
      await saveRemoveData({
        title: "Client",
        content_id: client.id,
        fromModel: "clients",
        user_id: user.id,
      });
    }

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    console.error("Error creating Device:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
