import { getUser } from "@/auth/user";
import TableColumn from "@/models/column";
import { cookies } from "next/headers";
import ClientsClient from "./client";

async function Clients({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const state = cookies().get("/clientsstate")?.value;

  let saveColumns = await TableColumn.findOne({
    where: { user: user.id, title: "clients" },
  });
  return (
    <ClientsClient
      saveColumns={saveColumns ? saveColumns.columns : "[]"}
      state={state}
    />
  );
}

export default Clients;
