import { getUser } from "@/auth/user";
import ClientsClient from "./client";

async function Clients() {
  const user = await getUser();
  if (!user) return;

  if (
    !user.super_admin &&
    !user.role?.permissions?.branches?.includes("read")
  ) {
    return null;
  }

  return <ClientsClient />;
}

export default Clients;
