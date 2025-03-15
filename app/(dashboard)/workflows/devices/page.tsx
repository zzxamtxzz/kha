import { StateProvider } from "@/app/contexts/state";
import { getUser } from "@/auth/user";
import TableColumn from "@/models/column";
import DeviceDashboard from "./client";

async function Clients() {
  const user = await getUser();
  if (!user) return;

  if (!user.super_admin && !user.role?.permissions?.devices?.includes("read")) {
    return null;
  }

  let saveColumns = await TableColumn.findOne({
    where: { user: user.id, title: "devices" },
  });

  return (
    <StateProvider title="devices">
      <DeviceDashboard
        saveColumns={JSON.stringify(saveColumns?.columns || [])}
      />
    </StateProvider>
  );
}

export default Clients;
