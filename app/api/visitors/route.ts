import { getUser } from "@/auth/user";
import Visitor from "@/models/visitior";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();
  const body = await request.json();

  if (!body.location?.coordinates) {
    return new Response(JSON.stringify({ error: "Coordinates not found" }), {
      status: 400,
    });
  }
  const query: any = {};
  if (user) {
    query.user_id = user.id;
  }

  const existingVisitor = await Visitor.findOne({
    where: query,
  });

  if (existingVisitor) {
    await existingVisitor.update({
      user_id: user?.id,
      is_public: true,
      location: {
        type: "Point",
        coordinates: [
          body.location.coordinates.lng,
          body.location.coordinates.lat,
        ],
      },
      name: body.name,
      os: body.os,
      type: body.type,
    });

    return new Response(JSON.stringify(existingVisitor), { status: 200 });
  } else {
    // Create new visitor
    const newVisitor = await Visitor.create({
      user_id: user?.id,
      is_public: true,
      location: {
        type: "Point",
        coordinates: [
          body.location.coordinates.lng,
          body.location.coordinates.lat,
        ],
      },
      name: body.name,
      os: body.os,
      type: body.type,
    });

    return new Response(JSON.stringify(newVisitor), { status: 201 });
  }
}
