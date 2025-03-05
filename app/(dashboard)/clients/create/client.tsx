"use client";
import useGetEdit from "@/app/hooks/useGetEdit";
import CreateClientForm from "./form";
import SpinLoading from "@/components/loadings/spinloading";

const CreateClientClient = ({ onSuccess }: { onSuccess: () => void }) => {
  const { defaultValues, loading } = useGetEdit({
    title: "clients",
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      username: "",
      remark: "",
    },
  });

  if (loading) return <SpinLoading />;
  return (
    <CreateClientForm defaultValues={defaultValues} onSuccess={onSuccess} />
  );
};

export default CreateClientClient;
