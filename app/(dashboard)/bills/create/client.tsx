"use client";
import useGetEdit from "@/app/hooks/useGetEdit";
import BillForm from "./form";
import SpinLoading from "@/components/loadings/spinloading";
import Device from "@/models/devices";
import Plan from "@/models/billplan";
import Events from "../../_components/events";

const CreateBillClient = ({
  device,
  onSuccess,
  plan,
  edit,
}: {
  device?: Device | null;
  onSuccess: () => void;
  plan?: Plan;
  edit?: string;
}) => {
  const { loading, defaultValues } = useGetEdit({
    defaultValues: {
      device_id: device?.id,
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

  return (
    <div className="w-full h-full flex cart-bg">
      <BillForm
        onSuccess={onSuccess}
        device={device}
        plan={plan}
        defaultValues={defaultValues}
      />
      <div className="w-10 h-full nav-bg"></div>
      {edit && <Events data_id={edit} />}
    </div>
  );
};

export default CreateBillClient;
