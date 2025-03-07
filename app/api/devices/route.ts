import { getUser } from "@/auth/user";
import Bill from "@/models/bill";
import Client from "@/models/client";
import Device from "@/models/devices";
import User from "@/models/user";
import { actions, ADMIN, roles } from "@/roles";
import { NextRequest } from "next/server";
import { literal, Op } from "sequelize";
import { getDeviceQuery } from "./action";
import DeviceEmail from "@/models/device_email";
import Plan from "@/models/billplan";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.devices.includes(actions.READ))
    return Response.json({ error: "not allow" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const { page = 1, size = 10, search, expired } = searchParams;

  const limit = Number(size);
  const offset = (Number(page) - 1) * Number(size);

  const where: any = getDeviceQuery({ user, searchParams });

  const query: any = {
    where,
    offset,
    limit,
    include: [
      { model: User, as: "created_by", attributes: ["name", "email"] },
      {
        model: Client,
        as: "client",
        attributes: ["name", "first_name", "last_name", "email"],
      },
      {
        model: Bill,
        as: "lastBill",
        attributes: ["billing_date", "duration_month"],
      },
    ],
    order: [
      [literal("COALESCE(`lastBill`.`billing_date`, '9999-12-31')"), "ASC"],
      ["created_at", "DESC"],
    ],
  };

  if (expired) {
    const currentDate = new Date();
    const oneMonthFromNow = new Date();
    let where: any = {
      where: literal(`billing_date + INTERVAL duration_month MONTH < NOW()`),
    };

    if (!isNaN(Number(expired))) {
      oneMonthFromNow.setMonth(currentDate.getMonth() + Number(expired));
      const month = oneMonthFromNow.toISOString().split("T")[0];
      where = {
        where: {
          [Op.and]: [
            literal(`billing_date + INTERVAL duration_month MONTH > NOW()`),
            literal(
              `billing_date + INTERVAL duration_month MONTH <= '${month}'`
            ),
          ],
        },
      };
    }

    query.include = [
      {
        model: User,
        as: "created_by",
        attributes: ["name", "email", "id", "username"],
      },
      {
        model: Plan,
        as: "plan",
        attributes: ["name", "id", "amount"],
      },
      {
        model: Client,
        as: "client",
        attributes: ["name", "first_name", "last_name", "email"],
      },
      {
        model: Bill,
        as: "lastBill",
        attributes: ["billing_date", "duration_month"],
        where,
      },
    ];
  }

  const { count, rows } = await Device.findAndCountAll(query);

  return Response.json({ total: count, data: rows });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const body = await request.json();
  const { id } = body;

  const include = [
    { model: User, as: "created_by", attributes: ["name", "email"] },
    { model: Client, as: "client", attributes: ["name", "email"] },
    {
      model: Bill,
      as: "lastBill",
      attributes: ["billing_date", "duration_month"],
    },
  ];

  try {
    let exist = null;
    if (id)
      exist = await Device.findOne({
        where: { id },
        include,
      });

    if (exist) {
      exist = await exist.update(body);
    } else {
      exist = await Device.create(
        { ...body, created_by_id: user.id },
        { include }
      );
    }

    if (body.emails) {
      await DeviceEmail.destroy({ where: { device_id: exist.id } });

      // Create new DeviceEmail entries for each email
      const emailEntries = body.emails.map((email: string) => ({
        device_id: exist.id,
        email,
      }));
      await DeviceEmail.bulkCreate(emailEntries);
    }

    return Response.json(exist);
  } catch (error: any) {
    console.error("Error creating or updating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
