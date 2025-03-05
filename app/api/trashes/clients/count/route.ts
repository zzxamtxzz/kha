import TrashModel from "@/models/trashes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await TrashModel.count({
      where: { is_public: true, fromModel: "clients" },
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching count:", error);
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}
