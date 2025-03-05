"use server";
import { createSession, verifySession } from "@/lib/session";
import { cookie } from "@/lib/utils";
import Session from "@/models/session";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Op } from "sequelize";
import { generateRefreshToken, generateToken } from "./token";

export async function login(state: any, formData: FormData) {
  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  try {
    const user = (
      await User.scope("withPassword").findOne({
        where: {
          is_public: true,
          active: true,
          [Op.or]: [{ username: data.username }, { email: data.username }],
        },
      })
    )?.dataValues;

    if (!user) return { error: "invalid credentials" };
    if (user.password) {
      const match = await bcrypt.compare(data.password, user.password);
      if (!match) return { error: "invalid credential!" };
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const expires = new Date(Date.now() + cookie.duration);
    const sessionData = { token, refreshToken };
    const session = await Session.create({
      expires,
      session: sessionData,
      user: user.id,
    });

    await createSession(session.id);
  } catch (error) {
    return console.log("error", error);
  }
  redirect("/home");
}

export async function logout() {
  const session = await verifySession();
  if (!session) return;
  const user = await Session.findByPk(session.sub);

  if (!user) {
    throw new Error("User not found");
  }

  await user.update({ is_public: false });
  cookies().delete(cookie.name);

  redirect("/login");
}
