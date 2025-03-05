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
      data.map(async (client) => {
        const { id } = client;
        let exist = null;
        if (id) {
          exist = await Client.findOne({
            where: { id },
          });
        }
        if (exist) {
          await exist.update({
            name: "update name",
            email: client.email,
            remark: client.remark,
          });
          return exist;
        }
        const response = await Client.create(client);
        const data = {
          ...client,
          email: client.email,
          device_serial: client.device_serial,
          account_number: client.account_number,
          kit_number: client.kit_number,
          fee: client.fee,
          remark: client.remark,
          client_id: response.id,
          created_by_id: user.id,
          ref: `Bulk create by ${user.name}`,
        };
        console.log("response client", response.id);
        await Device.create(data);
        return response;
      })
    );
    return Response.json({ message: "success" });
  } catch (error: any) {
    console.error("Error creating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
