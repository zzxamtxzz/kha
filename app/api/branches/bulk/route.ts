import { getUser } from "@/auth/user";
import Client from "@/models/client";
import Device from "@/models/devices";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = (await request.json()) as any[];

  const data = body.map((i) => ({
    ...i,
    created_by_id: user.id,
  }));

  try {
    await Promise.all(
      data.map(async (branch) => {
        const { id } = branch;
        let exist = null;
        if (id) {
          exist = await Client.findOne({
            where: { id },
          });
        }
        if (exist) {
          await exist.update({
            name: "update name",
            remark: branch.remark,
          });
          return exist;
        }
        const response = await Client.create(branch);
        const data = {
          ...branch,
          _id: response.id,
          created_by_id: user.id,
          ref: `Bulk create by ${user.name}`,
        };
        console.log("response ", response.id);
        await Device.create(data);
        return response;
      })
    );
    return Response.json({ message: "success" });
  } catch (error: any) {
    console.error("Error creating :", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
