"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { cookie } from "./utils";
const key = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function encrypt(payload: { sub: string; expires: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1day")
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifySession() {
  const c = cookies().get(cookie.name)?.value;
  const session = await decrypt(c);
  if (!session?.sub) return;
  return { sub: session.sub };
}

export async function createSession(sub: string) {
  const expires = new Date(Date.now() + cookie.duration);
  const session = await encrypt({ sub, expires });
  //@ts-ignore
  cookies().set(cookie.name, session, { ...cookie.options, expires });
}

export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const sessionId = request.cookies.get(cookie.name)?.value;
  if (!sessionId) return;

  const sessionVerify = await verifySession();
  if (!sessionVerify?.sub) return;

  const expires = new Date(Date.now() + cookie.duration);

  const session = await encrypt({
    sub: sessionVerify.sub as string,
    expires,
  });

  response.cookies.set({
    name: cookie.name,
    value: session,
    ...cookie.options,
    expires,
  });
  return response;
}
