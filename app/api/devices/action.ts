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

  const where: any = { is_public: true };

  if (search) {
    where[Op.or] = [
      { device_serial: { [Op.like]: `%${search}%` } },
      { account_number: { [Op.like]: `%${search}%` } },
      { kit_number: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { remark: { [Op.like]: `%${search}%` } },
      { "$client.name$": { [Op.like]: `%${search}%` } },
      { "$client.first_name$": { [Op.like]: `%${search}%` } },
      { "$client.last_name$": { [Op.like]: `%${search}%` } },
    ];
  }

  if (client) where.client_id = client;

  if (ADMIN !== user.role) {
    where.client_id = user.client_id;
  }

  return where;
};
