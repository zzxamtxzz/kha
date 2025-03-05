import Device from "@/models/devices";
import TrashModel from "@/models/trashes";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await TrashModel.findAll({
      where: { is_public: true, fromModel: "devices" },
      include: [
        {
          model: Device,
          as: "device",
          attributes: ["id", "id", "name", "email"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "id", "name", "email"],
        },
      ],
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch count" },
      { status: 500 }
    );
  }
}
