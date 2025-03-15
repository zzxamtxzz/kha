"use client";
import Events from "@/app/(dashboard)/components/events";
import Bill from "@/models/bill";
import BillForm from "./form";

const BillDetailClient = ({
  data,
  onSuccess,
}: {
  data?: Bill;
  onSuccess: () => void;
}) => {
  return (
    <div className="w-full h-full flex card-bg">
      <BillForm onSuccess={onSuccess} defaultValues={data} />
      {data?.id && (
        <>
          <div className="w-10 h-full nav-bg"></div>
          <Events data_id={data.id} />
        </>
      )}
    </div>
  );
};

export default BillDetailClient;
