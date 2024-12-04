import Client from "@/models/client";
import CreateClientClient from "./client";

async function CreateClient({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const edit = searchParams.edit as string;
  let data;
  if (edit) {
    data = await Client.findByPk(Number(edit));
  }
  return (
    <CreateClientClient edit={JSON.stringify({ ...data?.dataValues, edit })} />
  );
}

export default CreateClient;
