import { getUser } from "@/auth/user";
import Client from "@/models/client";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = (await request.json()) as any[];

  const data = body.map((i) => ({
    ...i,
    name: i.name,
    remark: i.remark,
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
        } else {
          const hashedPassword = await bcrypt.hash(
            client.password?.toString() || "123654987",
            10
          );

          const data = {
            ...client,
            password: hashedPassword,
          };
          // await User.create(data);
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
