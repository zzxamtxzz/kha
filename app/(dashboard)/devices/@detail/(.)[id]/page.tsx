import { Modal } from "@/components/shared/modal";
import DeviceDetail from "../../[id]/page";

function ClientDetailModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <DeviceDetail params={params} />
    </Modal>
  );
}

export default ClientDetailModal;
