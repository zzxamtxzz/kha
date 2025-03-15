import Bill from "@/models/bill";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const { rows, count } = await Bill.findAndCountAll({
    where: { is_public: true, remark: { [Op.like]: `%${search}%` } },
    limit: 5,
  });
  return Response.json({ data: rows.map((b) => b.remark), total: count });
}
