import { getUser } from "@/auth/user";
import PlanModel from "@/models/billplan";
import { actions, ADMIN, roles } from "@/roles";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.devices.includes(actions.READ))
    return Response.json({ error: "not allow" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const { search, trashes } = searchParams;

  const where: any = { isPublic: trashes ? false : true };

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const plans = await PlanModel.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });

  return Response.json(plans);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = (await request.json()) as PlanModel;

  const { name, serviceFee, amountInPerMonth, remark } = body;

  try {
    const newPlan = await PlanModel.create({
      name,
      serviceFee: Number(serviceFee),
      amountInPerMonth,
      remark,
      created_by_id: user.id,
    });

    return Response.json(newPlan);
  } catch (error: any) {
    console.error("Error creating plan:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
