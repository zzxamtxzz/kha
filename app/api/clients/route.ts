import { createUser } from "@/actions/user";
import { getUser } from "@/auth/user";
import Client from "@/models/client";
import DeviceModel from "@/models/devices";
import User from "@/models/user";
import { actions, ADMIN, roles } from "@/roles";
import { NextRequest } from "next/server";
import { col, fn, Op } from "sequelize";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.devices.includes(actions.READ))
    return Response.json({ error: "not allow" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const { search, trashes } = searchParams;

  const where: any = { isPublic: trashes ? false : true };

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const clients = await Client.findAll({
    where,
    include: [
      {
        model: User,
        as: "createdBy",
        attributes: ["_id", "email", "name"],
      },
      {
        model: DeviceModel,
        as: "devices",
        attributes: [],
      },
    ],
    attributes: {
      include: [[fn("COUNT", col("devices._id")), "deviceCount"]],
    },
    group: ["Client._id"],
    order: [["createdAt", "DESC"]],
  });

  return Response.json(clients);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = await request.json();
  const { email, name, remark, edit } = body; // Assuming clientId is provided for editing

  console.log("req.body", body);

  try {
    let client;

    if (edit) {
      // Update existing client
      client = await Client.findOne({
        where: { _id: edit },
        include: {
          model: User,
          as: "createdBy",
          attributes: ["_id", "email"],
        },
      });
      // Update the client's fields
      if (!client)
        return Response.json({ error: "client not found" }, { status: 404 });

      if (client) {
        client.email = email;
        client.name = name;
        client.remark = remark;
        await client.save();
      }
    } else {
      // Create new client
      client = await Client.create(
        {
          email,
          name,
          remark,
          createdById: user._id,
        },
        {
          include: {
            model: User,
            as: "createdBy",
            attributes: ["_id", "email"],
          },
        }
      );
      await createUser({ ...body, clientId: client._id });
    }

    return Response.json(client);
  } catch (error: any) {
    console.error("Error creating or updating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
