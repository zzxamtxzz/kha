import { getUser } from "@/auth/user";
import TableColumn from "@/models/column";
import { cookies } from "next/headers";
import DeviceClient from "./client";

async function Clients({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const state = cookies().get("/devicesstate")?.value;

  let saveColumns = await TableColumn.findOne({
    where: { user: user._id, title: "clients" },
  });
  return (
    <DeviceClient
      saveColumns={JSON.stringify(saveColumns?.columns || [])}
      state={state}
    />
  );
}

export default Clients;
