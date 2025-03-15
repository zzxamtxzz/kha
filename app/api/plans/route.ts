import { getUser } from "@/auth/user";
import Currency from "@/models/currency";
import Plan from "@/models/plan";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (!user.super_admin && !user.role?.permissions?.plans?.includes("read"))
    return Response.json({ error: "not allow" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const { search } = searchParams;

  const where: any = { is_public: true };

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { remark: { [Op.like]: `%${search}%` } },
    ];
  }

  const { rows, count } = await Plan.findAndCountAll({
    where,
    order: [["created_at", "DESC"]],
    include: [{ model: Currency, as: "currency" }],
  });

  return Response.json({ data: rows, total: count });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  if (
    !user.super_admin &&
    !user.role?.permissions?.plans?.includes("create") &&
    !user.role?.permissions?.plans?.includes("update")
  )
    return Response.json({ error: "not allow" }, { status: 404 });

  const body = await request.json();

  let plan;
  try {
    if (body.edit) {
      plan = await Plan.findByPk(body.edit);
      if (!plan)
        return Response.json({ error: "Plan is not found" }, { status: 404 });
      await plan.update(body);
    } else {
      plan = await Plan.create({ ...body, created_by_id: user.id });
    }

    return Response.json(plan);
  } catch (error: any) {
    console.error("Error creating plan:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
