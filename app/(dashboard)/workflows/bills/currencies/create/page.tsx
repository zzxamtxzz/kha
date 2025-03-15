import { getUser } from "@/auth/user";
import CreateCurrencyClient from "./client";

async function CreateCurrency() {
  const user = await getUser();
  if (!user) return null;
  if (
    !user.super_admin &&
    !user.role?.permissions?.currencies?.includes("create") &&
    !user.role?.permissions?.currencies?.includes("update")
  ) {
    return null;
  }
  return (
    <div className="w-full h-full px-auto p-4 center">
      <CreateCurrencyClient />
    </div>
  );
}

export default CreateCurrency;
