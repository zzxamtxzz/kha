"use client";
import { notFound, useRouter } from "next/navigation";
import CreateDeviceClient from "./form";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import useGetEdit from "@/app/hooks/useGetEdit";
import SpinLoading from "@/components/loadings/spinloading";

function CreatePlanClient() {
  const router = useRouter();
  const { loading, defaultValues } = useGetEdit({
    title: "plans",
    defaultValues: {},
  });
  if (loading) return <SpinLoading />;

  return (
    <div className="w-[700px] px-auto p-4 cart-bg rounded-lg">
      <div className="relative">
        <p className="font-bold text-lg text-center">New plan</p>
        <Button
          onClick={() => router.back()}
          type="reset"
          className="w-8 h-8 rounded-full p-0 absolute right-1 top-0"
        >
          <X className="w-4" />
        </Button>
      </div>
      <CreateDeviceClient
        onSuccess={() => router.back()}
        defaultValues={defaultValues}
      />
    </div>
  );
}

export default CreatePlanClient;
