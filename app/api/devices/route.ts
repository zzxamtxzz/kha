import { getUser } from "@/auth/user";
import BillModel from "@/models/bill";
import Client from "@/models/client";
import Device from "@/models/devices";
import User from "@/models/user";
import { actions, ADMIN, roles } from "@/roles";
import { NextRequest } from "next/server";
import { literal, Op } from "sequelize";
import { getDeviceQuery } from "./action";

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
      { model: Client, as: "client", attributes: ["name", "email"] },
      {
        model: BillModel,
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
            literal(`billing_date + INTERVAL duration_month MONTH <= '${month}'`),
          ],
        },
      };
    }

    query.include = [
      { model: User, as: "created_by", attributes: ["name", "email"] },
      { model: Client, as: "client", attributes: ["name", "email"] },
      {
        model: BillModel,
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

  const {
    id,
    email,
    name,
    client_id,
    device_serial,
    account_number,
    kit_number,
    fee,
    remark,
  } = body;

  const include = [
    { model: User, as: "created_by", attributes: ["name", "email"] },
    { model: Client, as: "client", attributes: ["name", "email"] },
    {
      model: BillModel,
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

    let newClient;
    if (exist) {
      newClient = await exist.update({
        name,
        client_id: Number(client_id),
        device_serial,
        account_number,
        kit_number,
        fee: Number(fee),
        remark,
        created_by_id: user.id,
      });
    } else {
      newClient = await Device.create(
        {
          email,
          name,
          client_id: Number(client_id),
          device_serial,
          account_number,
          kit_number,
          fee: Number(fee),
          remark,
          created_by_id: user.id,
        },
        { include }
      );
    }

    return Response.json(newClient);
  } catch (error: any) {
    console.error("Error creating or updating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// reduce code
// export async function GET(request: NextRequest) {
//   const { searchParams } = request.nextUrl;
//   const {
//     page = 1,
//     size = 10,
//     search,
//     expired,
//   } = Object.fromEntries(searchParams);

//   const limit = Number(size);
//   const offset = (Number(page) - 1) * limit;

//   const where: any = { is_public: true };

//   if (search) {
//     where[Op.or] = [
//       { name: { [Op.like]: `%${search}%` } },
//       { email: { [Op.like]: `%${search}%` } },
//     ];
//   }

//   const include = [
//     { model: User, as: "created_by", attributes: ["name", "email"] },
//     { model: Client, as: "client", attributes: ["name", "email"] },
//     {
//       model: BillModel,
//       as: "lastBill",
//       attributes: ["billing_date", "duration_month"],
//     },
//   ];

//   if (expired) {
//     const currentDate = new Date();
//     const oneMonthFromNow = new Date();
//     oneMonthFromNow.setMonth(currentDate.getMonth() + Number(expired));

//     const month = oneMonthFromNow.toISOString().split("T")[0];
//     const expiredWhere = {
//       [Op.and]: [
//         literal(`billing_date + INTERVAL duration_month MONTH > NOW()`),
//         literal(`billing_date + INTERVAL duration_month MONTH <= '${month}'`),
//       ],
//     };

//     include[2].where = expiredWhere;
//   }

//   const query = {
//     where,
//     limit,
//     offset,
//     include,
//     order: [
//       [literal("COALESCE(`lastBill`.`billing_date`, '9999-12-31')"), "ASC"],
//       ["created_at", "DESC"],
//     ],
//   };

//   const devices = await Device.findAll(query);
//   return Response.json(devices);
// }
