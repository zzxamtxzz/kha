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
  const { title, columns } = body;

  let response = await TableColumn.findOne({
    where: { user: user._id, title: body.title },
  });

  if (response) {
    response = await response.update({ title, columns });
  } else {
    response = await TableColumn.create({
      user: user._id,
      title: body.title,
      columns,
    });
  }

  return NextResponse.json(response);
}
