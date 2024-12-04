import Client from "@/models/client";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const { search } = searchParams;

  const where: any = { isPublic: true };

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const count = await Client.count({ where });

  return Response.json(count);
}
