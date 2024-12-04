import { getUser } from "@/auth/user";
import { ADMIN } from "@/roles";
import { NextRequest } from "next/server";
import { createUser } from "../../../actions/user";
import User from "@/models/user";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (user?.role !== ADMIN)
    return Response.json({ error: "user not found" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const { page = 1, size = 10, search, expired } = searchParams;

  const limit = Number(size);
  const offset = (Number(page) - 1) * Number(size);

  const response = await User.findAll({ offset, limit });
  return Response.json(response);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (user?.role !== ADMIN)
    return Response.json({ error: "user not found" }, { status: 404 });

  const body = await request.json();
  console.log(body);
  try {
    const newUser = await createUser(body);
    return Response.json(newUser);
  } catch (error: any) {
    console.error("Error creating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
