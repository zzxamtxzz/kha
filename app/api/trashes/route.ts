import { NextRequest } from "next/server";
import { createUser } from "../../../actions/user";

export async function POST(request: NextRequest) {
  // const user = await getUser();
  // if (user?.role !== ADMIN)
  //   return Response.json({ error: "user not found" }, { status: 404 });

  const body = await request.json();
  console.log(body);
  try {
    const newUser = await createUser(body);
    return Response.json(newUser);
  } catch (error: any) {
    console.error("Error creating client:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
