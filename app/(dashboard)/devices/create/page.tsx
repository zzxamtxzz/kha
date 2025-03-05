"use client";
import { actions, ADMIN, roles } from "@/roles";
import { useRouter, useSearchParams } from "next/navigation";
import CreateDeviceClient from "./form";
import { useHasUser } from "@/app/contexts/user";

function CreateDevice() {
  const { user } = useHasUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const foundRole = roles.find((r) => r.name === user.role);
  if (ADMIN !== user.role && !foundRole?.devices.includes(actions.CREATE))
    return null;

  return (
    <CreateDeviceClient
      defaultValues={{
        email: "",
        client_id: searchParams.get("client_id"),
        name: "",
        fee: "",
        device_serial: "",
        account_number: "",
        kit_number: "",
        remark: "",
      }}
      onSuccess={() => router.back()}
    />
  );
}

export default CreateDevice;
