"use client";
import useGetEdit from "@/app/hooks/useGetEdit";
import SpinLoading from "@/components/loadings/spinloading";
import { useRouter } from "next/navigation";
import CreateDeviceClient from "./form";
import { useHasUser } from "@/app/contexts/user";

function CreateCurrencyClient() {
  const router = useRouter();
  const { user } = useHasUser();
  if (
    !user.super_admin &&
    !user.role?.permissions?.currencies?.includes("create")
  ) {
    return null;
  }

  const { loading, defaultValues } = useGetEdit({
    title: "plans",
    defaultValues: {},
  });
  if (loading) return <SpinLoading />;

  return (
    <CreateDeviceClient
      className="w-[700px] mx-auto"
      onSuccess={() => router.back()}
      defaultValues={defaultValues}
    />
  );
}

export default CreateCurrencyClient;
