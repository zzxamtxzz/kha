import { Modal } from "@/components/shared/modal";
import BillPlansClient from "../../plans/client";

function BillPlanModal() {
  return (
    <Modal className="h-[95vh] center">
      <BillPlansClient showHeader />
    </Modal>
  );
}

export default BillPlanModal;
