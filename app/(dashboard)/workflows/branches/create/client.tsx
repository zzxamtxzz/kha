"use client";
import useGetEdit from "@/app/hooks/useGetEdit";
import SpinLoading from "@/components/loadings/spinloading";
import CreateBranchForm from "./form";

const CreateClientClient = ({ onSuccess }: { onSuccess: () => void }) => {
  const { defaultValues, loading } = useGetEdit({
    title: "branches",
    defaultValues: {
      email: "",
      phone_number: "",
      username: "",
      remark: "",
    },
  });

  if (loading) return <SpinLoading />;
  return (
    <CreateBranchForm defaultValues={defaultValues} onSuccess={onSuccess} />
  );
};

export default CreateClientClient;
