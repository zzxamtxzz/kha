import User from "@/models/user";
import bcrypt from "bcrypt";

export const createUser = async (data: any) => {
  const { name, email, username, password, client_id } = data;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      username,
      client_id,
      password: hashedPassword,
    });

    return newUser;
  } catch (error: any) {
    return error;
  }
};
