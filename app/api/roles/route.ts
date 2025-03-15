import { getUser } from "@/auth/user";
import Role from "@/models/role";
import User from "@/models/user";
import { modules } from "@/utils/name";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") as string) || 1;
  const size = parseInt(searchParams.get("size") as string) || 10;
  const start = (page - 1) * size;

  let { count, rows } = await Role.findAndCountAll({
    where: { is_public: true },
    include: [{ model: User, as: "created_by", attributes: ["name"] }],
    offset: start,
    limit: size,
  });

  return Response.json({ total: count, data: rows });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User is not found!" }, { status: 404 });

  const body = await request.json();

  let data = { ...body };

  modules.forEach((n) => (data[n] = body.home?.includes(n)));

  data = {
    ...data,
    created_by_id: user.id,
    name: body.name,
    description: body.description,
  };

  let model;
  if (body.edit) {
    // Update existing role
    model = await Role.findOne({ where: { id: body.edit } });
    if (!model)
      return Response.json({ error: "Role is not found!" }, { status: 404 });

    await model.update(data);
  } else {
    // Create new role

    const exist = await Role.findOne({
      where: { name: body.name },
    });
    if (exist)
      return Response.json(
        { error: "already exist this role name" },
        { status: 400 }
      );
    model = await Role.create(data);
  }

  return Response.json(model);
}
