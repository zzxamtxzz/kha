import { getUser } from "@/auth/user";
import TableColumn from "@/models/column";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();
  return Response.json({ name: "table get" });
}

export async function POST(request: NextRequest) {
  const user = await getUser();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await request.json();
  const { title, column } = body;

  let response = await TableColumn.findOne({
    where: { user: user.id, title: body.title },
  });

  console.log("body", body);

  if (response) {
    response = await response.update({ title, columns: column });
  } else {
    response = await TableColumn.create({
      user: user.id,
      title: body.title,
      columns: column,
    });
  }

  return NextResponse.json(response);
}
