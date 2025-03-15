import User from "@/models/user";
import { Op } from "sequelize";

export const getDeviceQuery = ({
  searchParams,
  user,
}: {
  searchParams: any;
  user: User;
}) => {
  const { search, client, branch } = searchParams;
  const where: any = { is_public: true };

  if (search) {
    where[Op.or] = [
      { snNo: { [Op.like]: `%${search}%` } },
      { accNo: { [Op.like]: `%${search}%` } },
      { kitNo: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { remark: { [Op.like]: `%${search}%` } },
      { "$client.name$": { [Op.like]: `%${search}%` } },
    ];
  }

  if (client) where.client_id = client;

  return where;
};
