import { getUser } from "@/auth/user";
import BillModel from "@/models/bill";
import Device from "@/models/devices";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });
  const body = (await request.json()) as any[];

  const data = await Promise.all(
    body.map(async (i) => {
      const device = await Device.findOne({ where: { email: i.device } });
      if (!device) return;
      return {
        ...i,
        amount: i.amount,
        fee: i.fee,
        remark: i.remark,
        device_id: device.id,
        created_by_id: user.id,
      };
    })
  );

  try {
    await Promise.all(
      data
        .filter((d) => d)
        .map(async (bill) => {
          const { id } = bill;
          let exist = null;
          if (id) {
            exist = await BillModel.findOne({
              where: { id },
            });
          }
          if (exist) {
            await exist.update(bill);
            return exist;
          } else {
            const response = await BillModel.create(bill);
            return response;
          }
        })
    );
    return Response.json({ message: "success" });
  } catch (error: any) {
    console.error("Error creating bill:", error);
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
//       device_serial: i.device_serial,
//       account_number: i.account_number,
//       kit_number: i.kit_number,
//       fee: i.fee,
//       remark: i.remark,
//       client_id: client?.id,
//       created_by_id: user.id,
//     };
//   });

//   try {
//     const newClients = await Device.bulkCreate(data);
//     return Response.json(newClients);
//   } catch (error: any) {
//     console.error("Error creating client:", error);
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }
