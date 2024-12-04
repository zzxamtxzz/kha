import Client from "@/models/client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const data = await Client.findAll();
    return Response.json(data);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
