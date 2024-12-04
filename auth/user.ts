import { verifySession } from "@/lib/session";
import { authMiddleware } from "@/middlewares/auth";
import User from "@/models/user";
import { cache } from "react";

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return;
  const sub = await authMiddleware(session.sub as string);

  if (!sub) return;
  const data = await User.findByPk(Number(sub));
  return data;
});
