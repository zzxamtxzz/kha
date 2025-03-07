"use client";
import { useRouter, useSearchParams } from "next/navigation";
import CreateDeviceClient from "./form";
import useGetEdit from "@/app/hooks/useGetEdit";
import SpinLoading from "@/components/loadings/spinloading";

function CreateDevice() {
  const searchParams = useSearchParams();
  const { defaultValues, loading } = useGetEdit({
    defaultValues: {
      email: "",
      client_id: searchParams.get("client_id"),
      device_serial: "",
      account_number: "",
      kit_number: "",
      remark: "",
    },
    title: "devices",
  });

  const router = useRouter();
  if (loading) return <SpinLoading />;

  return (
    <CreateDeviceClient
      defaultValues={defaultValues}
      onSuccess={() => router.back()}
    />
  );
}

export default CreateDevice;
