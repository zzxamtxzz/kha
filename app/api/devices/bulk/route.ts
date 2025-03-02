import { getUser } from "@/auth/user";
import Client from "@/models/client";
import DeviceModel from "@/models/devices";
import { ADMIN } from "@/roles";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  if (ADMIN !== user.role)
    return Response.json({ error: "not allow" }, { status: 400 });

  const body = (await request.json()) as any[];
  const clients = await Client.findAll({ where: { isPublic: true } });

  const data = body.map((i) => {
    const client = clients.find(
      (c) => c.name?.toLowerCase() === i.client?.toLowerCase()
    );
    return {
      ...i,
      email: i.email,
      name: i.name,
      deviceSerial: i.deviceSerial,
      accNo: i.accNo,
      kitNo: i.kitNo,
      serviceFee: i.serviceFee,
      remark: i.remark,
      client_id: i.client_id || client?.id,
      created_by_id: user.id,
      ref: `Bulk create by ${user.name}`,
    };
  });

  try {
    await Promise.all(
      data.map(async (device) => {
        const { id } = device;
        let exist = null;
        if (id) {
          exist = await DeviceModel.findOne({
            where: { id },
          });
        }
        if (exist) {
          await exist.update(device);
          return exist;
        } else {
          const response = await DeviceModel.create(device);
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

// export async function POST(request: NextRequest) {
//   const user = await getUser();
//   if (!user) return Response.json({ error: "user not found" }, { status: 404 });
//   const body = (await request.json()) as any[];

//   const clients = await Client.findAll();

//   const data = body.map((i) => {
//     const client = clients.find((c) => c.id === i.client);
//     return {
//       email: i.email,
//       name: i.name,
//       deviceSerial: i.deviceSerial,
//       accNo: i.accNo,
//       kitNo: i.kitNo,
//       serviceFee: i.serviceFee,
//       remark: i.remark,
//       client_id: client?.id,
//       created_by_id: user.id,
//     };
//   });

//   try {
//     const newClients = await DeviceModel.bulkCreate(data);
//     return Response.json(newClients);
//   } catch (error: any) {
//     console.error("Error creating client:", error);
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }
