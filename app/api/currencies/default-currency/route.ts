import { getUser } from "@/auth/user";
import Currency from "@/models/currency";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (
    !user.super_admin &&
    !user.role?.permissions?.currencies?.includes("read")
  )
    return Response.json({ error: "not allow" }, { status: 404 });

  const response = await Currency.findOne({
    where: { is_public: true, use_as_default: true },
    order: [["created_at", "DESC"]],
  });
  if (!response)
    return Response.json({ error: "default currency is not found" });

  return Response.json(response);
}
