import { getUser } from "@/auth/user";
import Client from "@/models/client";
import Device from "@/models/devices";
import User from "@/models/user";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user)
      return Response.json({ error: "user not found" }, { status: 404 });

    if (!user.super_admin && !user.role?.permissions?.devices?.includes("read"))
      return Response.json({ error: "not allow" }, { status: 404 });

    const params = request.nextUrl.searchParams;
    const searchParams = Object.fromEntries(params);
    const { search } = searchParams;
    const page = parseInt(searchParams.page as string) || 1;
    const size = parseInt(searchParams.size as string) || 10;
    const start = (page - 1) * size;

    const where: any = { is_public: true };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Client.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "created_by",
          attributes: ["id", "email", "name"],
        },
        { model: Device, as: "devices", attributes: ["id"] },
      ],
      // attributes: {
      //   include: [[fn("COUNT", col("devices.id")), "deviceCount"]],
      // },
      // group: ["Client.id"],
      offset: start,
      limit: size,
      order: [["created_at", "DESC"]],
    });
    return Response.json({ data: rows, total: count });
  } catch (error: any) {
    console.log("error", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = await request.json();
  const { edit } = body;

  console.log("req.body", body);

  try {
    let client;

    if (edit) {
      // Update existing client
      client = await Client.findOne({
        where: { id: edit },
        include: {
          model: User,
          as: "created_by",
          attributes: ["id", "name", "username"],
        },
      });
      // Update the client's fields
      if (!client)
        return Response.json({ error: "client not found" }, { status: 404 });

      if (client) {
        await client.update(body);
      }
    } else {
      // Create new client
      client = await Client.create({ ...body, created_by_id: user.id }, {});
    }
    const response = await Client.findByPk(client.id, {
      include: {
        model: User,
        as: "created_by",
        attributes: ["id", "name", "username"],
      },
    });

    return Response.json(response);
  } catch (error: any) {
    console.error("Error creating or updating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
