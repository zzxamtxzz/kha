"use client";
import Plan from "@/models/plan";
import { useRouter } from "next/navigation";
import CreateDeviceClient from "./client";

function CreatePlanClient({ plan }: { plan?: Plan }) {
  const router = useRouter();

  return (
    <CreateDeviceClient
      className="w-[700px] mx-auto"
      onSuccess={() => router.back()}
      defaultValues={plan}
    />
  );
}

export default CreatePlanClient;
