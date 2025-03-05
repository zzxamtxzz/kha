import { getUser } from "@/auth/user";
import Device from "@/models/devices";
import { actions, ADMIN, roles } from "@/roles";
import { NextRequest } from "next/server";
import { getDeviceQuery } from "../action";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "user not found" }, { status: 404 });

  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.devices.includes(actions.READ))
    return Response.json({ error: "not allow" }, { status: 404 });

  const where = getDeviceQuery({ user, searchParams: {} });
  const data = await Device.findAll({ where });

  return Response.json(data);
}
