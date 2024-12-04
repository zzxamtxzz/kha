import BillModel from "@/models/bill";
import DeviceModel from "@/models/devices";
import { NextRequest } from "next/server";
import { literal, Op } from "sequelize";
import { getDeviceQuery } from "../action";
import { getUser } from "@/auth/user";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const { search, expired } = searchParams;

  const where: any = getDeviceQuery({ user, searchParams });

  const query: any = {
    where,
    include: [
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
      {
        model: BillModel,
        as: "lastBill",
        attributes: ["billingDate", "durationMonth"],
        where,
      },
    ];
  }

  const devices = await DeviceModel.count(query);

  return Response.json(devices);
}
