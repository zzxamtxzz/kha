import { Modal } from "@/components/shared/modal";
import BillDetail from "../../[id]/page";

function ClientDetailModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <BillDetail params={params} />
    </Modal>
  );
}

export default ClientDetailModal;
