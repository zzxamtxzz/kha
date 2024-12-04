import { getUser } from "@/auth/user";
import Client from "@/models/client";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = (await request.json()) as any[];

  const data = body.map((i) => ({
    ...i,
    email:
      i.email || i.name?.replace(/\s+/g, "").toLowerCase() + "@starlink.com",
    name: i.name,
    remark: i.remark,
    createdById: user._id,
  }));

  try {
    await Promise.all(
      data.map(async (client) => {
        const { _id } = client;
        let existingClient = null;
        if (_id) {
          existingClient = await Client.findOne({
            where: { _id },
          });
        }
        if (existingClient) {
          await existingClient.update({
            name: "update name",
            email: client.email,
            remark: client.remark,
          });
          return existingClient;
        } else {
          const hashedPassword = await bcrypt.hash(
            client.password?.toString() || "123654987",
            10
          );

          const data = {
            ...client,
            password: hashedPassword,
          };
          await User.create(data);
          const response = await Client.create(client);
          return response;
        }
      })
    );
    return Response.json({ message: "success" });
  } catch (error: any) {
    console.error("Error creating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
