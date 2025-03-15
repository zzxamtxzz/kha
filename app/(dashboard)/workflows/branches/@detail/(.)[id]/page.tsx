import { Modal } from "@/components/shared/modal";
import BranchDetail from "../../[id]/page";

function ClientDetailModal() {
  return (
    <Modal className="w-[700px] p-4 h-full">
      <BranchDetail />
    </Modal>
  );
}

export default ClientDetailModal;
