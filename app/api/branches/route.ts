import { getUser } from "@/auth/user";
import Branch from "@/models/branch";
import Device from "@/models/devices";
import User from "@/models/user";
import { NextRequest } from "next/server";
import { Op } from "sequelize";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user)
      return Response.json({ error: "user not found" }, { status: 404 });

    if (
      !user.super_admin &&
      !user.role?.permissions?.branches?.includes("read")
    )
      return Response.json({ error: "not allow" }, { status: 404 });

    const params = request.nextUrl.searchParams;
    const searchParams = Object.fromEntries(params);
    const { search } = searchParams;
    const page = parseInt(searchParams.page as string) || 1;
    const size = parseInt(searchParams.size as string) || 10;
    const start = (page - 1) * size;

    const where: any = { is_public: true };

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { remark: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Branch.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "created_by",
          attributes: ["id", "email", "name"],
        },
        { model: Device, as: "devices", through: { attributes: [] } },
      ],
      offset: start,
      limit: size,
      order: [["created_at", "DESC"]],
    });
    return Response.json({ data: rows, total: count });
  } catch (error: any) {
    console.log("error", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  if (
    !user.super_admin &&
    !user.role?.permissions?.branches?.includes("create")
  )
    return Response.json({ error: "not allow" }, { status: 404 });

  const body = await request.json();
  const { edit } = body;

  try {
    let branch;

    if (edit) {
      // Update existing
      branch = await Branch.findByPk(edit);
      // Update the 's fields
      if (!branch)
        return Response.json({ error: "branch not found" }, { status: 404 });

      if (branch) {
        await branch.update(body);
      }
    } else {
      // Create new
      branch = await Branch.create({ ...body, created_by_id: user.id }, {});
    }
    const response = await Branch.findByPk(branch.id, {
      include: [
        {
          model: User,
          as: "created_by",
          attributes: ["id", "name", "username"],
        },
        { model: Device, as: "devices", through: { attributes: [] } },
      ],
    });

    return Response.json(response);
  } catch (error: any) {
    console.error("Error creating or updating :", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
