import BillDetailSkeleton from "../components/bill-detail-skeleton";

export default function BillLoading() {
  return (
    <div className="container py-6 md:py-10">
      <BillDetailSkeleton />
    </div>
  );
}
