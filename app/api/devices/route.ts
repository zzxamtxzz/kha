import { getUser } from "@/auth/user";
import BillModel from "@/models/bill";
import Client from "@/models/client";
import DeviceModel from "@/models/devices";
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
      { model: User, as: "createdBy", attributes: ["name", "email"] },
      { model: Client, as: "client", attributes: ["name", "email"] },
      {
        model: BillModel,
        as: "lastBill",
        attributes: ["billingDate", "durationMonth"],
      },
    ],
    order: [
      [literal("COALESCE(`lastBill`.`billingDate`, '9999-12-31')"), "ASC"],
      ["createdAt", "DESC"],
    ],
  };

  if (expired) {
    const currentDate = new Date();
    const oneMonthFromNow = new Date();
    let where: any = {
      where: literal(`billingDate + INTERVAL durationMonth MONTH < NOW()`),
    };

    if (!isNaN(Number(expired))) {
      oneMonthFromNow.setMonth(currentDate.getMonth() + Number(expired));
      const month = oneMonthFromNow.toISOString().split("T")[0];
      where = {
        where: {
          [Op.and]: [
            literal(`billingDate + INTERVAL durationMonth MONTH > NOW()`),
            literal(`billingDate + INTERVAL durationMonth MONTH <= '${month}'`),
          ],
        },
      };
    }

    query.include = [
      { model: User, as: "createdBy", attributes: ["name", "email"] },
      { model: Client, as: "client", attributes: ["name", "email"] },
      {
        model: BillModel,
        as: "lastBill",
        attributes: ["billingDate", "durationMonth"],
        where,
      },
    ];
  }

  const devices = await DeviceModel.findAll(query);

  return Response.json(devices);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const body = await request.json();

  const {
    _id,
    email,
    name,
    clientId,
    deviceSerial,
    accNo,
    kitNo,
    serviceFee,
    remark,
  } = body;

  const include = [
    { model: User, as: "createdBy", attributes: ["name", "email"] },
    { model: Client, as: "client", attributes: ["name", "email"] },
    {
      model: BillModel,
      as: "lastBill",
      attributes: ["billingDate", "durationMonth"],
    },
  ];

  try {
    let exist = null;
    if (_id)
      exist = await DeviceModel.findOne({
        where: { _id },
        include,
      });

    let newClient;
    if (exist) {
      newClient = await exist.update({
        name,
        clientId: Number(clientId),
        deviceSerial,
        accNo,
        kitNo,
        serviceFee: Number(serviceFee),
        remark,
        createdById: user._id,
      });
    } else {
      newClient = await DeviceModel.create(
        {
          email,
          name,
          clientId: Number(clientId),
          deviceSerial,
          accNo,
          kitNo,
          serviceFee: Number(serviceFee),
          remark,
          createdById: user._id,
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

//   const where: any = { isPublic: true };

//   if (search) {
//     where[Op.or] = [
//       { name: { [Op.like]: `%${search}%` } },
//       { email: { [Op.like]: `%${search}%` } },
//     ];
//   }

//   const include = [
//     { model: User, as: "createdBy", attributes: ["name", "email"] },
//     { model: Client, as: "client", attributes: ["name", "email"] },
//     {
//       model: BillModel,
//       as: "lastBill",
//       attributes: ["billingDate", "durationMonth"],
//     },
//   ];

//   if (expired) {
//     const currentDate = new Date();
//     const oneMonthFromNow = new Date();
//     oneMonthFromNow.setMonth(currentDate.getMonth() + Number(expired));

//     const month = oneMonthFromNow.toISOString().split("T")[0];
//     const expiredWhere = {
//       [Op.and]: [
//         literal(`billingDate + INTERVAL durationMonth MONTH > NOW()`),
//         literal(`billingDate + INTERVAL durationMonth MONTH <= '${month}'`),
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
//       [literal("COALESCE(`lastBill`.`billingDate`, '9999-12-31')"), "ASC"],
//       ["createdAt", "DESC"],
//     ],
//   };

//   const devices = await DeviceModel.findAll(query);
//   return Response.json(devices);
// }
