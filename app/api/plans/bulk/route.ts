import { getUser } from "@/auth/user";
import Device from "@/models/devices";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = (await request.json()) as any[];

  const data = body.map((i) => {
    return {
      name: i.name,
      fee: i.fee,
      amount: i.amount,
      remark: i.remark,
      created_by_id: user.id,
    };
  });

  try {
    const newClients = await Device.bulkCreate(data);
    return Response.json(newClients);
  } catch (error: any) {
    console.error("Error creating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
