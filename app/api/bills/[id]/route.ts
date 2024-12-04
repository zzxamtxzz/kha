import { getUser } from "@/auth/user";
import BillModel from "@/models/bill";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  try {
    await BillModel.update(
      { isPublic: false },
      {
        where: { _id: params.id },
      }
    );

    return Response.json({ message: "deleted" });
  } catch (error: any) {
    console.error("Error creating DeviceModel:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
