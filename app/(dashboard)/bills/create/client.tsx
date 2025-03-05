"use client";
import useGetEdit from "@/app/hooks/useGetEdit";
import BillForm from "./form";
import SpinLoading from "@/components/loadings/spinloading";
import { useSearchParams } from "next/navigation";

const CreateBillClient = () => {
  const searchParams = useSearchParams();
  const { loading, defaultValues } = useGetEdit({
    defaultValues: {
      device_id: searchParams.get("device_id") as string,
      billing_date: new Date(),
      plan_id: "",
      duration_month: 1,
      amount: 0,
      fee: 0,
      remark: "",
    },
    title: "bills",
  });

  if (loading) return <SpinLoading />;

  return <BillForm defaultValues={defaultValues} />;
};

export default CreateBillClient;
