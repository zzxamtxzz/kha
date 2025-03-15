"use server";
import { cookie } from "@/lib/utils";
import { cookies } from "next/headers";

export async function updateListStateParams(key: string, value: string) {
  const expires = new Date(Date.now() + cookie.duration);
  cookies().set(key, value, { expires });
}
