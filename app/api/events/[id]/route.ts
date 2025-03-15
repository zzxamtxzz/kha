import { getUser } from "@/auth/user";
import EventTracking from "@/models/events";
import Status from "@/models/statuses";
import User from "@/models/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const p = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(p);
  const page = parseInt(searchParams.page as string) || 1;
  const size = parseInt(searchParams.size as string) || 10;
  const start = (page - 1) * size;

  const { count, rows } = await EventTracking.findAndCountAll({
    where: { data_id: params.id },
    include: [
      { model: User, as: "created_by", attributes: ["id", "name", "username"] },
      { model: Status, as: "status" },
    ],
    order: [["created_at", "DESC"]],
    offset: start,
    limit: size,
  });

  return Response.json({ total: count, data: rows });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  try {
    const body = await request.json();
    const event = await EventTracking.create({
      ...body,
      data_id: params.id,
      event_type: "comment",
      event_name: "comment",
      from: user.id,
      created_by_id: user.id,
    });
    const response = await EventTracking.findByPk(event.id, {
      include: [
        {
          model: User,
          as: "created_by",
          attributes: ["id", "name", "username"],
        },
      ],
    });
    return Response.json(response);
  } catch (error: any) {
    console.log("error", error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
