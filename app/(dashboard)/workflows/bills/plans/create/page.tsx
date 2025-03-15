import { getUser } from "@/auth/user";
import CreatePlanClient from "./page-client";

async function CreatePlan() {
  const user = await getUser();
  if (!user) return null;
  if (!user.super_admin && !user.role?.permissions?.plans?.includes("create"))
    return null;

  return (
    <div className="w-full h-full px-auto p-4 center">
      <CreatePlanClient />
    </div>
  );
}

export default CreatePlan;
