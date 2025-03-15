import { getUser } from "@/auth/user";
import Status from "@/models/statuses";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (
    !user.super_admin &&
    !user.role?.permissions?.currencies?.includes("read")
  )
    return Response.json({ error: "not allow" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const { search, trashes } = searchParams;

  const where: any = { is_public: trashes ? false : true };

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { group: { [Op.like]: `%${search}%` } },
    ];
  }

  const { rows, count } = await Status.findAndCountAll({
    where,
    order: [["created_at", "DESC"]],
  });

  return Response.json({ data: rows, total: count });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (!user.super_admin)
    return Response.json({ error: "not allow" }, { status: 404 });

  const body = await request.json();

  const { edit } = body;

  let data;
  try {
    if (edit) {
      data = await Status.findByPk(edit);
      if (!data)
        return Response.json(
          { message: "Currency is not found" },
          { status: 404 }
        );
      await data.update(body);
    } else {
      data = await Status.create({ ...body, created_by_id: user.id });
    }

    return Response.json(data);
  } catch (error: any) {
    console.error("Error creating plan:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
