"use client";
import { actions, ADMIN, roles } from "@/roles";
import { notFound } from "next/navigation";
import CreateDeviceClient from "./form";
import { useHasUser } from "@/app/contexts/user";

function CreateDevice({
  defaultValues,
  onSuccess,
}: {
  defaultValues: any;
  onSuccess: () => void;
}) {
  const { user } = useHasUser();
  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.devices.includes(actions.CREATE))
    return notFound();

  return (
    <CreateDeviceClient defaultValues={defaultValues} onSuccess={onSuccess} />
  );
}

export default CreateDevice;
