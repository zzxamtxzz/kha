"use client";
import Events from "@/app/(dashboard)/components/events";
import { useDetail } from "@/app/hooks/useDetail";
import SpinLoading from "@/components/loadings/spinloading";
import Bill from "@/models/bill";
import Currency from "@/models/currency";
import BillForm from "./form";
import BillFormSkeleton from "./loading";

const CreateBillClient = ({
  data,
  onSuccess,
  onClose,
}: {
  data?: Bill;
  onSuccess: () => void;
  onClose?: () => void;
}) => {
  const {
    data: currency,
    isLoading,
    queryKey,
  } = useDetail<Currency>({
    id: "default-currency",
    title: "currencies",
  });
  const { data: status, isLoading: statusLoading } = useDetail<Currency>({
    id: "default-status",
    title: "statuses",
  });

  return (
    <div className="w-full h-full flex card-bg">
      {isLoading || statusLoading ? (
        <BillFormSkeleton />
      ) : (
        <BillForm
          onClose={onClose}
          onSuccess={onSuccess}
          defaultValues={{ currency, status, ...data }}
        />
      )}
      {data?.id && (
        <>
          <div className="w-10 h-full nav-bg"></div>
          <Events data_id={data.id} />
        </>
      )}
    </div>
  );
};

export default CreateBillClient;
