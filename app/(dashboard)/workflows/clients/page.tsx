import { StateProvider } from "@/app/contexts/state";
import { getUser } from "@/auth/user";
import TableColumn from "@/models/column";
import ClientsClient from "./client";

async function Clients() {
  const user = await getUser();
  if (!user) return;

  if (!user.super_admin && !user.role?.permissions?.clients?.includes("read")) {
    return null;
  }

  let saveColumns = await TableColumn.findOne({
    where: { user: user.id, title: "clients" },
  });

  return (
    <StateProvider title="clients">
      <ClientsClient saveColumns={saveColumns ? saveColumns.columns : "[]"} />
    </StateProvider>
  );
}

export default Clients;
