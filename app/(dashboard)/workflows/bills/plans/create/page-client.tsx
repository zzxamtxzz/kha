"use client";
import useGetEdit from "@/app/hooks/useGetEdit";
import SpinLoading from "@/components/loadings/spinloading";
import { useRouter } from "next/navigation";
import CreatePlanForm from "./client";

function CreatePlanClient() {
  const router = useRouter();
  const { defaultValues, loading } = useGetEdit({
    title: "plans",
  });
  if (loading) return <SpinLoading />;
  return (
    <div className="w-full h-full px-auto p-4 center">
      <CreatePlanForm
        onSuccess={() => router.back()}
        onClose={() => router.back()}
      />
    </div>
  );
}

export default CreatePlanClient;
