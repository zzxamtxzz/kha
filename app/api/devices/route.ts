import { getUser } from "@/auth/user";
import Bill from "@/models/bill";
import Client from "@/models/client";
import DeviceEmail from "@/models/device_email";
import Device from "@/models/devices";
import User from "@/models/user";
import { NextRequest } from "next/server";
import { literal, Op } from "sequelize";
import { getDeviceQuery } from "./action";
import Branch from "@/models/branch";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 401 });

  if (!user.super_admin && !user.role?.permissions?.devices?.includes("read"))
    return Response.json({ error: "not allow" }, { status: 401 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const { page = 1, size = 10, expired, branch } = searchParams;
  const limit = Number(size);
  const offset = (Number(page) - 1) * Number(size);

  const where: any = getDeviceQuery({ user, searchParams });

  console.log("branch_id", branch);
  const include = [
    { model: User, as: "created_by", attributes: ["id", "name", "username"] },
    {
      model: Client,
      as: "client",
      attributes: ["name", "email", "id"],
    },
    {
      model: Bill,
      as: "lastBill",
      where: { is_public: true },
      attributes: ["billing_date", "duration_month"],
      required: false,
    },
  ];

  if (branch) {
    include.push({
      model: Branch,
      as: "branches",
      where: { id: branch },
      through: { attributes: [] },
      required: branch ? true : false,
    });
  }
  const query: any = {
    where,
    offset,
    limit,
    include,
    order: [
      !branch
        ? [literal("COALESCE(`lastBill`.`billing_date`, '9999-12-31')"), "ASC"]
        : ["created_at", "DESC"],
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
        attributes: ["id", "name", "username"],
      },
      {
        model: Client,
        as: "client",
        attributes: ["name", "email", "id"],
      },
      {
        model: Bill,
        as: "lastBill",
        attributes: ["billing_date", "duration_month", "id"],
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

  if (!user.super_admin && !user.role?.permissions?.devices?.includes("create"))
    return Response.json({ error: "not allow" }, { status: 404 });

  const body = await request.json();
  const { edit } = body;

  try {
    let exist = null;
    if (edit) exist = await Device.findByPk(edit);

    if (exist) {
      exist = await exist.update(body);
    } else {
      exist = await Device.create({ ...body, created_by_id: user.id });
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

    if (body.branch_id) {
      await exist.addBranch(body.branch_id);
    }

    const response = await Device.findByPk(exist.id, {
      include: [
        {
          model: User,
          as: "created_by",
          attributes: ["id", "name", "username"],
        },
        { model: Client, as: "client", attributes: ["id", "name", "email"] },
        {
          model: Bill,
          as: "lastBill",
          attributes: ["billing_date", "duration_month"],
        },
      ],
    });

    return Response.json(response);
  } catch (error: any) {
    console.error("Error creating or updating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
