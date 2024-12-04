import bcrypt from "bcrypt";
import User from "@/models/user";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json({ error: "Invalid password" }, { status: 401 });
    }

    // Password is valid, proceed with login
    return Response.json({ message: "Login successful", user });
  } catch (error: any) {
    console.error("Error during login:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
