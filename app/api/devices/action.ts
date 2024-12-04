import User from "@/models/user";
import { ADMIN } from "@/roles";
import { Op } from "sequelize";

export const getDeviceQuery = ({
  searchParams,
  user,
}: {
  searchParams: any;
  user: User;
}) => {
  const { search, client } = searchParams;

  const where: any = { isPublic: true };

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  if (client) where.clientId = client;

  if (ADMIN !== user.role) {
    where.clientId = user.clientId;
  }

  return where;
};
