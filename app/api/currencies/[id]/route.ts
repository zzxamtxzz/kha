import { getUser } from "@/auth/user";
import Currency from "@/models/currency";
import Plan from "@/models/plan";
import User from "@/models/user";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const response = await Currency.findByPk(params.id, {
    include: [
      { model: User, as: "created_by", attributes: ["id", "name", "username"] },
    ],
  });
  if (!response)
    return Response.json({ message: "Client is not found" }, { status: 404 });
  return Response.json(response);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  try {
    await Plan.destroy({
      where: { id: params.id },
    });

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    console.error("Error creating Device:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
