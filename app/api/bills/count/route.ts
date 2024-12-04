import BillModel from "@/models/bill";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const bills = await BillModel.count();
    return NextResponse.json(bills);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
