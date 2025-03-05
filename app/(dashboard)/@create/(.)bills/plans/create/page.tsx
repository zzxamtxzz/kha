import CreatePlan from "@/app/(dashboard)/bills/plans/create/page";
import { Modal } from "@/components/shared/modal";

function PlanCreateModal() {
  return (
    <Modal>
      <div className="w-full h-full p-4">
        <CreatePlan />
      </div>
    </Modal>
  );
}

export default PlanCreateModal;
