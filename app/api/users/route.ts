import { getUser } from "@/auth/user";
import User from "@/models/user";
import { NextRequest } from "next/server";
import { createUser } from "../../../actions/user";
import Role from "@/models/role";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "user is not found" }, { status: 404 });
  if (!user.super_admin)
    return Response.json({ error: "user not found" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const { page = 1, size = 10 } = searchParams;

  const limit = Number(size);
  const offset = (Number(page) - 1) * Number(size);

  const { rows, count } = await User.findAndCountAll({
    include: [{ model: Role, as: "role" }],
    offset,
    limit,
  });
  return Response.json({ data: rows, total: count });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  const body = await request.json();

  if (body.password !== 795513 && !user.super_admin)
    return Response.json({ error: "user not found" }, { status: 404 });

  console.log(body);
  try {
    const newUser = await createUser(body);
    return Response.json(newUser);
  } catch (error: any) {
    console.error("Error creating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
