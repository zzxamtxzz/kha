import { getUser } from "@/auth/user";
import Bill from "@/models/bill";
import Device from "@/models/devices";
import Plan from "@/models/plan";
import User from "@/models/user";
import { NextRequest } from "next/server";
import createEvent from "../events/create";
import Status from "@/models/statuses";
import Branch from "@/models/branch";
import { Op } from "sequelize";

const env = process.env.NODE_ENV === "development";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (!user.super_admin && !user.role?.permissions?.bills?.includes("read"))
    return Response.json({ error: "not allow" }, { status: 404 });

  // Get URL search params
  const searchParams = request.nextUrl.searchParams;
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  const where: any = { is_public: true };

  // Add date range filter if provided
  if (fromDate || toDate) {
    where.created_at = {};

    if (fromDate) {
      // Set start of day for from date
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      where.created_at[Op.gte] = from;
    }

    if (toDate) {
      // Set end of day for to date
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      where.created_at[Op.lte] = to;
    }
  }

  // Add user filter for non-admin users
  if (!user.super_admin) {
    where.created_by_id = user.id;
  }

  const { rows, count } = await Bill.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: "created_by",
        attributes: ["id", "name", "username"],
      },
      { model: Device, as: "device" },
      { model: Plan, as: "plan" },
      { model: Status, as: "status" },
      { model: Branch, as: "branch" },
    ],
    order: [["created_at", "DESC"]],
  });

  return Response.json({ data: rows, total: count });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (!user.super_admin && !user.role?.permissions?.bills?.includes("create"))
    return Response.json({ error: "not allow" }, { status: 404 });

  const body = await request.json();

  const { device_id, edit } = body;

  const data = { ...body, created_by_id: user.id };

  const device = await Device.findOne({
    where: { is_public: true, id: device_id },
  });

  if (!device)
    return Response.json({ error: "device not found" }, { status: 404 });

  let bill;
  if (edit) {
    bill = await Bill.findByPk(edit);
    if (!bill)
      return Response.json({ message: "Bill is not found" }, { status: 404 });

    await bill.update(data);

    createEvent({
      data_id: bill.id,
      event_type: "status",
      event_name: "device",
      from: user.id,
      description: `Updated bill by ${user.username}`,
      created_by_id: user.id,
    });
  } else {
    bill = await Bill.create(
      { ...data, status_id: env ? "553905483434392" : "599495935573221" },
      {
        include: [
          {
            model: User,
            as: "created_by",
            attributes: ["id", "name", "username"],
          },
          {
            model: Device,
            as: "device",
            attributes: ["first_name", "last_name", "email", "id"],
          },
        ],
      }
    );

    await device.update({ last_bill_id: bill.id });
    createEvent({
      data_id: bill.id,
      event_type: "status",
      event_name: "device",
      from: device.id,
      status_id: "553905483434392",
      description: `Created bill from ${device.email}`,
      created_by_id: user.id,
    });
  }

  if (body.branch_id) {
    await device.addBranch(body.branch_id);
  }

  const response = await Bill.findByPk(bill.id, {
    include: [
      {
        model: User,
        as: "created_by",
        attributes: ["id", "name", "username"],
      },
      { model: Device, as: "device" },
      { model: Plan, as: "plan" },
      { model: Status, as: "status" },
      { model: Branch, as: "branch" },
    ],
  });
  return Response.json(response);
}
