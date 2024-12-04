import BillPlans from "@/app/(dashboard)/bills/plans/page";
import { Modal } from "@/components/shared/modal";

function PlansModal({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <BillPlans searchParams={searchParams} />
    </Modal>
  );
}

export default PlansModal;
