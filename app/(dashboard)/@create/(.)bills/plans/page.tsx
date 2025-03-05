import BillPlans from "@/app/(dashboard)/bills/plans/page";
import { Modal } from "@/components/shared/modal";

function PlansModal() {
  return (
    <Modal>
      <BillPlans />
    </Modal>
  );
}

export default PlansModal;
