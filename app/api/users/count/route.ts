import { getUser } from "@/auth/user";
import User from "@/models/user";
import { ADMIN } from "@/roles";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (user?.role !== ADMIN)
    return Response.json({ error: "user not found" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);

  const response = await User.count({});
  return Response.json(response);
}
