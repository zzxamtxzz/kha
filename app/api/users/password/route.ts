import { getUser } from "@/auth/user";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });

  const exist = await User.findOne({
    where: { id: user.id, password: { [Op.ne]: null } },
    attributes: ["id", "password"],
  });

  return Response.json(exist ? true : false);
}

export async function PUT(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });

  const body = await request.json();
  const { oldPassword, password } = body;
  const data = await User.findByPk(user.id, {
    attributes: ["id", "password"],
  });

  if (!data)
    return Response.json({ error: "employee is not found" }, { status: 404 });

  if (data.password) {
    const isMatch = await bcrypt.compare(oldPassword, data.password);
    if (!isMatch) {
      return Response.json({ error: "password do not match" }, { status: 401 });
    }
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  await User.update({ password: hashedPassword }, { where: { id: user.id } });

  return Response.json({ message: "successfully changed your password." });
}
