import { createUser } from "@/actions/user";
import { getUser } from "@/auth/user";
import Client from "@/models/client";
import User from "@/models/user";
import { actions, ADMIN, roles } from "@/roles";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.devices.includes(actions.READ))
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
      { first_name: { [Op.like]: `%${search}%` } },
      { last_name: { [Op.like]: `%${search}%` } },
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
      // {
      //   model: Device,
      //   as: "devices",
      //   attributes: [],
      //   required: false,
      // },
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
          attributes: ["id", "email"],
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
      client = await Client.create(body, {});
    }
    const response = await Client.findByPk(client.id, {
      include: {
        model: User,
        as: "created_by",
        attributes: ["id", "email"],
      },
    });

    return Response.json(response);
  } catch (error: any) {
    console.error("Error creating or updating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
