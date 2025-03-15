import { verifySession } from "@/lib/session";
import { authMiddleware } from "@/middlewares/auth";
import Role from "@/models/role";
import User from "@/models/user";
import { cache } from "react";

const env = process.env.NODE_ENV === "development";

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return;
  const sub = await authMiddleware(session.sub as string);

  if (!sub) return;

  const data = await User.findByPk(sub, {
    include: [{ model: Role, as: "role" }],
  });
  if (!data) return null;
  const response = data.toJSON();
  if (response.role) {
    response.role.permissions = env
      ? JSON.parse(response.role.permissions)
      : response.role.permissions;
  }
  return response;
});
