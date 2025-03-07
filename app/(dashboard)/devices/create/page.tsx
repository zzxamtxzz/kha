import { actions, ADMIN, roles } from "@/roles";
import CreateDeviceClient from "./client";
import { getUser } from "@/auth/user";

async function CreateDevice() {
  const user = await getUser();
  if (!user) return null;
  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.devices.includes(actions.CREATE))
    return null;

  return (
    <div className="w-full h-full center">
      <CreateDeviceClient />
    </div>
  );
}

export default CreateDevice;
