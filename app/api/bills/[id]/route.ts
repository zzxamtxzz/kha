import { getUser } from "@/auth/user";
import Bill from "@/models/bill";
import Plan from "@/models/billplan";
import Device from "@/models/devices";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const response = await Bill.findByPk(params.id, {
    include: [
      { model: Device, as: "device" },
      { model: Plan, as: "plan" },
    ],
  });
  if (!response)
    return Response.json({ message: "Bill is not found" }, { status: 404 });
  return Response.json(response);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  try {
    await Bill.update(
      { is_public: false },
      {
        where: { id: params.id },
      }
    );

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    console.error("Error creating Device:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
